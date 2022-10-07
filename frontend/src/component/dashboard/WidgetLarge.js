import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import styled from "styled-components";
import { Store } from "../../Store";
import { getError } from "../../utils";
import LoadingBox from "../LoadingBox";
import moment from "moment";

const Container = styled.div`
  flex: 2;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  padding: 20px;
  border-radius: 0.2rem;
`;
const Tittle = styled.div`
  font-size: 22px;
  font-weight: 600;
`;
const Table = styled.table`
  width: 100%;
  border-spacing: 20px;
`;
const Th = styled.th`
  text-align: left;
  padding: 10px 0;
  font-weight: bold;
`;
const Tr = styled.tr``;
const User = styled.td`
  text-transform: capitalize;
  align-items: center;
  margin: 10px 0;
`;
const Img = styled.img.attrs((props) => ({
  src: props.src,
  alt: props.src,
}))`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
`;
const Name = styled.span``;
const Date = styled.td`
  font-weight: 300;
`;
const Amount = styled.td`
  font-weight: 300;
`;
const Status = styled.td``;
const Button = styled.button`
  padding: 5px 7px;
  border: 0;
  border-radius: 0.2rem;
  &.Done {
    background: ${(props) =>
      props.mode === "pagebodydark" ? "#112014" : "#d6f5dc"};
    color: var(--green-color);
  }
  &.Declined {
    background: ${(props) =>
      props.mode === "pagebodydark" ? "#211111" : "#f8d6d6"};
    color: var(--red-color);
  }
  &.Pending {
    background: ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev3)" : "#fcf0e0"};
    color: var(--orange-color);
  }
`;

const reducer = (state, action) => {
  switch (action.type) {
    case "TRANS_REQUEST":
      return { ...state, loadingTrans: true };
    case "TRANS_SUCCESS":
      return { ...state, loadingTrans: false, transactions: action.payload };
    case "TRANS_FAIL":
      return { ...state, loadingTrans: false, errorTrans: action.payload };
    default:
      return state;
  }
};

export default function WidgetLarge({ refresh }) {
  const { state } = useContext(Store);
  const { mode, userInfo, currency } = state;

  const [{ loadingTrans, error, transactions }, dispatch] = useReducer(
    reducer,
    {
      loadingTrans: true,
      error: "",
      transactions: null,
    }
  );

  useEffect(() => {
    try {
      const getTrans = async () => {
        dispatch({ type: "TRANS_REQUEST" });
        const { data } = await axios.get("/api/transactions/user", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "TRANS_SUCCESS", payload: data });
        console.log(data);
      };
      getTrans();
    } catch (err) {
      console.log(getError(err));
      dispatch({ type: "TRANS_FAIL", payload: getError(err) });
    }
  }, [refresh]);

  const actionButton = (type) => {
    return (
      <Button mode={mode} className={type}>
        {type}
      </Button>
    );
  };

  return loadingTrans ? (
    <LoadingBox />
  ) : (
    <Container mode={mode}>
      <Tittle>Latest transactions</Tittle>
      <Table>
        <Tr>
          <Th>Id</Th>
          <Th>Purpose</Th>
          <Th>Date</Th>
          <Th>Type</Th>
          <Th>Amount</Th>
          <Th>Status</Th>
        </Tr>
        {transactions.map((t) => (
          <Tr>
            <User>{t._id}</User>
            <User>{t.metadata ? t.metadata.purpose : ""}</User>
            <Date>{moment(t.createdAt).format("MMM Do, h:mm:ss a")}</Date>
            <Amount>{t.txnType}</Amount>
            <Amount>
              {currency}
              {t.amount}
            </Amount>
            <Status>{actionButton("Done")}</Status>
          </Tr>
        ))}
      </Table>
    </Container>
  );
}
