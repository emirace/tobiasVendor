import React, { useContext, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { DataGrid } from "@mui/x-data-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Store } from "../../Store";
import { Link } from "react-router-dom";
import axios from "axios";
import { getError } from "../../utils";
import { Badge } from "../Navbar";
import { socket } from "../../App";
import moment from "moment";
import useWindowDimensions from "../Dimension";

const ProductLists = styled.div`
  flex: 4;
  margin: 0 20px;
  margin-bottom: 20px;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
`;
const Title = styled.h1`
  padding: 20px 20px 0 20px;
  @media (max-width: 992px) {
    font-size: 20px;
  }
`;
const Product = styled.div`
  position: relative;
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
  @media (max-width: 992px) {
    & a {
      width: 100px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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

const SearchCont = styled.div`
  display: flex;
  justify-content: end;
  margin-right: 10px;
  margin-bottom: 10px;
`;

const SearchInput = styled.input`
  width: 40%;
  height: 45px;
  padding: 15px;
  border: 1px solid var(--malon-color);
  border-radius: 5px;
  background: none;
  &:focus-visible {
    outline: 1px solid var(--orange-color);
  }
  color: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--white-color)"
      : "var(--black-color)"};
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

export default function OrderList() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo, notifications, currency } = state;

  const [{ loading, products, error, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      products: [],
      error: "",
    });
  const [ordersQuery, setOrdersQuery] = useState("all");
  useEffect(() => {
    const fetchAllProduct = async () => {
      try {
        dispatch({ type: "USERS_FETCH" });
        const { data } = await axios.get(`/api/orders/mine?q=${ordersQuery}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        console.log(data);
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
  }, [successDelete, userInfo, ordersQuery]);

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
  const { height, width } = useWindowDimensions();

  const columns =
    width < 992
      ? [
          {
            field: "order",
            headerName: "Order",
            width: 120,
            renderCell: (params) => {
              return (
                <Product>
                  <Link to={`/order/${params.row.id}`}>
                    <img src={params.row.image} alt="" />
                    {params.row.name}
                    {/* {notifications.filter((x) => x.itemId === params.row.id).length >
                0 && <Badge style={{ marginRight: "10px" }}></Badge>} */}
                  </Link>
                </Product>
              );
            },
          },
          {
            field: "amount",
            headerName: "Amount",
            width: 100,
          },
          {
            field: "action",
            headerName: "Action",
            width: 80,
            renderCell: (params) => {
              return (
                <ActionSec>
                  <Link to={`/order/${params.row.id}`}>
                    <Edit
                      mode={mode}
                      onClick={() => {
                        socket.emit("remove_notifications", params.row.id);
                      }}
                    >
                      View
                    </Edit>
                  </Link>
                </ActionSec>
              );
            },
          },
        ]
      : [
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
                    {/* {notifications.filter((x) => x.itemId === params.row.id).length >
              0 && <Badge style={{ marginRight: "10px" }}></Badge>} */}
                  </Link>
                </Product>
              );
            },
          },
          {
            field: "deliveryStatus",
            headerName: "Delivery Status",
            width: 120,
          },
          {
            field: "payStatus",
            headerName: "Payment Status",
            width: 120,
          },
          {
            field: "date",
            headerName: "Date",
            width: 120,
          },
          {
            field: "amount",
            headerName: "Amount",
            width: 100,
          },
          {
            field: "user",
            headerName: "Seller",
            width: 100,
          },
          {
            field: "action",
            headerName: "Action",
            width: 120,
            renderCell: (params) => {
              return (
                <ActionSec>
                  <Link to={`/order/${params.row.id}`}>
                    <Edit
                      mode={mode}
                      onClick={() => {
                        socket.emit("remove_notifications", params.row.id);
                      }}
                    >
                      View
                    </Edit>
                  </Link>
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
    user: p.user ? p.user.username : "anonymous",
    date: moment(p.createdAt).format("MMM DD YY, h:mm a"),
    amount: `${currency}${p.totalPrice}`,
  }));

  return (
    <ProductLists mode={mode}>
      <Title>Purchase Product History</Title>
      <SearchCont>
        <SearchInput
          mode={mode}
          onChange={(e) => setOrdersQuery(e.target.value)}
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
      />
    </ProductLists>
  );
}
