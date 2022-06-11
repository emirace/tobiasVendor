import React, { useContext } from 'react';
import styled from 'styled-components';
import { DataGrid } from '@mui/x-data-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Store } from '../../Store';
import { Link } from 'react-router-dom';

const ProductLists = styled.div`
  flex: 4;
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
  }
`;
const Stock = styled.div`
  color: var(--green-color);
  &.empty {
    color: var(--red-color);
  }
`;

export default function ProductList() {
  const { state } = useContext(Store);
  const { mode } = state;
  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'product',
      headerName: 'Product',
      width: 200,
      renderCell: (params) => {
        return (
          <Product>
            <img src={params.row.image} alt="" />
            {params.row.name}
          </Product>
        );
      },
    },
    { field: 'stock', headerName: 'Stock', width: 100 },
    {
      field: 'status',
      headerName: 'Status',
      width: 200,
      renderCell: (params) => {
        return params.row.stock ? (
          <Stock>{params.row.stock ? 'In Stock' : 'Out of Stock'}</Stock>
        ) : (
          <Stock className="empty">
            {params.row.stock ? 'In Stock' : 'Out of Stock'}
          </Stock>
        );
      },
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 150,
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => {
        return (
          <ActionSec>
            <Link to="/dashboard/product">
              <Edit mode={mode}>Edit</Edit>
            </Link>
            <FontAwesomeIcon icon={faTrash} />
          </ActionSec>
        );
      },
    },
  ];

  const rows = [
    {
      id: 1,
      name: 'John Doe',
      image: '/images/men.png',
      stock: 10,
      price: '$242.32',
    },
    {
      id: 2,
      name: 'John Doe',
      image: '/images/men.png',
      stock: 0,
      price: '$242.32',
    },
    {
      id: 3,
      name: 'John Doe',
      image: '/images/men.png',
      stock: 10,
      price: '$242.32',
    },
  ];
  return (
    <ProductLists mode={mode}>
      <Title>Product List</Title>
      <DataGrid
        sx={{
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
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </ProductLists>
  );
}
