import React, { useContext, useEffect, useReducer } from 'react';
import styled from 'styled-components';
import { DataGrid } from '@mui/x-data-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Store } from '../../Store';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { getError } from '../../utils';

const Container = styled.div`
  flex: 4;
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev1)' : 'var(--light-ev1)'};
  margin: 0 20px;
  border-radius: 0.2rem;
`;
const Title = styled.h1`
  padding: 20px 20px 0 20px;
`;
const User = styled.div`
  display: flex;
  align-items: center;
  & img {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    margin-right: 10px;
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

const reducer = (state, action) => {
  switch (action.type) {
    case 'USERS_REQUEST':
      return { ...state, loading: true };
    case 'USERS_SUCCESS':
      return {
        ...state,
        users: action.payload,
        loading: false,
      };
    case 'USERS_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      return state;
  }
};

export default function UserList() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo } = state;

  const [{ loading, loadingDelete, successDelete, users, error }, dispatch] =
    useReducer(reducer, {
      loading: true,
      users: [],
      error: '',
    });

  useEffect(() => {
    const fetchAllUser = async () => {
      try {
        dispatch({ type: 'USERS_FETCH' });
        const { data } = await axios.get('/api/users', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'USERS_SUCCESS', payload: data });
      } catch (err) {
        console.log(getError(err));
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchAllUser();
    }
  }, [successDelete, userInfo]);

  const deleteHandler = async (user) => {
    if (window.confirm('Are you sure to delete')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/users/${user}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'DELETE_SUCCESS' });
        ctxDispatch({
          type: 'SHOW_TOAST',
          payload: {
            message: 'User deleted',
            showStatus: true,
            state1: 'visible1 error',
          },
        });
      } catch (err) {
        console.log(getError(err));
        dispatch({ type: 'DELETE_FAIL' });
      }
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'user',
      headerName: 'User',
      width: 200,
      renderCell: (params) => {
        return (
          <User>
            <img src={params.row.image} alt="p" />
            {params.row.username}
          </User>
        );
      },
    },
    { field: 'email', headerName: 'Email', width: 200 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
    },
    {
      field: 'transactions',
      headerName: 'Transaction',
      width: 150,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => {
        return (
          <ActionSec>
            <Link to={`/dashboard/user/${params.row.id}`}>
              <Edit mode={mode}>Edit</Edit>
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

  const rows = users.map((u) => ({
    id: u._id,
    username: u.name,
    image: u.image,
    email: u.email,
    status: 'online',
    transactions: '$242.23',
  }));

  //   const rows = [
  //     {
  //       id: 1,
  //       username: 'John Doe',
  //       image: '/images/men.png',
  //       email: 'test@mail.com',
  //       status: 'online',
  //       transactions: '$242.32',
  //     },
  //     {
  //       id: 2,
  //       username: 'John Doe',
  //       image: '/images/men.png',
  //       email: 'test@mail.com',
  //       status: 'online',
  //       transactions: '$242.32',
  //     },
  //     {
  //       id: 3,
  //       username: 'John Doe',
  //       image: '/images/men.png',
  //       email: 'test@mail.com',
  //       status: 'online',
  //       transactions: '$242.32',
  //     },
  //   ];

  return (
    <Container mode={mode}>
      <Title>User List</Title>
      {console.log('user', users)}
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
          '& p.MuiTablePagination-displayedRows': {
            margin: 0,
            color: `${
              mode === 'pagebodydark'
                ? 'var(--white-color)'
                : 'var(--black-color)'
            }`,
          },
          '& .MuiButtonBase-root': {
            color: `${
              mode === 'pagebodydark'
                ? 'var(--white-color)'
                : 'var(--black-color)'
            }`,
          },
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
          },
          '& .MuiDataGrid-columnHeader:focus': {
            outline: 'solid var(--orange-color) 1px  !important',
          },
          '& .MuiCheckbox-root:hover': {
            'background-color': `${
              mode === 'pagebodydark' ? 'var(--dark-ev3)' : 'var(--light-ev3)'
            }   !important`,
          },
          '& .MuiDataGrid-columnHeader:focus-within,.MuiDataGrid-cell:focus-within':
            {
              outline: 'solid var(--orange-color) 1px  !important',
            },
        }}
        rows={rows}
        columns={columns}
        disableSelectionOnClick
        pageSize={10}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </Container>
  );
}
