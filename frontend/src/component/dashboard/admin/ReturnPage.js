import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import { Store } from "../../../Store";
import { getError } from "../../../utils";
import LoadingBox from "../../LoadingBox";

const Container = styled.div`
  flex: 4;
  margin: 0 10vw;
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

const Button = styled.button`
  width: 200px;
  border: none;
  background: var(--orange-color);
  color: var(--white-color);
  padding: 7px 10px;
  border-radius: 0.2rem;
  cursor: pointer;
  margin-right: 20px;
  margin-top: 30px;
  &:hover {
    background: var(--malon-color);
  }
  &.decline {
    background: var(--malon-color);
  }
`;

const reducer = (state, action) => {
  switch (action.type) {
    case "GET_REQUEST":
      return { ...state, loading: true };
    case "GET_SUCCESS":
      return { ...state, loading: false, returned: action.payload };
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

export default function ReturnPage() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo } = state;

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const orderId = sp.get("orderId");
  const params = useParams();
  const { id: returnId } = params;
  const [{ loading, returned, loadingDeliver }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      returned: {},
    }
  );

  useEffect(() => {
    const getReturn = async () => {
      dispatch({ type: "GET_REQUEST" });
      try {
        const { data } = await axios.get(`/api/returns/${returnId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "GET_SUCCESS", payload: data });
        console.log(data, returnId);
      } catch (err) {
        dispatch({ type: "GET_FAIL" });
        console.log(err);
      }
    };
    getReturn();
  }, []);

  async function deliverOrderHandler(deliveryStatus) {
    try {
      dispatch({ type: "DELIVER_REQUEST" });
      await axios.put(
        `/api/orders/${orderId}/deliver`,
        { deliveryStatus },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "DELIVER_SUCCESS" });
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Delivery status updated",
          showStatus: true,
          state1: "visible1 success",
        },
      });
    } catch (err) {
      console.log(getError(err));
      dispatch({ type: "DELIVER_FAIL" });
    }
  }

  return loading ? (
    <LoadingBox />
  ) : (
    <Container>
      <Title>Return</Title>
      <SumaryContDetails mode={mode}>
        <Name>Preferred Resolution Method</Name>
        <ItemNum>Report Form</ItemNum>
        <hr />
        <Name>Reasons for Return</Name>
        <ItemNum>{returned.reason}</ItemNum>
        <hr />
        <Name>Preferred Sending Method</Name>
        <ItemNum>{returned.sending}</ItemNum>
        <hr />
        <Name>Preferred Refund Method</Name>
        <ItemNum>{returned.refund}</ItemNum>
        <hr />
        <Name>Other Information</Name>
        <ItemNum>{returned.others}</ItemNum>
        <hr />
        <Name>Image</Name>
        <ItemNum>
          <img src={returned.image} style={{ maxWidth: "50%" }} alt="img" />
        </ItemNum>

        <Button onClick={() => deliverOrderHandler("Return Approve")}>
          Approve
        </Button>
        <Button
          className="decline"
          onClick={() => deliverOrderHandler("Return Decline")}
        >
          Decline
        </Button>
      </SumaryContDetails>
    </Container>
  );
}
