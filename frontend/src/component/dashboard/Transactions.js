import {
  faCirclePlus,
  faMoneyBillTransfer,
  faPlus,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { Store } from "../../Store";
import { getError } from "../../utils";
import LoadingBox from "../LoadingBox";
import AddFund from "../wallet/AddFund";
import WalletModel from "../wallet/WalletModel";
import Withdraw from "../wallet/Withdraw";
import WidgetLarge from "./WidgetLarge";
const Container = styled.div`
  flex: 4;
  margin-left: 20px;
  padding: 20px;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  @media (max-width: 992px) {
    padding: 10px;
    margin: 0;
    margin-bottom: 10px;
  }
`;
const BannerImage = styled.div`
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev3)" : "#fcf0e0"};
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  padding: 20px;
  justify-content: space-between;
`;
const Balance = styled.div`
  font-weight: bold;
  font-size: 50px;
  color: var(--orange-color);
  font-family: "Absentiasans";
  @media (max-width: 992px) {
    font-size: 20px;
  }
`;
const Currency = styled.div`
  font-size: 15px;
`;
const Action = styled.div`
  display: flex;
  align-items: center;
  border-radius: 0.2rem;
  padding: 10px 30px;
  cursor: pointer;
  font-weight: bold;
  background-color: var(--orange-color);
  color: white;
  & svg {
    margin-right: 10px;
  }
  &:hover {
  }

  @media (max-width: 992px) {
    padding: 5px 7px;
    font-size: 12px;
  }
`;
const TextSmall = styled.div`
  font-weight: bold;
  color: var(--orange-color);

  @media (max-width: 992px) {
    font-size: 11px;
  }
`;
const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, balance: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function Transactions() {
  const { state } = useContext(Store);
  const { mode, userInfo } = state;

  const [{ loading, error, balance }, dispatch] = useReducer(reducer, {
    loading: true,
    error: "",
    balance: {},
  });
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    try {
      dispatch({ type: "FETCH_REQUEST" });
      const getBalance = async () => {
        const { data } = await axios.get("/api/accounts/balance", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      };
      getBalance();
    } catch (err) {
      console.log(getError(err));
      dispatch({ type: "FETCH_FAIL", payload: getError(err) });
    }
  }, [userInfo, refresh]);

  const [showModel, setShowModel] = useState(false);
  const [withdrawShowModel, setWithdrawShowModel] = useState(false);
  return (
    <Container mode={mode}>
      <BannerImage mode={mode}>
        <div>
          {loading ? (
            <LoadingBox />
          ) : (
            <Balance>
              {`${balance.currency}${Math.floor(balance.balance * 100) / 100}`}
            </Balance>
          )}
          <TextSmall>Current Repeddle Wallet Balance</TextSmall>
        </div>
        <div>
          <Action onClick={() => setShowModel(true)}>
            <FontAwesomeIcon icon={faPlus} />
            Fund my Wallet
          </Action>
          <TextSmall
            style={{ cursor: "pointer" }}
            onClick={() => setWithdrawShowModel(true)}
          >
            Request Payout
          </TextSmall>
        </div>
      </BannerImage>
      <WalletModel showModel={showModel} setShowModel={setShowModel}>
        <AddFund
          setShowModel={setShowModel}
          setRefresh={setRefresh}
          refresh={refresh}
          currency={balance.currency}
        />
      </WalletModel>
      <WalletModel
        showModel={withdrawShowModel}
        setShowModel={setWithdrawShowModel}
      >
        <Withdraw
          setShowModel={setWithdrawShowModel}
          setRefresh={setRefresh}
          refresh={refresh}
          balance={balance}
        />
      </WalletModel>
      <WidgetLarge refresh={refresh} />
    </Container>
  );
}
