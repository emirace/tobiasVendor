import React, { useContext, useEffect, useReducer } from 'react';
import styled from 'styled-components';
import { DataGrid } from '@mui/x-data-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Store } from '../../Store';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getError } from '../../utils';

const ProductLists = styled.div`
  flex: 4;
  height: 100vh;
  margin: 0 20px;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev1)' : 'var(--light-ev1)'};
`;
const Title = styled.h1`
  padding: 20px 20px 0 20px;
`;
const Product = styled.div`
  display: flex;
  align-items: center;
  & img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 10px;
  }
  & a {
    &:hover {
      text-decoration: underline;
    }
  }
`;
const Edit = styled.button`
  border: none;
  border-radius: 0.2rem;
  padding: 5px 10px;
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev3)' : '#fcf0e0'};
  color: var(--orange-color);
  cursor: pointer;
  margin-right: 10px;
`;

const ActionSec = styled.div`
  & svg {
    color: var(--red-color);
    cursor: pointer;
    &:hover {
      font-size: 18px;
    }
  }
`;
const Stock = styled.div`
  color: var(--green-color);
  &.empty {
    color: var(--red-color);
  }
`;

const reducer = (state, action) => {
  switch (action.type) {
    case 'USERS_REQUEST':
      return { ...state, loading: true };
    case 'USERS_SUCCESS':
      return {
        ...state,
        products: action.payload,
        loading: false,
      };
    case 'USERS_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      return state;
  }
};

export default function OrderList() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo } = state;

  const [{ loading, products, error, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      products: [],
      error: '',
    });

  const sellerMode = () => {
    return userInfo.isAdmin ? false : true;
  };
  const isSellerMode = sellerMode();

  useEffect(() => {
    const fetchAllProduct = async () => {
      try {
        dispatch({ type: 'USERS_FETCH' });
        const { data } = await axios.get(
          `/api/orders${isSellerMode ? '/seller/' : ''}${
            isSellerMode ? userInfo._id : ''
          }`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'USERS_SUCCESS', payload: data });
      } catch (err) {
        console.log(getError(err));
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchAllProduct();
    }
  }, [successDelete, userInfo]);

  const deleteHandler = async (order) => {
    if (window.confirm('Are you sure to delete')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/orders/${order}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'DELETE_SUCCESS' });
        ctxDispatch({
          type: 'SHOW_TOAST',
          payload: {
            message: 'Order deleted Successfully',
            showStatus: true,
            state1: 'visible1 error',
          },
        });
      } catch (err) {
        dispatch({ type: 'DELETE_FAIL' });
        console.log(getError(err));
      }
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 150 },
    {
      field: 'order',
      headerName: 'Order',
      width: 200,
      renderCell: (params) => {
        return (
          <Product>
            <Link to={`/order/${params.row.id}`}>
              <img src={params.row.image} alt="" />
              {params.row.name}
            </Link>
          </Product>
        );
      },
    },
    { field: 'deliveryStatus', headerName: 'Delivery Status', width: 150 },
    {
      field: 'payStatus',
      headerName: 'Payment Status',
      width: 150,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 100,
    },
    {
      field: 'user',
      headerName: 'Buyer',
      width: 100,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 120,
      renderCell: (params) => {
        return (
          <ActionSec>
            <Link to={`/order/${params.row.id}`}>
              <Edit mode={mode}>View</Edit>
            </Link>
            <FontAwesomeIcon
              onClick={() => deleteHandler(params.row.id)}
              icon={faTrash}
            />
          </ActionSec>
        );
      },
    },
  ];
  const rows = products.map((p) => ({
    id: p._id,
    name: p.orderItems[0].name,
    image: p.orderItems[0].image,
    deliveryStatus: p.isDelivered ? 'Delivered' : 'Not Delivered',
    payStatus: p.isPaid ? 'Paid' : 'Not Paid',
    user: p.user ? p.user.name : 'anonymous',
    amount: p.totalPrice,
  }));

  return (
    <ProductLists mode={mode}>
      <Title>Product List</Title>
      <DataGrid
        sx={{
          width: '100%',
          height: '650px',
          color: `${
            mode === 'pagebodydark'
              ? 'var(--white-color)'
              : 'var(--black-color)'
          }`,
          border: 'none',
          '& .MuiDataGrid-columnHeaders': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            border: 'none',
          },
          '& .Mui-checked': {
            color: 'var(--orange-color) !important',
          },
          '& .Mui-selected': {
            'background-color': `${
              mode === 'pagebodydark' ? 'var(--dark-ev2)' : 'var(--light-ev2)'
            } !important`,
          },
          '& .MuiDataGrid-row:hover': {
            'background-color': `${
              mode === 'pagebodydark' ? 'var(--dark-ev2)' : 'var(--light-ev2)'
            } !important`,
          },
          '& .Mui-selected:hover': {
            'background-color': `${
              mode === 'pagebodydark' ? 'var(--dark-ev3)' : 'var(--light-ev3)'
            } !important`,
          },

          '& .MuiDataGrid-cell:focus': {
            outline: 'solid var(--orange-color) 1px  !important',
            borderRadius: '0.2rem',
          },
          '& .MuiDataGrid-columnHeader:focus': {
            outline: 'solid var(--orange-color) 1px  !important',
            borderRadius: '0.2rem',
          },
          '& .MuiCheckbox-root:hover': {
            'background-color': `${
              mode === 'pagebodydark' ? 'var(--dark-ev3)' : 'var(--light-ev3)'
            }   !important`,
          },
          '& .MuiDataGrid-columnHeader:focus-within,.MuiDataGrid-cell:focus-within':
            {
              outline: 'solid var(--orange-color) 1px  !important',
              borderRadius: '0.2rem',
            },
        }}
        rows={rows}
        columns={columns}
        disableSelectionOnClick
        pageSize={10}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </ProductLists>
  );
}
