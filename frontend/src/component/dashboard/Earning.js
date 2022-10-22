import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import FeatureInfo from "./FeatureInfo";
import WidgetLarge from "./WidgetLarge";
import moment from "moment";
import { Store } from "../../Store";
import { getError, getMonday } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleQuestion,
  faQuestion,
} from "@fortawesome/free-solid-svg-icons";
import Chart from "./Chart";
import axios from "axios";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import LoadingBox from "../LoadingBox";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { socket } from "../../App";

const today = moment().startOf("day");

const Container = styled.div`
  flex: 4;
  min-width: 0;
  padding: 0 20px;
`;

const Row = styled.div`
  display: flex;
  padding: 10px;
  gap: 30px;
`;

const Filter = styled.div`
  display: flex;
  padding: 0 20px;
  justify-content: end;
  align-items: center;
`;
const Date = styled.div`
  margin: 5px 0 5px 10px;
`;
const DateInput = styled.input`
  background: none;
  width: 100px;
  color: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--white-color)"
      : "var(--black-color)"};
  border: 0;
  padding: 5px 0 5px 5px;
  border-radius: 0.2rem;
  color-scheme: ${(props) =>
    props.mode === "pagebodydark" ? "dark" : "light"};
  &:focus-visible {
    outline: none;
  }
`;

const Goto = styled.div`
  font-weight: 500;
  padding: 1px 8px;
  cursor: pointer;
  border: 1px solid var(--malon-color);
  &:hover {
    background-color: var(--malon-color);
    color: white;
  }
`;
const Title = styled.h1``;
const Widget = styled.div`
  padding: 10px 40px;
  flex: 1;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  border-radius: 0.2rem;
`;
const SmallText = styled.div`
  font-size: 13px;
  font-weight: bold;
  margin-bottom: 10px;
  margin-right: 40px;
`;
const Amount = styled.div`
  font-size: 40px;
  text-align: right;
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

export default function Earning() {
  const { state } = useContext(Store);
  const [totalSales, setTotalSales] = useState(0);
  const { mode, userInfo, currency } = state;
  var now = new window.Date();
  const [from, setFrom] = useState("2022-04-24");
  const [orderData, setOrderData] = useState(null);
  const [to, setTo] = useState(now);
  const [loading, setLoading] = useState(true);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [order, setOrder] = useState([]);

  useEffect(() => {
    const fetchAl = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `/api/orders/summary/user?to=${to}&from=${from}`,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          }
        );
        console.log("data", data);
        let totalSale = 0;
        const orderData1 = data.dailyOrders.map((x) => {
          totalSale = totalSale + Number(x.sales);
          return {
            name: `${x._id}`,
            order: x.orders,
            earning: x.sales,
            totalSale,
          };
        });
        setTotalSales(totalSale);
        setOrderData(orderData1);
        setLoading(false);
      } catch (err) {
        console.log(getError(err));
        setLoading(false);
      }
    };

    fetchAl();
  }, [userInfo, to, from]);

  useEffect(() => {
    const fetchAllProduct = async () => {
      setLoadingOrder(true);
      try {
        const { data } = await axios.get(
          `/api/orders/seller/${userInfo._id}?to=${to}&from=${from}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        setLoadingOrder(false);
        setOrder(data);
        console.log(data);
      } catch (err) {
        setLoadingOrder(false);
        console.log(getError(err));
      }
    };
    fetchAllProduct();
  }, [userInfo, to, from]);

  var firstDay = new window.Date(now.getFullYear(), now.getMonth(), 1);

  const [select, setSelect] = useState("All");
  const changeDate = (e) => {
    if (e.target.value === "Today") {
      setFrom(today.toDate());
      setTo(moment(today).endOf("day").toDate());
      setSelect("Today");
    } else if (e.target.value === "This Week") {
      setFrom(getMonday(today));
      setTo(moment(today).endOf("day").toDate());
      setSelect("This Week");
    } else if (e.target.value === "This Month") {
      setFrom(firstDay);
      setTo(moment(today).endOf("day").toDate());
      setSelect("This Month");
    } else if (e.target.value === "All") {
      setFrom("2022-04-24");
      setTo(moment(today).endOf("day").toDate());
      setSelect("All");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 210 },
    {
      field: "order",
      headerName: "Order",
      width: 220,
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
    { field: "deliveryStatus", headerName: "Delivery Status", width: 120 },
    {
      field: "payStatus",
      headerName: "Payment Status",
      width: 120,
    },
    {
      field: "date",
      headerName: "Date",
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
      width: 150,
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
  const rows = order.map((p) => ({
    id: p._id,
    name: p.orderItems[0].name,
    image: p.orderItems[0].image,
    deliveryStatus: p.deliveryStatus,
    payStatus: p.isPaid ? "Paid" : "Not Paid",
    user: p.user ? p.user.username : "anonymous",
    date: moment(p.createdAt).format("MMM Do, h:mm a"),
    amount: `${currency}${p.totalPrice}`,
  }));

  return (
    <Container>
      {console.log(totalSales)}
      <Title>Your Earnings</Title>

      <FormControl
        sx={{
          minWidth: "220px",
          margin: 0,
          borderRadius: "0.2rem",
          border: `1px solid ${
            mode === "pagebodydark" ? "var(--dark-ev4)" : "var(--light-ev4)"
          }`,
          "& .MuiOutlinedInput-root": {
            color: `${
              mode === "pagebodydark"
                ? "var(--white-color)"
                : "var(--black-color)"
            }`,
            "&:hover": {
              outline: "none",
              border: 0,
            },
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "0 !important",
          },
        }}
        size="small"
      >
        <Select
          onChange={(e) => {
            changeDate(e);
          }}
          displayEmpty
          id="deliveryStatus"
          value={select}
        >
          <MenuItem default value="Today">
            Today
          </MenuItem>
          <MenuItem value="This Week">This Week</MenuItem>
          <MenuItem value="This Month">This Month</MenuItem>
          <MenuItem value="All">All</MenuItem>
        </Select>
      </FormControl>
      {loading ? (
        <LoadingBox />
      ) : (
        <>
          <Row>
            <Widget mode={mode}>
              <div style={{ display: "flex" }}>
                <SmallText>Your Total Earnings</SmallText>
                <FontAwesomeIcon
                  color="var(--orange-coor)"
                  icon={faCircleQuestion}
                />
              </div>
              <Amount>
                {currency}
                {totalSales}
              </Amount>
            </Widget>
            <Widget
              style={{ background: "var(--malon-color)", color: "white" }}
            >
              <div style={{ display: "flex" }}>
                <SmallText>Repeddle Commision (7.9%)</SmallText>
                <FontAwesomeIcon
                  color="var(--orange-coor)"
                  icon={faCircleQuestion}
                />
              </div>
              <Amount>
                {currency}
                {((totalSales * 7.9) / 100).toFixed(2)}
              </Amount>
            </Widget>
            <Widget
              style={{ background: "var(--orange-color)", color: "white" }}
            >
              <div style={{ display: "flex" }}>
                <SmallText>Your Net Earnings</SmallText>
                <FontAwesomeIcon
                  color="var(--orange-coor)"
                  icon={faCircleQuestion}
                />
              </div>
              <Amount>
                {currency}
                {((totalSales * 92.1) / 100).toFixed(2)}
              </Amount>
            </Widget>
          </Row>
          <div style={{ padding: "10px" }}>
            <Chart title="Earnings" data={orderData} dataKey="earning" grid />
          </div>
          <div style={{ padding: "10px" }}>
            <div style={{ fontSize: "30px", fontWeight: "bold" }}>
              Sales Order History
            </div>
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
                    mode === "pagebodydark"
                      ? "var(--dark-ev2)"
                      : "var(--light-ev2)"
                  } !important`,
                },
                "& .MuiDataGrid-row:hover": {
                  "background-color": `${
                    mode === "pagebodydark"
                      ? "var(--dark-ev2)"
                      : "var(--light-ev2)"
                  } !important`,
                },
                "& .Mui-selected:hover": {
                  "background-color": `${
                    mode === "pagebodydark"
                      ? "var(--dark-ev3)"
                      : "var(--light-ev3)"
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
                    mode === "pagebodydark"
                      ? "var(--dark-ev3)"
                      : "var(--light-ev3)"
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
          </div>
        </>
      )}
    </Container>
  );
}
