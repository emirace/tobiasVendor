import React, { useContext } from 'react';
import styled from 'styled-components';
import { DataGrid } from '@mui/x-data-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Store } from '../../Store';
import { Link } from 'react-router-dom';

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
  }
`;

export default function UserList() {
  const { state } = useContext(Store);
  const { mode } = state;
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
            <Link to="/dashboard/user">
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
    <Container mode={mode}>
      <Title>User List</Title>
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
    </Container>
  );
}
