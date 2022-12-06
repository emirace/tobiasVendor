import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../Store";
import axios from "axios";

export function ProtectedRoute({ children }) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  return userInfo ? children : <Navigate to="/signin" />;
}

export function SellerRoute({ children }) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  return userInfo && userInfo.isSeller ? children : <Navigate to="/" />;
}
export function SellerRedirect({ children }) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  return userInfo && userInfo.isSeller ? (
    <Navigate to="/newproduct" />
  ) : (
    <Navigate to="/sell" />
  );
}

export function AdminRoute({ children }) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  return userInfo && userInfo.isAdmin ? children : <Navigate to="/" />;
}

export function CartNotEmpty({ children }) {
  const { state } = useContext(Store);
  const { cart } = state;
  const { cartItems } = cart;
  return cartItems.length > 0 ? children : <Navigate to="/cart" />;
}

export function IsShippingAdd({ children }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress },
  } = state;
  Object.keys(shippingAddress).length === 0 &&
    ctxDispatch({
      type: "SHOW_TOAST",
      payload: {
        message: "Enter Shipping Address",
        showStatus: true,
        state1: "visible1 error",
      },
    });
  return Object.keys(shippingAddress).length === 0 ? (
    <Navigate to="/shipping" />
  ) : (
    children
  );
}

export function IsPaymentMethod({ children }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { paymentMethod },
  } = state;

  !paymentMethod &&
    ctxDispatch({
      type: "SHOW_TOAST",
      payload: {
        message: "Select Payment Method",
        showStatus: true,
        state1: "visible1 error",
      },
    });
  return paymentMethod ? children : <Navigate to="/payment" />;
}

export function IsVerifyEmail({ children }) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  console.log("child", children);
  return userInfo.isVerifiedEmail ? children : <Navigate to="/verifyemail" />;
}

export function IsVerifyBank({ children }) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const verified =
    userInfo.bankName && userInfo.accountName && userInfo.accountName;
  return verified ? children : <Navigate to="/verifyaccount" />;
}
export function IsVerifyAddress({ children }) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const verified = userInfo?.address?.street && userInfo?.address?.state;
  console.log("address", verified);
  console.log("userInfo", userInfo);
  console.log(children);
  return verified ? children : <Navigate to="/verifyaddress" />;
}

export function IsActive({ children }) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const verified = userInfo.active;
  console.log(userInfo);
  console.log("verified", verified);

  return verified ? children : <Navigate to="/banned" />;
}
