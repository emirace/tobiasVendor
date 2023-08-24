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
    currency,
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
        <title>Payment Methods</title>
      </Helmet>
      <h1 className="my-3">Payment Methods</h1>
      <Form onSubmit={submitHandler}>
        <div className="mb-3">
          <Form.Check
            type="radio"
            id="card"
            label="Card"
            value="card"
            checked={paymentMethodName === "card"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <Form.Check
            type="radio"
            id="ussd"
            label="USSD"
            value="ussd"
            checked={paymentMethodName === "ussd"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <Form.Check
            type="radio"
            id="account"
            label="Account"
            value="account"
            checked={paymentMethodName === "account"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <Form.Check
            type="radio"
            id="banktransfer"
            label="Bank Transfer"
            value="banktransfer"
            checked={paymentMethodName === "banktransfer"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <Form.Check
            disabled={balance === 0 || balance <= totalPrice}
            type="radio"
            id="Wallet"
            label={`Wallet (${currency}${balance.toFixed(2)})`}
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
