import React, { useContext } from "react";
import { usePaystackPayment } from "react-paystack";
import { Store } from "../../Store";
import { region } from "../../utils";
import styled from "styled-components";

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
  margin-top: 10px;
  &:hover {
    background: var(--malon-color);
  }
`;

const Paystack = ({ amount, onApprove }) => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const config = {
    reference:
      "REP_" +
      Math.floor(Math.random() * 1000 + 1) +
      new Date().getTime().toString(),
    email: userInfo.email,
    amount: amount * 100,
    publicKey: "pk_live_96998e69a31a4a9d1afc9ec874dec535657ce0ad",
    currency: region(),
  };

  // you can call this function anything
  const onSuccess = (reference) => {
    // Implementation for whatever you want to do with reference and after success call.
    console.log(reference);
    onApprove({ transaction_id: reference.reference, type: "paystack" });
  };

  // you can call this function anything
  const onClose = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    console.log("closed");
    // onClose();
  };

  const initializePayment = usePaystackPayment(config);
  return (
    <Button
      onClick={() => {
        initializePayment(onSuccess, onClose);
      }}
    >
      Paystack
    </Button>
  );
};

export default Paystack;
