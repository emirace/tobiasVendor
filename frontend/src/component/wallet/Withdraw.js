import { faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useReducer, useState } from "react";
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
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Input = styled.input`
  width: 40%;
  height: 45px;
  padding: 15px;
  margin: 25px 0 0 0;
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
      return { ...state, loading: false, user: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function Withdraw({
  setShowModel,
  setRefresh,
  refresh,
  balance,
}) {
  const { state } = useContext(Store);
  const { mode, userInfo } = state;
  const [{ loading, error, user }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    balance: 0,
    user: null,
  });
  const [amount, setAmount] = useState("");
  useEffect(() => {
    const getUser = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get("/api/users/profile/user", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        console.log(getError(err));
        dispatch({ type: "FETCH_FAIL", payload: err });
      }
    };
    getUser();
  }, []);
  const handleWithdraw = () => {
    if (amount > balance) {
      dispatch({
        type: "FETCH_FAIL",
        payload: "Enter amount less than current balance",
      });
    } else {
    }
  };
  return loading ? (
    <LoadingBox />
  ) : !user.accountName ? (
    "Update Account Details to request for withdraw"
  ) : (
    <Container>
      <FontAwesomeIcon size="4x" color="var(--orange-color)" icon={faWallet} />
      {console.log(user)}
      <Text>To {user.accountName}</Text>
      <div style={{ color: "grey", textTransform: "uppercase" }}>
        {user.bankName} ({user.accountNumber})
      </div>
      {error && <MessageBox variant="danger">{error}</MessageBox>}
      <Input
        type="number"
        mode={mode}
        value={amount}
        placeholder="Enter Amount to Withdraw"
        onChange={(e) => {
          setAmount(e.target.value);
          dispatch({ type: "FETCH_FAIL", payload: "" });
        }}
      />
      <div
        style={{
          color: "var(--orange-color)",
          fontWeight: "bold",
          marginBottom: "25px",
          marginLeft: "auto",
          fontWeight: "13px",
        }}
        onClick={() => setAmount(balance.toFixed(2))}
      >
        All
      </div>
      <Button onClick={handleWithdraw}>Withdraw</Button>
    </Container>
  );
}
