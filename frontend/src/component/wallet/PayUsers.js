import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useReducer, useState } from "react";
import styled from "styled-components";
import { Store } from "../../Store";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { v4 } from "uuid";
import { getError } from "../../utils";
import axios from "axios";
import MessageBox from "../MessageBox";
import LoadingBox from "../LoadingBox";
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

export default function PayUsers({ setShowModel, setRefresh, refresh }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo, currency } = state;
  const [{ loading, error, message }, dispatch] = useReducer(reducer, {
    loading: false,
    error: "",
    balance: 0,
  });
  const [amount, setAmount] = useState("");
  const [userId, setUserId] = useState("");
  const [purpose, setPurpose] = useState("");

  const onApprove = async (response) => {
    console.log(!userId);
    if (!userId) {
      dispatch({ type: "FETCH_FAIL", payload: "Enter a valid User Id" });
      return;
    }
    if (userId.length < 24) {
      dispatch({ type: "FETCH_FAIL", payload: "Enter a valid User Id" });
      return;
    }
    if (!amount) {
      dispatch({ type: "FETCH_FAIL", payload: "Enter a valid amount" });
      return;
    }
    if (!purpose) {
      dispatch({ type: "FETCH_FAIL", payload: "Enter purpose of payment" });
      return;
    }

    dispatch({ type: "FETCH_REQUEST" });
    try {
      const { data } = await axios.post(
        "/api/payments",
        {
          userId,
          amount,
          meta: {
            Type: purpose,
            from: "Wallet",
            to: "Wallet",
            typeName: "User",
            id: userId,
            currency,
          },
        },
        {
          headers: { authorization: `Bearer ${userInfo.token}` },
        }
      );
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Transfer request sent",
          showStatus: true,
          state1: "visible1 success",
        },
      });
      dispatch({ type: "FETCH_FAIL", payload: data.message });
      setRefresh(!refresh);
      setShowModel(false);
    } catch (err) {
      dispatch({ type: "FETCH_FAIL", payload: getError(err) });
    }
  };
  return (
    <Container>
      <FontAwesomeIcon size="4x" color="var(--orange-color)" icon={faWallet} />
      <Text>Make Transfer</Text>
      <div style={{ color: "grey", textTransform: "uppercase" }}>
        From {userInfo.username}
      </div>
      {error && <MessageBox variant="danger">{error}</MessageBox>}
      <Input
        type="text"
        mode={mode}
        value={userId}
        placeholder="Enter User Id"
        onChange={(e) => setUserId(e.target.value)}
      />
      <Input
        type="number"
        mode={mode}
        value={amount}
        placeholder="Enter Amount to be Added in Wallet"
        onChange={(e) => setAmount(e.target.value)}
      />
      <Input
        type="text"
        mode={mode}
        value={purpose}
        placeholder="Enter Purpose of Payment"
        onChange={(e) => setPurpose(e.target.value)}
      />
      {loading ? <LoadingBox /> : <Button onClick={onApprove}>Continue</Button>}
    </Container>
  );
}
