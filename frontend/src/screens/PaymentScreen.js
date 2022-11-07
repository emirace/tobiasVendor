import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Store } from "../Store";
import { socket } from "../App";
import { getError } from "../utils";
import { v4 } from "uuid";
import LoadingBox from "../component/LoadingBox";
import { Link } from "react-router-dom";

const Container = styled.div`
  flex: 4;
  margin: 0 10vw;
  padding: 20px;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  @media (max-width: 992px) {
    padding: 10px;
    margin: 0;
  }
`;

const Title = styled.h1`
  font-size: 28px;
`;

const SumaryContDetails = styled.div`
  border-radius: 5px;
  padding: 15px 20px;
  margin-bottom: 15px;
  height: 100%;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev2)"};

  @media (max-width: 992px) {
    padding: 10px 15px;
  }
`;

const ItemNum = styled.div`
  display: flex;
`;

const Name = styled.div`
  text-transform: capitalize;
  font-weight: 600;
  margin-bottom: 10px;
`;

const Button = styled.button`
  width: 200px;
  border: none;
  background: var(--orange-color);
  color: var(--white-color);
  padding: 7px 10px;
  border-radius: 0.2rem;
  cursor: pointer;
  margin-right: 20px;
  margin-top: 30px;
  &:hover {
    background: var(--malon-color);
  }
  &.decline {
    background: var(--malon-color);
  }
`;

const SetStatus = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;

const reducer = (state, action) => {
  switch (action.type) {
    case "GET_REQUEST":
      return { ...state, loading: true };
    case "GET_SUCCESS":
      return { ...state, loading: false, payment: action.payload };
    case "GET_FAIL":
      return { ...state, loading: false };
    case "DELIVER_REQUEST":
      return { ...state, loadingDeliver: true };
    case "DELIVER_SUCCESS":
      return { ...state, loadingDeliver: false };
    case "DELIVER_FAIL":
      return {
        ...state,
        loadingDeliver: false,
        errorDeliver: action.payload,
      };
    default:
      return state;
  }
};

export default function PaymentScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo } = state;

  const params = useParams();
  const { id: paymentId } = params;
  const [reasonText, setReasonText] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [{ loading, payment, loadingDeliver }, dispatch] = useReducer(reducer, {
    loading: true,
    payment: {},
  });

  useEffect(() => {
    const getReturn = async () => {
      dispatch({ type: "GET_REQUEST" });
      try {
        const { data } = await axios.get(`/api/payments/${paymentId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "GET_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "GET_FAIL" });
        console.log(err);
      }
    };
    getReturn();
  }, []);

  async function deliverOrderHandler(deliveryStatus, productId) {
    try {
      dispatch({ type: "DELIVER_REQUEST" });
      await axios.put(
        `/api/orders/${payment.orderId._id}/deliver/${productId}`,
        { deliveryStatus },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "DELIVER_SUCCESS" });
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Return status updated",
          showStatus: true,
          state1: "visible1 success",
        },
      });
      socket.emit("post_data", {
        userId: payment.productId.seller._id,
        itemId: payment.orderId._id,
        notifyType: "delivery",
        msg: `Order ${deliveryStatus} `,
        link: `/return/${payment._id}`,
        userImage: userInfo.image,
      });
      socket.emit("post_data", {
        userId: payment.orderId.user._id,
        itemId: payment.orderId._id,
        notifyType: "delivery",
        msg: `Your order ${deliveryStatus} `,
        link: `/return/${payment._id}`,
        userImage: userInfo.image,
      });
    } catch (err) {
      console.log(getError(err));
      dispatch({ type: "DELIVER_FAIL" });
    }
  }

  const handlePayment = async () => {
    try {
      if (payment.meta.to === "Wallet") {
        await axios.post(
          "/api/accounts/withdraw",
          {
            amount: payment.amount,
            purpose: payment.meta.Type,
            userId: "Admin",
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        await axios.post(
          "/api/accounts/deposit",
          {
            amount: payment.amount,
            purpose: payment.meta.Type,
            userId: payment.userId._id,
            orderId: payment.meta.id,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
      } else if (payment.meta.to === "Account") {
        await axios.post(
          "/api/accounts/payaccount",
          {
            account_bank: payment.account_bank,
            account_number: payment.account_number,
            amount: payment.amount,
            currency: payment.currency,
            narration: "Payment for things",
            reference: v4(),

            userId: payment.userId._id,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
      }

      const { data } = await axios.put(
        `/api/payments/${paymentId}`,
        {
          status: "Approve",
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "GET_SUCCESS", payload: data });
      //   deliverOrderHandler("Return Declined", payment.productId._id);
    } catch (error) {}
  };

  return loading ? (
    <LoadingBox />
  ) : (
    <Container mode={mode}>
      {console.log(payment)}
      <Title>Comfirm Payment</Title>
      <SumaryContDetails mode={mode}>
        <Name>User</Name>
        <Image src={payment.userId.image} alt="img" />
        <ItemNum>{payment.userId.username}</ItemNum>
        <hr />
        <Name>Type</Name>
        <ItemNum>{payment.meta.Type}</ItemNum>
        <ItemNum>
          {payment.meta.typeName} id{" "}
          <Link to={`/order/${payment.meta.id}`}>{payment.meta.id}</Link>
        </ItemNum>
        <hr />
        <Name>Amount</Name>
        <ItemNum>
          {payment.meta.currency}
          {payment.amount}
        </ItemNum>
        <hr />
        <Name>From</Name>
        <ItemNum>{payment.meta.from}</ItemNum>
        <hr />
        <Name>To</Name>
        <ItemNum>{payment.meta.to}</ItemNum>
        <hr />
        {payment.meta.to === "Account" && (
          <>
            <Name>Details</Name>
            {Object.entries(payment.meta.detail).map(([key, value]) => (
              <div
                style={{
                  display: "flex",
                  textTransform: "capitalize",
                  fontSize: "13px",
                }}
              >
                <div style={{ flex: "1" }}>{key}:</div>
                <div style={{ flex: "5" }}>{value}</div>
              </div>
            ))}
            <hr />
          </>
        )}
        {payment.status !== "Pending" ? (
          <>
            <Name style={{ color: "var(--orange-color)" }}>Status</Name>
            <ItemNum
              style={{ color: payment.status === "Decline" ? "red" : "green" }}
            >
              {payment.status}
            </ItemNum>
          </>
        ) : (
          <>
            <Button onClick={() => handlePayment()}>Comfirm Payment</Button>
          </>
        )}
      </SumaryContDetails>
    </Container>
  );
}
