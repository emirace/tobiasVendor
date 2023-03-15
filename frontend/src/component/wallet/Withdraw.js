import { faQuestionCircle, faWallet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { Store } from "../../Store";
import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import { v4 } from "uuid";
import { getError, region } from "../../utils";
import axios from "axios";
import LoadingBox from "../LoadingBox";
import MessageBox from "../MessageBox";
import { socket } from "../../App";
const BASE_KEY = process.env.REACT_APP_FLUTTERWAVE_KEY;

const Container = styled.div`
  margin-top: 30px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const InputCont = styled.div`
  height: 45px;
  margin: 25px 0 0 0;
  padding: 5px;
  width: 100%;
  border: 1px solid var(--malon-color);
  border-radius: 5px;
  display: flex;
  align-items: center;
`;
const Input = styled.input`
  background: none;
  flex: 1;
  border: 0;
  font-size: 18px;
  &:focus-visible {
    outline: none;
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
  margin-top: 10px;
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

const UpdateAccount = styled.div`
  padding: 40px;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
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
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo } = state;
  const [{ loading, error, user }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    balance: 0,
    user: null,
  });
  const [amount, setAmount] = useState("");
  const [fee, setFee] = useState("");
  const [errormsg, setErrormsg] = useState("");
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
  const handleWithdraw = async () => {
    console.log(amount, balance.balance);
    if (amount > balance.balance) {
      dispatch({
        type: "FETCH_FAIL",
        payload: "Enter amount less than current balance",
      });
    } else {
      try {
        const totalAmount = Number(amount) + Number(fee);
        const { data } = await axios.post(
          `/api/accounts/${region()}/transfer`,
          { amount: totalAmount, purpose: "Withdrawal Request" },
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
        const { data: paymentData } = await axios.post(
          "/api/payments",
          {
            userId: userInfo._id,
            amount,
            meta: {
              Type: "Withdrawal Request",
              from: "Wallet",
              to: "Account",
              currency: balance.currency,
              detail: {
                accountName: user.accountName,
                bankName: user.bankName,
                accountNumber: user.accountNumber,
              },
            },
          },
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        socket.emit("post_data", {
          userId: "Admin",
          itemId: paymentData._id,
          notifyType: "payment",
          msg: `Withdrawal request`,
          link: `/payment/${paymentData._id}`,
          mobile: { path: "PaymentScreen", id: paymentData._id },
          userImage: userInfo.image,
        });
        ctxDispatch({
          type: "SHOW_TOAST",
          payload: {
            message: "Withdrawal request sent successfully",
            showStatus: true,
            state1: "visible1 success",
          },
        });
        setShowModel(false);
        setRefresh(!refresh);
      } catch (err) {
        console.log(err);
      }
    }
  };
  const handleChange = (e) => {
    setAmount(e.target.value);
    dispatch({ type: "FETCH_FAIL", payload: "" });
    const fees =
      region() === "ZAR"
        ? 10
        : e.target.value <= 5000
        ? 10.75
        : e.target.value > 5000 && e.target.value <= 50000
        ? 26.88
        : 53.75;
    setFee(fees);
    const totalMoney = Number(e.target.value) + Number(fees);
    console.log("totalMoney", totalMoney);
    if (totalMoney > balance.balance) {
      setErrormsg(
        "Insufficient funds, Please enter a lower amount to complete your withdrawal"
      );
      return;
    }
    if (!e.target.value) {
      setErrormsg("Please enter the amount you want to withdraw");
      return;
    }
    setErrormsg("");
  };
  return loading ? (
    <LoadingBox />
  ) : !user.accountName ? (
    <UpdateAccount>
      <div style={{ textAlign: "center" }}>
        <h5>ADD A BANK ACCOUNT DETAILS</h5>
        <p>
          Go to your Profile, Edit and Add your Bank Account to request for a
          Withdrawal
        </p>
      </div>
    </UpdateAccount>
  ) : (
    <Container>
      <FontAwesomeIcon size="4x" color="var(--orange-color)" icon={faWallet} />
      {console.log(user)}
      <Text>To {user.accountName}</Text>
      <div style={{ color: "grey", textTransform: "uppercase" }}>
        {user.bankName} ({user.accountNumber})
      </div>
      {error && <MessageBox variant="danger">{error}</MessageBox>}
      <InputCont>
        <Input
          type="number"
          mode={mode}
          value={amount}
          placeholder="Enter Amount to Withdraw"
          onChange={handleChange}
        />
        <div
          style={{
            color: "var(--orange-color)",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={() => setAmount(Math.floor(balance.balance * 100) / 100)}
        >
          All
        </div>
      </InputCont>
      {errormsg && (
        <div
          style={{
            color: "red",
            fontSize: "11px",
          }}
        >
          {errormsg}
        </div>
      )}
      {amount && (
        <div
          style={{
            fontSize: "11px",
          }}
        >
          <FontAwesomeIcon icon={faQuestionCircle} /> You will be charged{" "}
          {balance.currency}
          {fee} for payment gateway withdrawal processing fee
        </div>
      )}
      <Button onClick={errormsg ? "" : handleWithdraw}>Withdraw</Button>
    </Container>
  );
}
