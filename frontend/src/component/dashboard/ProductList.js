import React from 'react';
import styled from 'styled-components';
import { DataGrid } from '@mui/x-data-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const ProductLists = styled.div`
  flex: 4;
  margin: 0 20px;
  border-radius: 0.2rem;
  background: var(--dark-ev1);
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
  background: var(--dark-ev3);
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
            <Edit>Edit</Edit>
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
    <ProductLists>
      <DataGrid
        sx={{
          color: '#fff',
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
            'background-color': 'var(--dark-ev2) !important',
          },
          '& .MuiDataGrid-row:hover': {
            'background-color': 'var(--dark-ev2) !important',
          },
          '& .Mui-selected:hover': {
            'background-color': 'var(--dark-ev3) !important',
          },

          '& .MuiDataGrid-cell:focus': {
            outline: 'solid var(--orange-color) 1px  !important',
          },
          '& .MuiDataGrid-columnHeader:focus': {
            outline: 'solid var(--orange-color) 1px  !important',
          },
          '& .MuiCheckbox-root:hover': {
            'background-color': 'var(--dark-ev3)  !important',
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
