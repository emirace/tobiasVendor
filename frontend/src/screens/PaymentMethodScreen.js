import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import CheckoutSteps from "../component/CheckoutSteps";
import { Store } from "../Store";

export default function PaymentMethodScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    cart: { shippingAddress, paymentMethod, totalPrice },
  } = state;
  const [paymentMethodName, setPaymentMethod] = useState(
    paymentMethod || "Credit/Debit card"
  );
  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethodName });
    localStorage.setItem("paymentMethod", paymentMethodName);
    navigate("/placeorder");
  };
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    const getBalance = async () => {
      if (userInfo) {
        const { data } = await axios.get("/api/accounts/balance", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        setBalance(data.balance);
      }
    };
    getBalance();
  }, [userInfo]);

  return (
    <div className="container">
      <Helmet>
        <title>Payment Method</title>
      </Helmet>
      <h1 className="my-3">Payment Method</h1>
      <Form onSubmit={submitHandler}>
        <div className="mb-3">
          <Form.Check
            type="radio"
            id="Credit/Debit card"
            label="Credit/Debit card"
            value="Credit/Debit card"
            checked={paymentMethodName === "Credit/Debit card"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <Form.Check
            disabled={balance <= totalPrice}
            type="radio"
            id="Wallet"
            label={`Wallet ($${balance.toFixed(2)})`}
            value="Wallet"
            checked={paymentMethodName === "Wallet"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          {balance <= totalPrice && (
            <div style={{ color: "red", fontSize: "13px" }}>
              Insufficiant balance{" "}
              <Link to="/dashboard/wallet">Fund Wallet Now</Link>
            </div>
          )}
        </div>
        <div className="mb-3">
          <button className="search-btn1" type="submit">
            Continue
          </button>
        </div>
      </Form>
    </div>
  );
}
