import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { socket } from "../App";
import { Store } from "../Store";
import { region } from "../utils";
import LoadingBox from "./LoadingBox";
const PAYFAST_ID = process.env.REACT_APP_PAYFAST_ID;
const PAYFAST_KEY = process.env.REACT_APP_PAYFAST_KEY;

const Button = styled.div`
  cursor: pointer;
  color: var(--white-color);
  background: var(--orange-color);
  width: 100%;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.2rem;
  height: 40px;
  &:hover {
    background: var(--malon-color);
  }
`;

export default function PayFast({ totalPrice, placeOrderHandler }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const myData = {};
  // Merchant details
  myData["merchant_id"] = PAYFAST_ID;
  myData["merchant_key"] = PAYFAST_KEY;
  myData["return_url"] = "https://www.repeddle.co.za";
  myData["cancel_url"] = "https://www.repeddle.co.za";
  myData["notify_url"] =
    "https://www.repeddle.co.za/api/transactions/payfastnotify";
  // Buyer details
  myData["name_first"] = userInfo.firstName;
  myData["name_last"] = userInfo.lastName;
  myData["email_address"] = userInfo.email;
  // Transaction details
  myData["m_payment_id"] = "1234";
  myData["amount"] = `${totalPrice}`;
  //custom

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const order = await placeOrderHandler();
      if (order) {
        console.log(order);
        myData["item_name"] = `${order.order._id}`;

        const { data: identifier } = await axios.put(
          "/api/transactions/process",
          { myData },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        if (identifier !== null) {
          window.payfast_do_onsite_payment(identifier, async function (result) {
            console.log(result);
            if (result === true) {
              console.log(" Payment Completed");
              order.order.seller.map(async (x) => {
                await axios.put(`api/bestsellers/${region()}/${x}`);
              });
              ctxDispatch({
                type: "SHOW_TOAST",
                payload: {
                  message: "Order is paid",
                  showStatus: true,
                  state1: "visible1 success",
                },
              });
              localStorage.removeItem("cartItems");
              ctxDispatch({ type: "CART_CLEAR" });
              if (userInfo) {
                await axios.delete(`/api/cartItems/`, {
                  headers: {
                    Authorization: `Bearer ${userInfo.token}`,
                  },
                });
              }
              order.order.seller.map((s) => {
                socket.emit("post_data", {
                  userId: s,
                  itemId: order.order._id,
                  notifyType: "sold",
                  msg: `${userInfo.username} ordered your product`,
                  link: `/order/${order.order._id}`,
                  userImage: userInfo.image,
                  mobile: { path: "OrderScreen", id: order.order._id },
                });
              });
              navigate(`/order/${order.order._id}`);
            } else {
              console.log("Payment Window Closed");
              await axios.delete(`/api/orders/${order.order._id}`, {
                headers: {
                  Authorization: `Bearer ${userInfo.token}`,
                },
              });
              setLoading(false);
            }
          });
        }
      } else console.log("cant create order");
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return loading ? (
    <LoadingBox />
  ) : (
    <Button onClick={handleSubmit}>Proceed to Payment</Button>
  );
}
