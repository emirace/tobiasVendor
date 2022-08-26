import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { Store } from "../../../Store";

const Container = styled.div`
  flex: 4;
  margin: 0 20px;
  padding: 20px;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  @media (max-width: 992px) {
    padding: 10px;
    margin: 0;
  }
`;

const Title = styled.h1`
  font-size: 28px;
`;

const SumaryContDetails = styled.div`
  border-radius: 5px;
  padding: 15px 20px;
  margin-bottom: 15px;
  height: 100%;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev2)"};

  @media (max-width: 992px) {
    padding: 10px 15px;
  }
`;

const ItemNum = styled.div`
  display: flex;
`;

const Name = styled.div`
  text-transform: capitalize;
  font-weight: 600;
  margin-bottom: 10px;
`;

const reducer = (state, action) => {
  switch (action.type) {
    case "GET_REQUEST":
      return { ...state, loading: true };
    case "GET_SUCCESS":
      return { ...state, loading: false, returned: action.payload };
    case "GET_FAIL":
      return { ...state, loading: false };
    default:
      return state;
  }
};

export default function ReturnPage() {
  const { state } = useContext(Store);
  const { mode, userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;
  const [{ loading, returned }, dispatch] = useReducer(reducer, {
    loading: true,
    returned: {},
  });

  useEffect(() => {
    const getReturn = async () => {
      dispatch({ type: "GET_REQUEST" });
      try {
        const { data } = await axios.get("/api/returns/${returnId}", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "GET_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "GET_FAIL" });
        console.log(err);
      }
    };
  }, []);

  return (
    <Container>
      <Title>Return</Title>
      <SumaryContDetails mode={mode}>
        <Name>Deliver Option</Name>
        <ItemNum>ii</ItemNum>
        <hr />
        <Name>Deliver Address</Name>
        <ItemNum>hh</ItemNum>
      </SumaryContDetails>
    </Container>
  );
}
