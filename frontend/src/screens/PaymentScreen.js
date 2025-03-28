import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Store } from "../Store";
import { socket } from "../App";
import { getCode, getError, region } from "../utils";
import { v4 } from "uuid";
import LoadingBox from "../component/LoadingBox";
import { Link } from "react-router-dom";
import moment from "moment";

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

const BankRow = styled.div`
  display: flex;
  text-transform: capitalize;
  font-size: 13px;
`;
const BankKey = styled.div``;
const BankValue = styled.div`
  margin-left: 5px;
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
        window.scrollTo(0, 0);
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
        mobile: { path: "ReturnScreen", id: payment._id },
      });
      socket.emit("post_data", {
        userId: payment.orderId.user._id,
        itemId: payment.orderId._id,
        notifyType: "delivery",
        msg: `Your order ${deliveryStatus} `,
        link: `/return/${payment._id}`,
        mobile: { path: "ReturnScreen", id: payment._id },
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
          `/api/accounts/${region()}/withdraw`,
          {
            amount: payment.amount,
            purpose: payment.meta.Type,
            userId: "Admin",
            orderId: payment.meta.id,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        await axios.post(
          `/api/accounts/${region()}/deposit`,
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
          `/api/accounts/${region()}/payaccount`,
          {
            bankName:
              region() === "NGN"
                ? getCode(payment.meta.detail.bankName)
                : payment.meta.detail.bankName,
            accountNumber: payment.meta.detail.accountNumber,
            accountName: payment.meta.detail.accountName,
            amount: payment.amount,
            currency: payment.meta.currency,
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
          status: "Approved",
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "GET_SUCCESS", payload: data });
      //   deliverOrderHandler("Return Declined", payment.productId._id);
      payment.meta.Type === "Withdrawal Request"
        ? socket.emit("post_data", {
            userId: payment.userId._id,
            itemId: payment._id,
            notifyType: "payment",
            msg: `Your Withdrawal request is been proccessed`,
            link: `/dashboard/wallet`,
            mobile: { path: "Withdraw", id: "" },
            userImage: userInfo.image,
          })
        : payment.meta.Type === "Order Completed" ||
          payment.meta.Type === "Return Declined"
        ? socket.emit("post_data", {
            userId: payment.userId._id,
            itemId: payment._id,
            notifyType: "payment",
            msg: `Your order is paid`,
            link: `/dashboard/wallet`,
            mobile: { path: "Account", id: "" },
            userImage: userInfo.image,
          })
        : payment.meta.Type === "Pay Seller"
        ? socket.emit("post_data", {
            userId: payment.userId._id,
            itemId: payment._id,
            notifyType: "payment",
            msg: `Order payment settled`,
            link: `/dashboard/wallet`,
            mobile: { path: "Account", id: "" },
            userImage: userInfo.image,
          })
        : socket.emit("post_data", {
            userId: payment.userId._id,
            itemId: payment._id,
            notifyType: "payment",
            msg: `Your order return refunded`,
            link: `/dashboard/wallet`,
            mobile: { path: "Account", id: "" },
            userImage: userInfo.image,
          });
    } catch (error) {
      console.log(error);
    }
  };

  const handlePaystackPayment = async () => {
    const { data } = await axios.post(
      `/api/accounts/${region()}/paystack/payaccount`,
      {
        paymentId: payment._id,
      },
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );
    console.log(data);
    dispatch({ type: "GET_SUCCESS", payload: data });
    //   deliverOrderHandler("Return Declined", payment.productId._id);
    payment.meta.Type === "Withdrawal Request"
      ? socket.emit("post_data", {
          userId: payment.userId._id,
          itemId: payment._id,
          notifyType: "payment",
          msg: `Your Withdrawal request is been proccessed`,
          link: `/dashboard/wallet`,
          mobile: { path: "Withdraw", id: "" },
          userImage: userInfo.image,
        })
      : payment.meta.Type === "Order Completed" ||
        payment.meta.Type === "Return Declined"
      ? socket.emit("post_data", {
          userId: payment.userId._id,
          itemId: payment._id,
          notifyType: "payment",
          msg: `Your order is paid`,
          link: `/dashboard/wallet`,
          mobile: { path: "Account", id: "" },
          userImage: userInfo.image,
        })
      : payment.meta.Type === "Pay Seller"
      ? socket.emit("post_data", {
          userId: payment.userId._id,
          itemId: payment._id,
          notifyType: "payment",
          msg: `Order payment settled`,
          link: `/dashboard/wallet`,
          mobile: { path: "Account", id: "" },
          userImage: userInfo.image,
        })
      : socket.emit("post_data", {
          userId: payment.userId._id,
          itemId: payment._id,
          notifyType: "payment",
          msg: `Your order return refunded`,
          link: `/dashboard/wallet`,
          mobile: { path: "Account", id: "" },
          userImage: userInfo.image,
        });
  };

  return loading ? (
    <LoadingBox />
  ) : (
    <Container mode={mode}>
      {console.log(payment)}
      <Title>Comfirm Payment</Title>
      <SumaryContDetails mode={mode}>
        <Name>ID</Name> <ItemNum>{payment._id}</ItemNum>
        <hr />
        <Name>Date</Name>
        <ItemNum>
          {moment(payment.createdAt).format("MMM DD YY, h:mm a")}
        </ItemNum>
        <hr />
        <Name>User</Name>
        <Image src={payment.userId.image} alt="img" />
        <ItemNum>{payment.userId.username}</ItemNum>
        <hr />
        <Name>Type</Name>
        <ItemNum>{payment.meta.Type}</ItemNum>
        <ItemNum style={{ color: "var(--malon-color)" }}>
          <span style={{ marginRight: "20px" }}>
            {" "}
            {payment.meta.typeName} {payment.meta.id && "id"}
          </span>
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
            <Name>Bank Account Details</Name>
            <BankRow>
              <BankKey>Account Name:</BankKey>{" "}
              <BankValue>{payment.meta.detail.accountName}</BankValue>
            </BankRow>
            <BankRow>
              <BankKey>Account Number:</BankKey>{" "}
              <BankValue>{payment.meta.detail.accountNumber}</BankValue>
            </BankRow>
            <BankRow>
              <BankKey>Bank Name:</BankKey>{" "}
              <BankValue>{payment.meta.detail.bankName}</BankValue>
            </BankRow>
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
            <Button onClick={() => handlePayment()}>Confirm Payment</Button>
          </>
        )}
        {/* {userInfo.isAdmin && (
          <Button onClick={() => handlePaystackPayment()}>
            Confirm Paystack
          </Button>
        )} */}
      </SumaryContDetails>
    </Container>
  );
}
