import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../Store";

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

export function AdminRoute({ children }) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  return userInfo && userInfo.isAdmin ? children : <Navigate to="/" />;
}

export function CartNotEmpty({ children }) {
  const { state } = useContext(Store);
  const { cart } = state;
  const { cartItems } = cart;
  cartItems.length < 1 && toast.error("Cart is empty");
  return cartItems.length > 0 ? children : <Navigate to="/cart" />;
}

export function IsShippingAdd({ children }) {
  const { state } = useContext(Store);
  const {
    cart: { shippingAddress },
  } = state;
  Object.keys(shippingAddress).length === 0 &&
    toast.error("Enter Shipping Address");
  return Object.keys(shippingAddress).length === 0 ? (
    <Navigate to="/shipping" />
  ) : (
    children
  );
}

export function IsPaymentMethod({ children }) {
  const { state } = useContext(Store);
  const {
    cart: { paymentMethod },
  } = state;

  !paymentMethod && toast.error("Select Payment Method");
  return paymentMethod ? children : <Navigate to="/payment" />;
}
