import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useReducer, useState } from "react";
import styled from "styled-components";
import { Store } from "../../Store";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { v4 } from "uuid";
import { getError } from "../../utils";
import axios from "axios";
import LoadingBox from "../LoadingBox";
import MessageBox from "../MessageBox";
const BASE_KEY = process.env.REACT_APP_FLUTTERWAVE_KEY;

const Container = styled.div`
  margin-top: 30px;
  padding: 20px;
`;
const Content = styled.div`
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
const Amount = styled.div`
  font-weight: bold;
  margin: 20px 0;
  color: var(--orange-color);
  font-size: 40px;
`;

const LogoImage = styled.img`
  height: 15px;
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

export default function PayFund({ setShowModel, amount, onApprove }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo, currency } = state;
  const [{ loading, error, message }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
    balance: 0,
  });

  const handlePayment = async () => {
    dispatch({ type: "FETCH_REQUEST" });
    try {
      const { data } = await axios.post(
        "/api/accounts/transfer",
        { amount, purpose: "Payment" },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );

      if (!data.success) {
        ctxDispatch({
          type: "SHOW_TOAST",
          payload: {
            message: data.message,
            showStatus: true,
            state1: "visible1 success",
          },
        });
        return;
      }
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Payment Successful",
          showStatus: true,
          state1: "visible1 success",
        },
      });
      onApprove({ transaction_id: data.transaction_id, method: "wallet" });
      setShowModel(false);
    } catch (err) {
      console.log(err);

      dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: getError(err),
          showStatus: true,
          state1: "visible1 error",
        },
      });
    }
  };
  return (
    <Container>
      <LogoImage
        src={
          mode === "pagebodydark"
            ? "https://res.cloudinary.com/emirace/image/upload/v1661147636/Logo_White_3_ii3edm.gif"
            : "https://res.cloudinary.com/emirace/image/upload/v1661147778/Logo_Black_1_ampttc.gif"
        }
      />
      <Content>
        <FontAwesomeIcon
          size="4x"
          color="var(--orange-color)"
          icon={faWallet}
        />
        <Text>Make payment from your Repeddle Wallet</Text>
        {error && <MessageBox variant="danger">{error}</MessageBox>}
        <Amount>
          {currency}
          {amount}
        </Amount>
        {loading ? (
          <LoadingBox />
        ) : (
          <Button
            onClick={() => {
              handlePayment();
            }}
          >
            Continue
          </Button>
        )}
      </Content>
    </Container>
  );
}
