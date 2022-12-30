import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useReducer, useState } from "react";
import styled from "styled-components";
import { Store } from "../../Store";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { v4 } from "uuid";
import { getError, region } from "../../utils";
import axios from "axios";
import PayFast from "../PayFast";
import PayFastFund from "../PayFastFund";
const BASE_KEY = process.env.REACT_APP_FLUTTERWAVE_KEY;

const Container = styled.div`
  margin-top: 30px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Input = styled.input`
  width: 40%;
  height: 45px;
  padding: 15px;
  margin: 25px 0;
  width: 100%;
  background: none;
  border: 1px solid var(--malon-color);
  border-radius: 5px;
  &:focus-visible {
    outline: 1px solid var(--orange-color);
  }
  color: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--white-color)"
      : "var(--black-color)"};

  background: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--black-color)"
      : "var(--white-color)"};
  &::placeholder {
    padding: 10px;
  }
`;
const Text = styled.div`
  font-weight: bold;
  margin-top: 10px;
`;
const Button = styled.div`
  display: flex;
  align-items: center;
  border-radius: 0.2rem;
  padding: 10px 50px;
  cursor: pointer;
  font-weight: bold;
  background-color: var(--orange-color);
  color: white;
  & svg {
    margin-right: 10px;
  }
  &:hover {
    background: var(--malon-color);
  }
`;

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, message: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function AddFund({
  setShowModel,
  setRefresh,
  refresh,
  currency,
}) {
  const { state } = useContext(Store);
  const { mode, userInfo } = state;
  const [{ loading, error, message }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    balance: 0,
  });
  const [amount, setAmount] = useState("");
  const config = {
    public_key: BASE_KEY,
    tx_ref: v4(),
    amount,
    currency: currency === "N " ? "NGN" : "ZAR",
    //currency: "ZAR",
    //country: "ZAR",
    payment_options: "card,mobilemoney,ussd",
    customer: {
      email: userInfo.email,
      phonenumber: userInfo.phone,
      name: `${userInfo.firstName} ${userInfo.lastName}`,
    },
    customizations: {
      title: "Repeddle",
      description: "Funding Repeddle Wallet",
      logo: "https://st2.depositphotos.com/4403291/7418/v/450/depositphotos_74189661-stock-illustration-online-shop-log.jpg",
    },
  };

  const handleFlutterPayment = useFlutterwave(config);
  const onApprove = async (response) => {
    dispatch({ type: "FETCH_REQUEST" });
    try {
      const { data } = await axios.post(
        "/api/accounts/fundwallet",
        { ...response, purpose: "Wallet Funded" },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "FETCH_FAIL", payload: data.message });
      setShowModel(false);
      setRefresh(!refresh);
    } catch (err) {
      dispatch({ type: "FETCH_FAIL", payload: getError(err) });
    }
  };
  return (
    <Container>
      {console.log(BASE_KEY)}
      <FontAwesomeIcon size="4x" color="var(--orange-color)" icon={faWallet} />
      <Text>Fund your Wallet</Text>
      <Input
        type="number"
        mode={mode}
        value={amount}
        placeholder="Enter Amount to be Added in Wallet"
        onChange={(e) => setAmount(e.target.value)}
      />
      {region() === "" ? (
        <Button
          onClick={() => {
            handleFlutterPayment({
              callback: async (response) => {
                console.log(response);
                onApprove(response);
                closePaymentModal(); // this will close the modal programmatically
              },
              onClose: () => {},
            });
          }}
        >
          Continue
        </Button>
      ) : (
        <PayFastFund
          totalPrice={amount}
          setShowModel={setShowModel}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      )}
    </Container>
  );
}
