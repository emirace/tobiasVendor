import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { DataGrid } from "@mui/x-data-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import axios from "axios";
import { Store } from "../../../Store";
import { getError, region } from "../../../utils";
import { useReactToPrint } from "react-to-print";
import moment from "moment";
import useWindowDimensions from "../../Dimension";

const ProductLists = styled.div`
  flex: 4;
  margin: 0 20px;
  border-radius: 0.2rem;
  margin-bottom: 20px;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  @media (max-width: 992px) {
    margin: 10px;
    margin-bottom: 20px;
  }
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
  padding: 3px 6px;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev3)" : "#fcf0e0"};
  color: var(--orange-color);
  cursor: pointer;
  margin-right: 5px;
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
  display: flex;
  gap: 5px;
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
  &::placeholder {
    padding: 10px;
  }
`;
const Goto = styled.div`
  font-weight: 500;
  border-radius: 0.2rem;
  padding: 1px 8px;
  cursor: pointer;
  border: 1px solid var(--malon-color);
  &:hover {
    background-color: var(--malon-color);
    color: white;
  }
  @media (max-width: 992px) {
    white-space: nowrap;
    margin-top: 10px;
  }
`;
const RowFilter = styled.div`
  display: flex;
  gap: 20px;

  @media (max-width: 992px) {
    overflow-x: auto;
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;
const Print = styled.div`
  font-weight: 500;
  color: white;
  padding: 1px 8px;
  border-radius: 0.2rem;
  cursor: pointer;
  background: var(--orange-color);
  &:hover {
    background-color: var(--malon-color);
  }
  @media (max-width: 992px) {
    white-space: nowrap;
    margin-top: 10px;
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

export default function OrderListAdmin() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo, currency } = state;
  const [refresh, setRefresh] = useState(false);
  const [sort, setSort] = useState("all");
  const [{ loading, products, error, loadingDelete, successDelete }, dispatch] =
    useReducer(reducer, {
      loading: true,
      products: [],
      error: "",
    });
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [ordersQuery, setOrdersQuery] = useState("all");
  useEffect(() => {
    const fetchAllProduct = async () => {
      try {
        dispatch({ type: "USERS_FETCH" });
        const { data } = await axios.get(
          `/api/orders/${region()}/admin?q=${ordersQuery}&sort=${sort}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
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
  }, [successDelete, userInfo, ordersQuery, sort, refresh]);

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

  async function deliverOrderHandler(deliveryStatus, order) {
    try {
      dispatch({ type: "DELIVER_REQUEST" });
      await axios.put(
        `/api/orders/${order}/deliver/`,
        { deliveryStatus },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "DELIVER_SUCCESS" });
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Delivery status updated",
          showStatus: true,
          state1: "visible1 success",
        },
      });
      setRefresh(!refresh);
    } catch (err) {
      dispatch({ type: "DELIVER_FAIL" });
    }
  }
  const { height, width } = useWindowDimensions();

  const columns =
    width < 992
      ? [
          {
            field: "order",
            headerName: "Order",
            width: 100,
            renderCell: (params) => {
              return (
                <Product>
                  <Link to={`/product/${params.row.slug}`}>
                    <img src={params.row.image} alt="" />
                    {params.row.name}
                  </Link>
                </Product>
              );
            },
          },
          {
            field: "amount",
            headerName: "Amount",
            width: 90,
          },

          {
            field: "payStatus",
            headerName: "Status",
            width: 70,
          },

          {
            field: "action",
            headerName: "Action",
            width: 70,
            renderCell: (params) => {
              return (
                <ActionSec>
                  <Link to={`/order/${params.row.id}`}>
                    <Edit mode={mode}>View</Edit>
                  </Link>
                  {/* <div
                    onClick={() =>
                      deliverOrderHandler(
                        params.row.deliveryStatus !== "Hold"
                          ? "Hold"
                          : "Unhold",
                        params.row.id
                      )
                    }
                  >
                    <Edit mode={mode}>
                      {params.row.deliveryStatus !== "Hold" ? "Hold" : "Unhold"}
                    </Edit>
                  </div> */}
                  {/* {params.row.deliveryStatus === "Delivered" && (
                    <Reject mode={mode}>Return</Reject>
                  )} */}
                  {/* {userInfo.isAdmin && (
              <FontAwesomeIcon
                onClick={() => deleteHandler(params.row.id)}
                icon={faTrash}
              />
            )} */}
                </ActionSec>
              );
            },
          },
        ]
      : [
          { field: "id", headerName: "ID", width: 200 },
          {
            field: "order",
            headerName: "Order",
            width: 100,
            renderCell: (params) => {
              return (
                <Product>
                  <Link to={`/product/${params.row.slug}`}>
                    <img src={params.row.image} alt="" />
                    {params.row.name}
                  </Link>
                </Product>
              );
            },
          },
          {
            field: "amount",
            headerName: "Amount",
            width: 90,
          },
          {
            field: "payStatus",
            headerName: "Status",
            width: 100,
          },
          {
            field: "date",
            headerName: "Date",
            width: 150,
          },
          {
            field: "buyer",
            headerName: "Buyer",
            width: 90,
            renderCell: (params) => {
              return (
                <Product>
                  <Link to={`/seller/${params.row.buyerId}`}>
                    @{params.row.buyer}
                  </Link>
                </Product>
              );
            },
          },
          {
            field: "seller",
            headerName: "Seller",
            width: 90,
            renderCell: (params) => {
              return (
                <Product>
                  <Link to={`/seller/${params.row.sellerId}`}>
                    @{params.row.seller}
                  </Link>
                </Product>
              );
            },
          },
          {
            field: "action",
            headerName: "Action",
            width: 120,
            renderCell: (params) => {
              return (
                <ActionSec>
                  <Link to={`/order/${params.row.id}`}>
                    <Edit mode={mode}>View</Edit>
                  </Link>
                  {/* <div
                    onClick={() =>
                      deliverOrderHandler(
                        params.row.deliveryStatus !== "Hold"
                          ? "Hold"
                          : "Unhold",
                        params.row.id
                      )
                    }
                  >
                    <Edit mode={mode}>
                      {params.row.deliveryStatus !== "Hold" ? "Hold" : "Unhold"}
                    </Edit>
                  </div> */}
                  {/* {params.row.deliveryStatus === "Delivered" && (
                  <Reject mode={mode}>Return</Reject>
                )} */}
                  {/* {userInfo.isAdmin && (
            <FontAwesomeIcon
              onClick={() => deleteHandler(params.row.id)}
              icon={faTrash}
            />
          )} */}
                </ActionSec>
              );
            },
          },
        ];
  const rows = products.map((p) => ({
    id: p._id,
    name: p.orderItems[0].name,
    slug: p.orderItems[0].slug,
    image: p.orderItems[0].image,
    deliveryStatus: p.deliveryStatus,
    date: moment(p.createdAt).format("MMM DD YY, h:mm a"),
    payStatus: p.isPaid ? "Paid" : "Not Paid",
    buyer: p.user ? p.user.username : "anonymous",
    seller: p.seller
      ? p.seller.length > 1
        ? "multi-seller"
        : p.seller[0].username
      : "anonymous",
    amount: currency + p.totalPrice,
    sellerId: p.seller ? p.seller[0]._id : "",
    buyerId: p.user ? p.user._id : "",
  }));

  return (
    <ProductLists mode={mode}>
      <Title>All Orders</Title>

      <SearchCont>
        <SearchInput
          onChange={(e) => setOrdersQuery(e.target.value)}
          placeholder="Search by id"
        />
      </SearchCont>
      <RowFilter>
        <Goto onClick={() => setSort("all")}>All</Goto>
        <Goto onClick={() => setSort("Pending")}>Pending</Goto>
        <Goto onClick={() => setSort("Progress")}>In Progress</Goto>
        <Goto onClick={() => setSort("Delivered")}>Completed</Goto>
        <Print onClick={handlePrint}>Print</Print>
      </RowFilter>
      <style type="text/css" media="print">
        {"\
  @page { size: landscape; }\
"}
      </style>
      <DataGrid
        ref={componentRef}
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
