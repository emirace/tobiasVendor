import React, { useContext } from "react";
import { PaystackButton } from "react-paystack";
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
  &:hover {
    background: var(--malon-color);
  }
`;

const Paystack = ({ amount }) => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const config = {
    reference:
      "REP_" +
      Math.floor(Math.random() * 1000 + 1) +
      new Date().getTime().toString(),
    email: userInfo.email,
    amount: amount * 100,
    publicKey: "pk_test_8b77dc49b3d3fd1f63484986b3f8f0ea3c78b7dd",
    currency: region(),
  };

  // you can call this function anything
  const handlePaystackSuccessAction = (reference) => {
    // Implementation for whatever you want to do with reference and after success call.
    console.log(reference);
  };

  // you can call this function anything
  const handlePaystackCloseAction = () => {
    // implementation for  whatever you want to do when the Paystack dialog closed.
    console.log("closed");
  };

  const componentProps = {
    ...config,
    text: "Paystack Button Implementation",
    onSuccess: (reference) => handlePaystackSuccessAction(reference),
    onClose: handlePaystackCloseAction,
  };

  return (
    <Button>
      <PaystackButton {...componentProps} />
    </Button>
  );
};

export default Paystack;
