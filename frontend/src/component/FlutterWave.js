import React, { useContext, useEffect, useState } from "react";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { v4 } from "uuid";
import styled from "styled-components";
import axios from "axios";
import { Store } from "../Store";
// const BASE_KEY = process.env.REACT_APP_FLUTTERWAVE_KEY;

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
export default function FlutterWave({
  amount,
  currency,
  user,
  onApprove,
  method,
}) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [baseKey, setBaseKey] = useState("");
  useEffect(() => {
    const getKey = async () => {
      const { data } = await axios.get("/api/keys/flutterwave", {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      console.log(data);
      setBaseKey(data);
    };
    getKey();
  }, []);

  console.log("method", method);

  const config = {
    public_key: baseKey,
    tx_ref: v4(),
    amount,
    currency,
    payment_options: method,
    customer: {
      email: user.email,
      phonenumber: user.phone,
      name: `${user.firstName} ${user.lastName}`,
    },
    customizations: {
      title: "Repeddle",
      description: "Payment for items in cart",
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  return (
    <div className="App">
      <Button
        onClick={() => {
          handleFlutterPayment({
            callback: async (response) => {
              onApprove(response);
              closePaymentModal(); // this will close the modal programmatically
            },
            onClose: () => {},
          });
        }}
      >
        Proceed to Payment
      </Button>
    </div>
  );
}
