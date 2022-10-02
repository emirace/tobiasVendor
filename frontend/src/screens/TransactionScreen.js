import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import LoadingBox from "../component/LoadingBox";
import { Store } from "../Store";

const Container = styled.div`
  margin: 0 10vw;
`;
const Title = styled.h4`
  padding: 20px 20px 0 20px;
`;
const Section = styled.div`
  padding: 20px;
`;
const Row = styled.div`
  display: flex;
  align-self: center;
`;
const Key = styled.div`
  font-weight: 600;
  margin: 20px 0;
  flex: 1;
`;
const Value = styled.div`
  margin: 20px 0;
  flex: 2;
`;

const reducer = (state, action) => {
  switch (action.type) {
    case "GET_REQUEST":
      return { ...state, loading: true };
    case "GET_SUCCESS":
      return { ...state, loading: false, transaction: action.payload };
    case "GET_FAIL":
      return { ...state, loading: false };
    case "DELIVER_REQUEST":
      return { ...state, loadingDeliver: true };
    case "DELIVER_SUCCESS":
      return { ...state, loadingDeliver: false };
    case "DELIVER_FAIL":
      return {
        ...state,
        loadingDeliver: false,
        errorDeliver: action.payload,
      };
    default:
      return state;
  }
};
export default function TransactionScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const params = useParams();
  const { id: transactionId } = params;

  const [{ loading, transaction, loadingDeliver }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      transaction: {},
    }
  );
  useEffect(() => {
    const getReturn = async () => {
      dispatch({ type: "GET_REQUEST" });
      try {
        const { data } = await axios.get(`/api/transactions/${transactionId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "GET_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "GET_FAIL" });
        console.log(err);
      }
    };
    getReturn();
  }, []);
  return loading ? (
    <LoadingBox />
  ) : (
    <Container>
      <div style={{ display: "flex" }}>
        <div style={{ flex: "1" }}>
          <Section>
            <Title>Transaction information</Title>
            <hr />
            <Row>
              <Key>Transaction Id</Key>
              <Value>{transactionId}</Value>
            </Row>
            <Row>
              <Key>Reference</Key>
              <Value>{transaction.reference}</Value>
            </Row>
            <Row>
              <Key>Amount</Key>
              <Value>{transaction.amount}</Value>
            </Row>
            <Row>
              <Key>Type</Key>
              <Value>{transaction.type}</Value>
            </Row>
          </Section>
          <Section>
            <Title>Customer information</Title>
            <hr />
          </Section>
        </div>
        <div style={{ flex: "1", border: "1px solid", margin: "5vw" }}>
          <Section>
            <Title>Transaction time</Title>
          </Section>
        </div>
      </div>
    </Container>
  );
}
