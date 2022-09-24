import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import { socket } from "../../../App";
import DeliveryReturnScreen from "../../../screens/DeliveryReturnScreen";
import { Store } from "../../../Store";
import { getError } from "../../../utils";
import LoadingBox from "../../LoadingBox";
import ModelLogin from "../../ModelLogin";

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
  const [reasonText, setReasonText] = useState("");
  const [showModel, setShowModel] = useState(false);
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
        `/api/orders/${returned.orderId._id}/deliver`,
        { deliveryStatus },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "DELIVER_SUCCESS" });
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Return status updated",
          showStatus: true,
          state1: "visible1 success",
        },
      });
      socket.emit("post_data", {
        userId: returned.productId.seller._id,
        itemId: returned.orderId._id,
        notifyType: "delivery",
        msg: `Order ${deliveryStatus} `,
        link: `/return/${returned._id}`,
        userImage: userInfo.image,
      });
      socket.emit("post_data", {
        userId: returned.orderId.user._id,
        itemId: returned.orderId._id,
        notifyType: "delivery",
        msg: `Your order ${deliveryStatus} `,
        link: `/return/${returned._id}`,
        userImage: userInfo.image,
      });
    } catch (err) {
      console.log(getError(err));
      dispatch({ type: "DELIVER_FAIL" });
    }
  }

  const handleReturn = async (type) => {
    if (type === "Decline") {
      if (!reasonText.length) {
        ctxDispatch({
          type: "SHOW_TOAST",
          payload: {
            message: "Enter Reason for Decline",
            showStatus: true,
            state1: "visible1 error",
          },
        });
        return;
      }
      try {
        const { data } = await axios.put(
          `/api/returns/admin/${returnId}`,
          {
            adminReason: reasonText,
            status: "Decline",
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        console.log(data);
        dispatch({ type: "GET_SUCCESS", payload: data });
        deliverOrderHandler("Return Decline");
      } catch (error) {}
    } else {
      try {
        const { data } = await axios.put(
          `/api/returns/admin/${returnId}`,
          {
            status: "Approve",
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "GET_SUCCESS", payload: data });
        deliverOrderHandler("Return Approve");
      } catch (error) {}
    }
  };

  return loading ? (
    <LoadingBox />
  ) : (
    <Container mode={mode}>
      <Title>Return</Title>
      <SumaryContDetails mode={mode}>
        <Name>Preferred Resolution Method</Name>
        <ItemNum>Report Form</ItemNum>
        <hr />
        <Name>Reasons for Return</Name>
        <ItemNum>{returned.reason}</ItemNum>
        <hr />
        <Name>Preferred Sending Method</Name>
        <ItemNum>{returned.sending.deliveryOption}</ItemNum>
        <hr />
        <Name>Preferred Refund Method</Name>
        <ItemNum>{returned.refund}</ItemNum>
        <hr />
        <Name>Other Information</Name>
        <ItemNum>{returned.others}</ItemNum>
        <hr />
        <Name>Image</Name>
        <ItemNum>
          {returned.image && (
            <>
              <img
                src={returned.image}
                style={{ maxHeight: "400px" }}
                alt="img"
              />
            </>
          )}
        </ItemNum>
        {returned.status !== "Pending" ? (
          <>
            <hr />
            <Name style={{ color: "var(--orange-color)" }}>Status</Name>
            <ItemNum
              style={{ color: returned.status === "Decline" ? "red" : "green" }}
            >
              {returned.status}
            </ItemNum>
            {returned.status === "Decline" && (
              <ItemNum>Reason: {returned.adminReason}</ItemNum>
            )}
            <hr />
          </>
        ) : userInfo.isAdmin ? (
          <>
            <div style={{ marginTop: "20px" }}>
              <textarea
                style={{ width: "50%", height: "150px" }}
                onChange={(e) => setReasonText(e.target.value)}
              >
                Enter Reason for Declince here...
              </textarea>
            </div>
            <Button onClick={() => handleReturn("Approve")}>Approve</Button>
            <Button className="decline" onClick={() => handleReturn("Decline")}>
              Decline
            </Button>
          </>
        ) : (
          <p style={{ color: "red" }}>Waiting Admin Approver/Decline</p>
        )}
        {returned.status === "Approve" && (
          <>
            <Name>Return Delivery Address</Name>
            {returned.returnDelivery ? (
              Object.entries(returned.returnDelivery).map(([key, value]) => (
                <div
                  style={{
                    display: "flex",
                    textTransform: "capitalize",
                    fontSize: "13px",
                  }}
                >
                  <div style={{ flex: "1" }}>{key}:</div>
                  <div style={{ flex: "5" }}>{value}</div>
                </div>
              ))
            ) : returned.productId.seller._id === userInfo._id ? (
              <Button
                style={{ width: "250px", marginTop: "10px" }}
                onClick={() => setShowModel(true)}
              >
                Add Return Delivery Address
              </Button>
            ) : (
              <div>Waiting Seller's delivery address</div>
            )}
          </>
        )}
      </SumaryContDetails>
      <ModelLogin setShowModel={setShowModel} showModel={showModel}>
        <DeliveryReturnScreen
          setShowModel={setShowModel}
          dispatch={dispatch}
          returned={returned}
        />
      </ModelLogin>
    </Container>
  );
}
