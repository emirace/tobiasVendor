import React, { useContext, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { DataGrid } from "@mui/x-data-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Store } from "../../Store";
import { Link } from "react-router-dom";
import axios from "axios";
import { getError } from "../../utils";
import ModelLogin from "../ModelLogin";

const ProductLists = styled.div`
  flex: 4;
  margin: 0 20px;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
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
    props.mode === "pagebodydark" ? "var(--dark-ev3)" : "#fcf0e0"};
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
const Reject = styled.button`
  border: none;
  border-radius: 0.2rem;
  padding: 5px 10px;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev3)" : "#fcf0e0"};
  color: var(--red-color);
  cursor: pointer;
  margin-right: 10px;
`;
const TextArea = styled.textarea`
  height: 200px;
  width: 80%;
  border-radius: 0.2rem;
  background: none;
  color: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--white-color)"
      : "var(--black-color)"};
  padding: 10px;
  &:focus-visible {
    outline: 1px solid var(--orange-color);
  }
  border: 1px solid
    ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev4)" : "var(--light-ev4)"};
`;
const Button = styled.button`
  width: 200px;
  border: none;
  background: var(--orange-color);
  color: var(--white-color);
  padding: 7px 10px;
  border-radius: 0.2rem;
  cursor: pointer;
  margin-top: 30px;
  &:hover {
    background: var(--malon-color);
  }
`;

const ModelCont = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const SearchCont = styled.div`
  display: flex;
  justify-content: end;
  margin-bottom: 10px;
  margin-right: 10px;
`;

const SearchInput = styled.input`
  width: 40%;
  height: 45px;
  padding: 15px;
  border: 1px solid var(--malon-color);
  border-radius: 5px;
  &:focus-visible {
    outline: 1px solid var(--orange-color);
  }
  color: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--white-color)"
      : "var(--black-color)"};

  background: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--black-color)"
      : "var(--white-color)"};
  &::placeholder {
    padding: 10px;
  }
`;

const reducer = (state, action) => {
  switch (action.type) {
    case "USERS_REQUEST":
      return { ...state, loading: true };
    case "USERS_SUCCESS":
      return {
        ...state,
        products: action.payload,
        loading: false,
      };
    case "USERS_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false };
    case "DELETE_RESET":
      return { ...state, loadingDelete: false, successDelete: false };

    default:
      return state;
  }
};

export default function Saleslist() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo } = state;

  const [{ loading, products, error, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      products: [],
      error: "",
    });

  const [showModel, setShowModel] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [reason, setReason] = useState("");
  const [salesQurrey, setSalesQurrey] = useState("all");
  useEffect(() => {
    const fetchAllProduct = async () => {
      try {
        dispatch({ type: "USERS_FETCH" });
        const { data } = await axios.get(
          `/api/orders/seller/${userInfo._id}?q=${salesQurrey}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "USERS_SUCCESS", payload: data });
      } catch (err) {
        console.log(getError(err));
      }
    };
    if (successDelete) {
      dispatch({ type: "DELETE_RESET" });
    } else {
      fetchAllProduct();
    }
  }, [successDelete, userInfo, salesQurrey]);

  const deleteHandler = async (order) => {
    if (window.confirm("Are you sure to delete")) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await axios.delete(`/api/orders/${order}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "DELETE_SUCCESS" });
        ctxDispatch({
          type: "SHOW_TOAST",
          payload: {
            message: "Order deleted Successfully",
            showStatus: true,
            state1: "visible1 error",
          },
        });
      } catch (err) {
        dispatch({ type: "DELETE_FAIL" });
        console.log(getError(err));
      }
    }
  };

  const rejectHandle = async () => {
    try {
      await axios.put(
        `/api/orders/${currentId}/status`,
        {
          reason,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Order rejected Successfully",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      setShowModel(false);
    } catch (err) {
      console.log(getError(err));
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    {
      field: "order",
      headerName: "Order",
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
    { field: "deliveryStatus", headerName: "Delivery Status", width: 150 },
    {
      field: "payStatus",
      headerName: "Payment Status",
      width: 150,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 100,
    },
    {
      field: "user",
      headerName: "Buyer",
      width: 100,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <ActionSec>
            <Link to={`/order/${params.row.id}`}>
              <Edit mode={mode}>View</Edit>
            </Link>

            <Reject
              onClick={() => {
                setShowModel(true);
                setCurrentId(params.row.id);
              }}
              mode={mode}
            >
              Reject
            </Reject>
          </ActionSec>
        );
      },
    },
  ];
  const rows = products.map((p) => ({
    id: p._id,
    name: p.orderItems[0].name,
    image: p.orderItems[0].image,
    deliveryStatus: p.deliveryStatus,
    payStatus: p.isPaid ? "Paid" : "Not Paid",
    user: p.user ? p.user.name : "anonymous",
    amount: p.totalPrice,
  }));

  return (
    <ProductLists mode={mode}>
      <Title>Sold Order History</Title>
      <SearchCont>
        <SearchInput
          onChange={(e) => setSalesQurrey(e.target.value)}
          placeholder="Search by id"
        />
      </SearchCont>
      <DataGrid
        sx={{
          width: "100%",
          height: "650px",
          color: `${
            mode === "pagebodydark"
              ? "var(--white-color)"
              : "var(--black-color)"
          }`,
          border: "none",
          "& p.MuiTablePagination-displayedRows": {
            margin: 0,
            color: `${
              mode === "pagebodydark"
                ? "var(--white-color)"
                : "var(--black-color)"
            }`,
          },
          "& .MuiButtonBase-root": {
            color: `${
              mode === "pagebodydark"
                ? "var(--white-color)"
                : "var(--black-color)"
            }`,
          },
          "& .MuiDataGrid-columnHeaders": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            border: "none",
          },
          "& .Mui-checked": {
            color: "var(--orange-color) !important",
          },
          "& .Mui-selected": {
            "background-color": `${
              mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev2)"
            } !important`,
          },
          "& .MuiDataGrid-row:hover": {
            "background-color": `${
              mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev2)"
            } !important`,
          },
          "& .Mui-selected:hover": {
            "background-color": `${
              mode === "pagebodydark" ? "var(--dark-ev3)" : "var(--light-ev3)"
            } !important`,
          },

          "& .MuiDataGrid-cell:focus": {
            outline: "solid var(--orange-color) 1px  !important",
            borderRadius: "0.2rem",
          },
          "& .MuiDataGrid-columnHeader:focus": {
            outline: "solid var(--orange-color) 1px  !important",
            borderRadius: "0.2rem",
          },
          "& .MuiCheckbox-root:hover": {
            "background-color": `${
              mode === "pagebodydark" ? "var(--dark-ev3)" : "var(--light-ev3)"
            }   !important`,
          },
          "& .MuiDataGrid-columnHeader:focus-within,.MuiDataGrid-cell:focus-within":
            {
              outline: "solid var(--orange-color) 1px  !important",
              borderRadius: "0.2rem",
            },
        }}
        rows={rows}
        columns={columns}
        disableSelectionOnClick
        pageSize={10}
        rowsPerPageOptions={[5]}
        checkboxSelection
      />
      <ModelLogin setShowModel={setShowModel} showModel={showModel}>
        <ModelCont>
          <div style={{ fontSize: "18px" }}>Reason for rejecting order?</div>
          <TextArea mode={mode} onChange={(e) => setReason(e.target.value)} />
          <div
            style={{
              display: "flex",
              width: "40%",
              justifyContent: "space-between",
            }}
          >
            <Button onClick={() => setShowModel(false)}>Cancel</Button>
            <Button onClick={rejectHandle}>Reject</Button>
          </div>
        </ModelCont>
      </ModelLogin>
    </ProductLists>
  );
}
