import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import styled from "styled-components";
import { socket } from "../../../App";
import DeliveryReturnScreen from "../../../screens/DeliveryReturnScreen";
import { Store } from "../../../Store";
import { deliveryNumber, getError } from "../../../utils";
import DeliveryHistory from "../../DeliveryHistory";
import LoadingBox from "../../LoadingBox";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import ModelLogin from "../../ModelLogin";
import { Link } from "react-router-dom";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

const SetStatus = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const TrackingCont = styled.div`
  display: flex;
  align-items: center;
  & svg {
    color: var(--orange-color);
    height: 40px;
    width: 40px;
    cursor: pointer;
    &:hover {
      color: var(--malon-color);
    }
  }
`;

const TextInput = styled.input`
  background: none;
  color: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--white-color)"
      : "var(--black-color)"};
  border: 1px solid grey;
  border-radius: 0.2rem;
  height: 40px;
  padding: 10px;
  margin-left: 20px;
  &:focus-visible {
    outline: 1px solid var(--orange-color);
  }
  &:hover svg {
    color: var(--malon-color);
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
  const [refresh, setRefresh] = useState(true);
  const [enterwaybil, setEnterwaybil] = useState(false);
  const [waybillNumber, setWaybillNumber] = useState("");
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
  }, [refresh]);

  const paymentRequest = async (user, cost, itemCurrency) => {
    const { data: paymentData } = await axios.post(
      "/api/payments",
      {
        userId: returned.orderId.user._id,
        amount:
          returned.returnDelivery.cost * 2 + returned.productId.actualPrice,
        meta: {
          Type: "Return Completed",
          from: "Wallet",
          to: "Wallet",
          typeName: "Return",
          id: returned.orderId._id,
          currency: returned.productId.currency,
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
      msg: `Return Completed`,
      link: `/payment/${paymentData._id}`,
      userImage: returned.orderId.user.image,
    });
  };

  async function deliverOrderHandler(deliveryStatus, productId) {
    try {
      dispatch({ type: "DELIVER_REQUEST" });
      await axios.put(
        `/api/orders/${returned.orderId._id}/deliver/${productId}`,
        { deliveryStatus, returnTrackingNumber: waybillNumber },
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
      if (
        deliveryStatus === "Return Dispatched" ||
        deliveryStatus === "Return Delivered"
      ) {
        socket.emit("post_data", {
          userId: returned.productId.seller._id,
          itemId: returned.orderId._id,
          notifyType: "delivery",
          msg: `Order ${deliveryStatus} `,
          link: `/return/${returned._id}`,
          userImage: userInfo.image,
        });
      } else {
        socket.emit("post_data", {
          userId: returned.orderId.user._id,
          itemId: returned.orderId._id,
          notifyType: "delivery",
          msg: `Your order ${deliveryStatus} `,
          link: `/return/${returned._id}`,
          userImage: userInfo.image,
        });
      }
      setRefresh(!refresh);
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
        deliverOrderHandler("Return Declined", returned.productId._id);
        paymentRequest(
          returned.productId.seller._id,
          (92.1 / 100) *
            (returned.returnDelivery.cost + returned.productId.actualPrice),
          returned.productId.currency
        );
      } catch (error) {}
    } else {
      try {
        const { data: withdrawData } = await axios.post(
          "/api/accounts/withdraw",
          {
            amount: returned.sending.cost * 2,
            purpose: "Return delivery fee",
            userId: returned.productId.seller._id,
          },
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );
        if (!withdrawData.success) {
          socket.emit("post_data", {
            userId: returned.productId.seller._id,
            itemId: returned.orderId._id,
            notifyType: "return",
            msg: `Fund your wallet to complete return`,
            link: `/dashboard/wallet`,
            userImage:
              "	https://res.cloudinary.com/emirace/image/upload/v1659695040/images_imx0wy.png",
          });
        } else {
          await axios.post(
            "/api/accounts/deposit",
            {
              amount: returned.sending.cost * 2,
              purpose: "Return delivery fee",
              userId: "Admin",
            },
            {
              headers: { Authorization: `Bearer ${userInfo.token}` },
            }
          );
        }

        const { data } = await axios.put(
          `/api/returns/admin/${returnId}`,
          {
            status: "Approved",
            transaction_id: withdrawData.transaction_id || null,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "GET_SUCCESS", payload: data });
        deliverOrderHandler("Return Approved", returned.productId._id);
      } catch (error) {}
    }
  };

  const comfirmWaybill = async (product) => {
    if (!waybillNumber) return;

    await deliverOrderHandler("Return Dispatched", product._id);
    setEnterwaybil(false);
  };

  return loading ? (
    <LoadingBox />
  ) : (
    <Container mode={mode}>
      <Title>Return ID MRRN: {returnId}</Title>
      <SumaryContDetails mode={mode}>
        <Name>Product</Name>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img
            src={returned.productId.image}
            alt=""
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              objectFit: "cover",
              objectPosition: "top",
            }}
          />
          <Link to={`/product/${returned.productId.slug}`}>
            <div style={{ marginLeft: "20px" }}>{returned.productId.name}</div>
          </Link>
        </div>
        <hr />
        <Name>Buyer</Name>
        <ItemNum>
          <Link to={`/seller/${returned.orderId.user._id}`}>
            {returned.orderId.user.username}
          </Link>
        </ItemNum>
        <hr />

        <Name>Seller</Name>
        <ItemNum>
          <Link to={`/seller/${returned.productId.seller._id}`}>
            {returned.productId.seller.username}
          </Link>
        </ItemNum>
        <hr />
        <Name>Preferred Resolution Method</Name>
        <ItemNum>Report Form</ItemNum>
        <hr />
        <Name>Reasons for Return</Name>
        <ItemNum>{returned.reason}</ItemNum>
        <hr />
        <Name>Preferred Sending Method</Name>
        <ItemNum>{returned.sending["delivery Option"]}</ItemNum>
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
            <Button onClick={() => handleReturn("Approved")}>Approve</Button>
            <Button className="decline" onClick={() => handleReturn("Decline")}>
              Decline
            </Button>
          </>
        ) : (
          <p style={{ color: "red" }}>Waiting Admin Approver/Decline</p>
        )}
        {returned.status === "Approved" && (
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
              <div style={{ color: "var(--red-color)" }}>
                Waiting Seller's delivery address
              </div>
            )}
          </>
        )}
        {returned.orderId.orderItems.map(
          (orderitem) =>
            orderitem._id === returned.productId._id && (
              <>
                <SetStatus>
                  {returned.productId.seller._id === userInfo._id ? (
                    <FormControl
                      sx={{
                        minWidth: "220px",
                        margin: 0,
                        borderRadius: "0.2rem",
                        border: `1px solid ${
                          mode === "pagebodydark"
                            ? "var(--dark-ev4)"
                            : "var(--light-ev4)"
                        }`,
                        "& .MuiOutlinedInput-root": {
                          color: `${
                            mode === "pagebodydark"
                              ? "var(--white-color)"
                              : "var(--black-color)"
                          }`,
                          "&:hover": {
                            outline: "none",
                            border: 0,
                          },
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          border: "0 !important",
                        },
                      }}
                      size="small"
                    >
                      <InputLabel
                        sx={{
                          color: `${
                            mode === "pagebodydark"
                              ? "var(--white-color)"
                              : "var(--black-color)"
                          }`,
                        }}
                        id="deliveryStatus"
                      >
                        Update Delivery Status
                      </InputLabel>

                      <Select
                        onChange={(e) => {
                          deliverOrderHandler(
                            e.target.value,
                            returned.productId._id
                          );
                          paymentRequest(
                            returned.orderId.user._id,
                            returned.returnDelivery.cost * 2 +
                              returned.productId.actualPrice *
                                returned.productId.quantity,
                            returned.productId.currency
                          );
                        }}
                        displayEmpty
                        id="deliveryStatus"
                      >
                        <MenuItem
                          disabled={
                            deliveryNumber(orderitem.deliveryStatus) !== 10
                          }
                          value="Return Received"
                        >
                          Return Received
                        </MenuItem>
                      </Select>
                    </FormControl>
                  ) : enterwaybil ? (
                    <TrackingCont>
                      <label>Enter Tracking number </label>
                      <TextInput
                        mode={mode}
                        value={waybillNumber}
                        type="text"
                        onChange={(e) => setWaybillNumber(e.target.value)}
                      />
                      <FontAwesomeIcon
                        icon={faSquareCheck}
                        onClick={() => comfirmWaybill(orderitem)}
                      />
                    </TrackingCont>
                  ) : (
                    <>
                      {orderitem.returnTrackingNumber && (
                        <label style={{ marginRight: "20px" }}>
                          Tracking Number: {orderitem.returnTrackingNumber}
                        </label>
                      )}
                      <FormControl
                        sx={{
                          minWidth: "220px",
                          margin: 0,
                          borderRadius: "0.2rem",
                          border: `1px solid ${
                            mode === "pagebodydark"
                              ? "var(--dark-ev4)"
                              : "var(--light-ev4)"
                          }`,
                          "& .MuiOutlinedInput-root": {
                            color: `${
                              mode === "pagebodydark"
                                ? "var(--white-color)"
                                : "var(--black-color)"
                            }`,
                            "&:hover": {
                              outline: "none",
                              border: 0,
                            },
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "0 !important",
                          },
                        }}
                        size="small"
                      >
                        <InputLabel
                          sx={{
                            color: `${
                              mode === "pagebodydark"
                                ? "var(--white-color)"
                                : "var(--black-color)"
                            }`,
                          }}
                          id="deliveryStatus"
                        >
                          Update Delivery Status
                        </InputLabel>

                        <Select
                          onChange={(e) => {
                            if (e.target.value === "Return Dispatched") {
                              setEnterwaybil(true);
                            } else {
                              deliverOrderHandler(
                                e.target.value,
                                returned.productId._id
                              );
                            }
                          }}
                          displayEmpty
                          id="deliveryStatus"
                        >
                          <MenuItem
                            disabled={
                              deliveryNumber(orderitem.deliveryStatus) !== 8
                            }
                            value="Return Dispatched"
                          >
                            Return Dispatched
                          </MenuItem>

                          <MenuItem
                            disabled={
                              deliveryNumber(orderitem.deliveryStatus) !== 9
                            }
                            value="Return Delivered"
                          >
                            Return Delivered
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </>
                  )}
                </SetStatus>
                <DeliveryHistory
                  status={deliveryNumber(orderitem.deliveryStatus)}
                />
              </>
            )
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
