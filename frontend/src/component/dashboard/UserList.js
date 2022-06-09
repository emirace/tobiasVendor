import React from 'react';
import styled from 'styled-components';
import { DataGrid } from '@mui/x-data-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  flex: 4;
  background: var(--dark-ev1);
  margin: 0 20px;
  border-radius: 0.2rem;
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
  background: var(--green-color);
  color: var(--white-color);
  cursor: pointer;
  margin-right: 10px;
`;

const ActionSec = styled.div`
  & svg {
    color: var(--red-color);
  }
`;

export default function UserList() {
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
      username: 'John Doe',
      image: '/images/men.png',
      email: 'test@mail.com',
      status: 'online',
      transactions: '$242.32',
    },
    {
      id: 2,
      username: 'John Doe',
      image: '/images/men.png',
      email: 'test@mail.com',
      status: 'online',
      transactions: '$242.32',
    },
    {
      id: 3,
      username: 'John Doe',
      image: '/images/men.png',
      email: 'test@mail.com',
      status: 'online',
      transactions: '$242.32',
    },
  ];

  return (
    <Container>
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
            color: 'var(--orange-color)',
          },
          '& .Mui-selected': {
            'background-color': 'var(--dark-ev2) !important',
          },
          '& .Mui-selected:hover': {
            'background-color': 'var(--dark-ev3) !important',
          },
          '& .MuiDataGrid-row:hover': {
            'background-color': 'var(--dark-ev2) !important',
          },
          '& .MuiDataGrid-cell:focus': {
            outline: 'solid var(--orange-color) 1px',
          },
          '& .MuiDataGrid-columnHeader:focus': {
            outline: 'solid var(--orange-color) 1px',
          },
        }}
        rows={rows}
        columns={columns}
        disableSelectionOnClick
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
    </Container>
  );
}
