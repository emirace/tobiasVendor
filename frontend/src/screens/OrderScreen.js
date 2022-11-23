import axios from "axios";
import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingBox from "../component/LoadingBox";
import MessageBox from "../component/MessageBox";
import { Store } from "../Store";
import {
  deliveryNumber,
  displayDeliveryStatus,
  getError,
  timeDifference,
} from "../utils";
import ListGroup from "react-bootstrap/ListGroup";
import { toast } from "react-toastify";
import styled from "styled-components";
import moment from "moment";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import ModelLogin from "../component/ModelLogin";
import Return from "../component/Return";
import { socket } from "../App";
import Model from "../component/Model";
import DeliveryHistory from "../component/DeliveryHistory";
import {
  faCommentsDollar,
  faSquareCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Main = styled.div`
  margin: 20px;
  padding: 20px 5vw 0 5vw;
  background: white;
  @media (max-width: 992px) {
    margin: 10px;
    padding: 10px 5px 0 5px;
    background: ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  }
`;
const Container = styled.div`
  width: 100%;
  margin-bottom: 30px;
  border-radius: 5px;
  padding: 0 30px;
  @media (max-width: 992px) {
    padding: 0 10px;
    font-size: 13px;
  }
`;
const Header = styled.h1`
  margin-bottom: 0;
  padding: 15px 30px;
  @media (max-width: 992px) {
    padding: 10px 10px;
    font-size: 20px;
    margin-top: 15px;
  }
`;
const InvoiceHead = styled.h2`
  margin-bottom: 0;
  width: 100%;
  padding: 0;
  display: none;
  color: var(--malon-color);

  @media print {
    display: block;
  }
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
const SumaryCont = styled.div`
  padding: 15px 20px;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev2)"};
`;
const OrderId = styled.div`
  font-weight: bold;
`;
const Heading = styled.div`
  padding: 15px 0;
  font-weight: bold;
  text-transform: uppercase;
`;
const ItemNum = styled.div`
  display: flex;
`;
const Date = styled.div``;
const Price = styled.div``;

const Track = styled.span`
  color: var(--orange-color);
  font-size: 20px;
  cursor: pointer;
  &:hover {
    color: var(--malon-color);
  }
`;
const OrderItem = styled.div`
  display: flex;
  flex: 8;
  margin-bottom: 10px;
`;
const Image = styled.img`
  object-fit: cover;
  object-position: top;
  width: 100px;
  height: 130px;
`;
const Details1 = styled.div`
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const Name = styled.div`
  text-transform: capitalize;
  font-weight: 600;
  margin-bottom: 10px;
`;
const Quantity = styled.div`
  margin-bottom: 10px;
`;
const ItemPrice = styled.div`
  font-weight: bold;
`;
const StatusDeliver = styled.div`
  background: green;
  text-transform: uppercase;
  color: white;
  width: 150px;
  text-align: center;
  border-radius: 0.25rem;
`;
const StatusPending = styled.div`
  background: grey;
  text-transform: uppercase;
  border-radius: 0.25rem;

  color: white;
  width: 150px;
  text-align: center;
`;
const ActionButton = styled.div`
  flex: 2;
  @media print {
    display: none;
  }
`;
const DetailButton = styled.div`
  display: flex;
  justify-content: center;
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

const PaymentDlivery = styled.div`
  display: flex;
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

const PaymentDliveryItem = styled.div`
  flex: 1;
  margin: 5px;
  height: 100%;
`;

const Received = styled.div`
  cursor: pointer;
  background: var(--orange-color);
  color: var(--white-color);
  padding: 3px 7px;
  height: 30px;
  margin-right: 20px;
  &:hover {
    background: var(--malon-color);
  }
`;

const ReturnButton = styled.div`
  cursor: pointer;
  background: var(--malon-color);
  color: var(--white-color);
  padding: 3px 7px;
  height: 30px;
  &:hover {
    background: var(--orange-color);
  }
`;
const Print = styled.div`
  font-weight: 500;
  color: white;
  padding: 1px 8px;
  text-align: center;
  width: 150px;
  border-radius: 0.2rem;
  cursor: pointer;
  height: 30px;
  background: var(--orange-color);
  &:hover {
    background-color: var(--malon-color);
  }
  @media print {
    display: none;
  }
`;
const SetStatus = styled.div`
  @media print {
    display: none;
  }
`;

const AfterAction = styled.div`
  display: flex;
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

const UserCont = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
`;
const UserImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;
const UserName = styled.div`
  margin: 0 20px;
  font-weight: bold;
  &.link {
    &:hover {
      text-decoration: underline;
    }
  }
`;

const PaymentRow = styled.div`
  display: flex;
  justify-content: space-between;
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;
const Commision = styled.div`
  width: 50%;
  @media (max-width: 992px) {
    width: 100%;
    margin-top: 20px;
  }
`;

const Key = styled.div`
  flex: 2;
`;
const Value = styled.div`
  flex: 3;
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
const Cont123 = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;
const DeliveryKey = styled.div`
  flex: 1;
`;

const DeliveryValue = styled.div`
  flex: 5;
  @media (max-width: 992px) {
    flex: 1;
  }
`;

const SubSumaryContDetails = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return {
        ...state,
        loading: false,
        order: action.payload,
        error: "",
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false };
    case "DELIVER_REQUEST":
      return { ...state, loadingDeliver: true };
    case "DELIVER_SUCCESS":
      return { ...state, loadingDeliver: false, successDeliver: true };
    case "DELIVER_FAIL":
      return {
        ...state,
        loadingDeliver: false,
        errorDeliver: action.payload,
      };
    case "DELIVER_RESET":
      return { ...state, loadingDeliver: false, successDeliver: false };

    default:
      return state;
  }
}

export default function OrderScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, mode, currency } = state;
  const [
    {
      loading,
      error,
      order,
      successPay,
      loadingPay,
      loadingDeliver,
      successDeliver,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    order: {},
    error: "",
    successPay: false,
    loadingPay: false,
  });

  const params = useParams();
  const { id: orderId } = params;
  const navigate = useNavigate();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [showReturn, setShowReturn] = useState(false);
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();
  const [isSeller, setIsSeller] = useState(false);
  const [showDeliveryHistory, setShowDeliveryHistory] = useState(false);
  const [currentDeliveryHistory, setCurrentDeliveryHistory] = useState(0);
  const [enterwaybil, setEnterwaybil] = useState(false);
  const [waybillNumber, setWaybillNumber] = useState("");
  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: order.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          userInfo
            ? {
                headers: {
                  authorization: `Bearer ${userInfo.token}`,
                },
              }
            : {}
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
        toast.success("Order is paid");
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }

  function onError(err) {
    toast.error(getError(err));
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(
          `/api/orders/${orderId}`,
          userInfo
            ? {
                headers: {
                  authorization: `Bearer ${userInfo.token}`,
                },
              }
            : {}
        );
        if (userInfo) {
          const existSell = data.seller.filter((x) => x === userInfo._id);
          if (existSell.length) {
            setIsSeller(true);
          }
        }
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      (order._id && order._id !== orderId)
    ) {
      fetchOrder();
      if (successPay) {
        dispatch({ type: "PAY_RESET" });
      }
      if (successDeliver) {
        dispatch({ type: "DELIVER_RESET" });
      }
    } else {
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get(
          "/api/keys/paypal",
          userInfo
            ? {
                headers: {
                  authorization: `Bearer ${userInfo.token}`,
                },
              }
            : {}
        );
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": clientId,
            currency: "USD",
          },
        });
        paypalDispatch({ type: "useLoadingStatus", value: "pending" });
      };
      loadPaypalScript();
    }
  }, [
    order,
    userInfo,
    orderId,
    navigate,
    paypalDispatch,
    successPay,
    successDeliver,
  ]);

  async function deliverOrderHandler(deliveryStatus, productId, orderitem) {
    try {
      dispatch({ type: "DELIVER_REQUEST" });
      await axios.put(
        `/api/orders/${order._id}/deliver/${productId}`,
        { deliveryStatus, trackingNumber: waybillNumber },
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
      if (deliveryStatus === "Received" || deliveryStatus === "Return Logged") {
        socket.emit("post_data", {
          userId: orderitem.seller._id,
          itemId: order._id,
          notifyType: "delivery",
          msg: `Order ${deliveryStatus} `,
          link: `/order/${order._id}`,
          userImage: "/images/pimage.png",
        });
      } else {
        socket.emit("post_data", {
          userId: order.user,
          itemId: order._id,
          notifyType: "delivery",
          msg: `Order ${deliveryStatus} `,
          link: `/order/${order._id}`,
          userImage: "/images/pimage.png",
        });
      }
    } catch (err) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: getError(err),
          showStatus: true,
          state1: "visible1 error",
        },
      });
      console.log(getError(err));
      dispatch({ type: "DELIVER_FAIL" });
    }
  }

  const paymentRequest = async (seller, cost, itemCurrency, sellerImage) => {
    const { data: paymentData } = await axios.post(
      "/api/payments",
      {
        userId: seller,
        amount: (92.1 / 100) * cost,
        meta: {
          Type: "Order Completed",
          from: "Wallet",
          to: "Wallet",
          typeName: "Order",
          id: orderId,
          currency: itemCurrency,
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
      msg: `Order Completed`,
      link: `/payment/${paymentData._id}`,
      userImage: sellerImage,
    });
  };
  const daydiff = (x) =>
    order.createdAt &&
    x - timeDifference(new window.Date(order.createdAt), new window.Date());

  var itemsPrice = 0;
  var shippingPrice = 0;

  const refund = async (product) => {
    const { data: paymentData } = await axios.post(
      "/api/payments",
      {
        userId: order.user,
        amount:
          Number(product.deliverySelect.cost) + Number(product.actualPrice),
        meta: {
          Type: "Order Refund",
          from: "Wallet",
          to: "Wallet",
          typeName: "Order",
          id: orderId,
          currency: product.currency,
        },
      },
      {
        headers: { authorization: `Bearer ${userInfo.token}` },
      }
    );
    socket.emit("post_data", {
      userId: userInfo._id,
      itemId: product._id,
      notifyType: "payment",
      msg: `Order Refunded`,
      link: `/payment/${paymentData._id}`,
      userImage: "/images/pimage.png",
    });

    deliverOrderHandler("Refunded", product._id);
  };

  const paySeller = async (product) => {
    const { data: paymentData } = await axios.post(
      "/api/payments",
      {
        userId: product.seller._id,
        amount: (92.1 / 100) * product.actualPrice,
        meta: {
          Type: "Pay Seller",
          from: "Wallet",
          to: "Wallet",
          typeName: "Order",
          id: orderId,
          currency: product.currency,
        },
      },
      {
        headers: { authorization: `Bearer ${userInfo.token}` },
      }
    );
    socket.emit("post_data", {
      userId: userInfo._id,
      itemId: product._id,
      notifyType: "payment",
      msg: `Payment to Seller Initiated`,
      link: `/payment/${paymentData._id}`,
      userImage: "/images/pimage.png",
    });

    deliverOrderHandler("Payment to Seller Initiated", product._id);
  };

  const comfirmWaybill = async (product) => {
    if (!waybillNumber) return;

    await deliverOrderHandler("Dispatched", product._id);
    setEnterwaybil(false);
  };

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <Main mode={mode} ref={componentRef}>
      <Helmet>
        <title>Order {orderId}</title>
        {console.log(order)}
      </Helmet>
      <InvoiceHead>Invoice</InvoiceHead>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Header>Order Details</Header>
        <Print onClick={handlePrint}>Print as Invoice</Print>
      </div>
      <Container>
        <SumaryCont mode={mode}>
          <OrderId>Order number {orderId}</OrderId>

          <ItemNum>
            {order.orderItems.length} Item
            {order.orderItems.length > 1 ? "s" : ""}
          </ItemNum>
          <Date>
            Placed on{" "}
            {moment(order.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
          </Date>
          {/* <Price>
            Total: {currency}
            {order.totalPrice}
          </Price> */}
        </SumaryCont>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginRight: "20px",
          }}
        >
          <Heading>Items in your order</Heading>
          {!isSeller &&
            daydiff(3) > 0 &&
            deliveryNumber(order.deliveryStatus) > 3 && (
              <div
                style={{ cursor: "pointer" }}
                onClick={() => setShowReturn(true)}
              >
                <b>Log a return</b>
                <div style={{ color: "red" }}>{daydiff(3)} days left</div>
              </div>
            )}
          <ModelLogin setShowModel={setShowReturn} showModel={showReturn}>
            <Return
              deliverOrderHandler={deliverOrderHandler}
              orderItems={order.orderItems}
              deliveryMethod={order.deliveryMethod}
              setShowReturn={setShowReturn}
              orderId={orderId}
            />
          </ModelLogin>
        </div>
        {order.orderItems.map((orderitem) =>
          isSeller ? (
            orderitem.seller._id === userInfo._id && (
              <SumaryContDetails mode={mode}>
                <SubSumaryContDetails>
                  <div style={{ display: "none" }}>
                    {
                      (itemsPrice =
                        itemsPrice + orderitem.actualPrice * orderitem.quantity)
                    }
                    {
                      (shippingPrice =
                        shippingPrice + Number(orderitem.deliverySelect.cost))
                    }
                  </div>
                  <div>
                    <div style={{ display: "flex", textAlign: "center" }}>
                      {displayDeliveryStatus(orderitem.deliveryStatus)}
                      <div
                        style={{
                          color: "var(--malon-color)",
                          cursor: "pointer",
                          textAlign: "center",
                          marginLeft: "15px",
                        }}
                        onClick={() => {
                          setShowDeliveryHistory(true);
                          setCurrentDeliveryHistory(
                            deliveryNumber(orderitem.deliveryStatus)
                          );
                        }}
                      >
                        {console.log(
                          "deliverynumber",
                          orderitem.deliveryStatus,
                          deliveryNumber(orderitem.deliveryStatus)
                        )}
                        Track Order
                      </div>
                    </div>
                    <Name>
                      On{" "}
                      {moment(orderitem.deliveredAt).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}
                    </Name>
                  </div>
                  {userInfo &&
                    order.user === userInfo._id &&
                    orderitem.deliveryStatus === "Delivered" && (
                      <Received
                        onClick={() =>
                          deliverOrderHandler("Received", orderitem._id)
                        }
                      >
                        Comfirm you have recieved order
                      </Received>
                    )}
                  {userInfo && order && (
                    <SetStatus>
                      {enterwaybil ? (
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
                          {orderitem.trackingNumber && (
                            <label style={{ marginRight: "20px" }}>
                              Tracking Number: {orderitem.trackingNumber}
                            </label>
                          )}
                          <FormControl
                            disabled={
                              order.deliveryStatus === "Hold" ||
                              order.deliveryStatus === "Received" ||
                              order.deliveryStatus === "Return Logged"
                            }
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
                                if (
                                  e.target.value === "Dispatched" &&
                                  orderitem.deliverySelect[
                                    "delivery Option"
                                  ] !== "Pick up from Seller"
                                ) {
                                  setEnterwaybil(true);
                                } else {
                                  deliverOrderHandler(
                                    e.target.value,
                                    orderitem._id
                                  );
                                }
                              }}
                              displayEmpty
                              id="deliveryStatus"
                            >
                              <MenuItem
                                disabled={
                                  deliveryNumber(orderitem.deliveryStatus) > 0
                                }
                                value="Processing"
                              >
                                Processing
                              </MenuItem>
                              <MenuItem
                                disabled={
                                  deliveryNumber(orderitem.deliveryStatus) !== 1
                                }
                                value="Dispatched"
                              >
                                Dispatched
                              </MenuItem>
                              <MenuItem
                                disabled={
                                  deliveryNumber(orderitem.deliveryStatus) !== 2
                                }
                                value="In Transit"
                              >
                                In Transit
                              </MenuItem>
                              <MenuItem
                                disabled={
                                  deliveryNumber(orderitem.deliveryStatus) !== 3
                                }
                                value="Delivered"
                              >
                                Delivered
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </>
                      )}
                    </SetStatus>
                  )}
                </SubSumaryContDetails>
                <hr />
                <DetailButton>
                  <OrderItem>
                    <Image src={orderitem.image} alt={orderitem.name} />
                    <Details1>
                      <Name>{orderitem.name}</Name>
                      <Quantity>QTY: {orderitem.quantity}</Quantity>
                      <ItemPrice>
                        Unit Price: {orderitem.currency}
                        {orderitem.actualPrice}
                      </ItemPrice>
                      <ItemPrice>
                        Total: {orderitem.currency}
                        {orderitem.actualPrice * orderitem.quantity}
                      </ItemPrice>
                    </Details1>
                  </OrderItem>
                  <ActionButton>
                    <button className="btn btn-primary w-100">
                      <Link to={`/product/${orderitem.slug}`}>Buy Again</Link>
                    </button>
                    {userInfo.isAdmin &&
                      daydiff(13) <= 0 &&
                      deliveryNumber(orderitem.deliveryStatus) < 4 && (
                        <button
                          onClick={() => refund(orderitem)}
                          className="btn btn-primary w-100"
                          style={{
                            background: "var(--malon-color)",
                            marginTop: "10px",
                          }}
                        >
                          Refund
                        </button>
                      )}
                    {userInfo.isAdmin &&
                      daydiff(13) <= 0 &&
                      deliveryNumber(orderitem.deliveryStatus) === 4 && (
                        <button
                          onClick={() => {
                            paySeller(orderitem);
                            deliverOrderHandler(
                              "Payment To Seller Initiated",
                              orderitem._id
                            );
                          }}
                          className="btn btn-primary w-100"
                          style={{
                            background: "var(--malon-color)",
                            marginTop: "10px",
                          }}
                        >
                          Pay Seller
                        </button>
                      )}
                  </ActionButton>
                </DetailButton>
                {Object.entries(orderitem.deliverySelect).map(
                  ([key, value]) => (
                    <div
                      style={{
                        display: "flex",
                        textTransform: "capitalize",
                        fontSize: "13px",
                      }}
                    >
                      <DeliveryKey>{key}:</DeliveryKey>
                      <div>{value}</div>
                    </div>
                  )
                )}
                <div style={{ marginTop: "20px" }}>
                  <div>Buyer Information</div>
                  <UserCont>
                    <UserImg src={order.user.image} alt="img" />
                    <div>
                      <UserName className="link">
                        <Link to={`/seller/${order.user._id}`}>
                          @{order.user.username}
                        </Link>
                      </UserName>
                      <UserName>
                        {order.user.firstName} {order.user.lastName}
                      </UserName>
                    </div>
                  </UserCont>
                </div>
              </SumaryContDetails>
            )
          ) : (
            <SumaryContDetails mode={mode}>
              <Cont123>
                <div>
                  <div style={{ display: "flex", textAlign: "center" }}>
                    {displayDeliveryStatus(orderitem.deliveryStatus)}
                    <div
                      style={{
                        color: "var(--malon-color)",
                        cursor: "pointer",
                        textAlign: "center",
                        marginLeft: "15px",
                      }}
                      onClick={() => {
                        setShowDeliveryHistory(true);
                        setCurrentDeliveryHistory(
                          deliveryNumber(orderitem.deliveryStatus)
                        );
                      }}
                    >
                      Track Order
                    </div>
                  </div>
                  <Name>
                    On{" "}
                    {moment(orderitem.deliveredAt).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}
                  </Name>
                </div>
                {userInfo &&
                  order.user._id === userInfo._id &&
                  orderitem.deliveryStatus === "Delivered" && (
                    <div>
                      <AfterAction>
                        <Received
                          onClick={() => {
                            deliverOrderHandler(
                              "Received",
                              orderitem._id,
                              orderitem
                            );
                            paymentRequest(
                              orderitem.seller._id,
                              orderitem.actualPrice,
                              orderitem.currency,
                              orderitem.seller.image
                            );
                          }}
                        >
                          Comfirm you have recieved order
                        </Received>
                        <ReturnButton onClick={() => setShowReturn(true)}>
                          Log a return
                        </ReturnButton>
                      </AfterAction>
                      <div style={{ fontSize: "13px", maxWidth: "400px" }}>
                        Please inspect your order before confirming receipt.
                        Kindly know that you can't LOG A RETURN after order
                        receipt confirmation. However, you can re-list your
                        product for sale at this point
                      </div>
                    </div>
                  )}
                {orderitem.trackingNumber && (
                  <label style={{ marginRight: "20px" }}>
                    Tracking Number: {orderitem.trackingNumber}
                  </label>
                )}
              </Cont123>
              <hr />
              <DetailButton>
                <OrderItem>
                  <Image src={orderitem.image} alt={orderitem.name} />
                  <Details1>
                    <Name>{orderitem.name}</Name>
                    <Quantity>QTY: {orderitem.quantity}</Quantity>
                    <ItemPrice>
                      Unit Price: {orderitem.currency}
                      {orderitem.actualPrice}
                    </ItemPrice>
                    <ItemPrice>
                      Total: {orderitem.currency}
                      {orderitem.actualPrice * orderitem.quantity}
                    </ItemPrice>
                  </Details1>
                </OrderItem>
                <ActionButton>
                  <button className="btn btn-primary w-100">
                    <Link to={`/product/${orderitem.slug}`}>Buy Again</Link>
                  </button>
                </ActionButton>
              </DetailButton>
              {Object.entries(orderitem.deliverySelect).map(([key, value]) => (
                <div
                  style={{
                    display: "flex",
                    textTransform: "capitalize",
                    fontSize: "13px",
                  }}
                  key={key}
                >
                  <DeliveryKey>{key}:</DeliveryKey>
                  <DeliveryValue>{value}</DeliveryValue>
                </div>
              ))}
              <div style={{ marginTop: "20px" }}>
                <div>Seller Information</div>
                <UserCont>
                  <UserImg src={orderitem.seller.image} alt="img" />
                  <div>
                    <UserName className="link">
                      <Link to={`/seller/${orderitem.seller._id}`}>
                        @{orderitem.sellerName}
                      </Link>
                    </UserName>
                    <UserName>
                      {orderitem.seller.firstName} {orderitem.seller.lastNames}
                    </UserName>
                  </div>
                </UserCont>
              </div>
            </SumaryContDetails>
          )
        )}
        <ModelLogin
          showModel={showDeliveryHistory}
          setShowModel={setShowDeliveryHistory}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pading: "20px",
              height: "100%",
            }}
          >
            <DeliveryHistory status={currentDeliveryHistory} />
          </div>
        </ModelLogin>
        <PaymentDlivery>
          <PaymentDliveryItem>
            <Heading>Payment</Heading>
            <SumaryContDetails mode={mode}>
              <Name>Payment Method</Name>
              <ItemNum>{order.paymentMethod}</ItemNum>
              <hr />
              <PaymentRow>
                <div style={{ width: "100%" }}>
                  <Name>Payment Details</Name>
                  <div
                    style={{
                      display: "flex",
                      textTransform: "capitalize",
                    }}
                  >
                    <DeliveryKey>Item Total:</DeliveryKey>
                    <DeliveryValue>
                      {currency}
                      {isSeller ? itemsPrice : order.itemsPrice}
                    </DeliveryValue>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      textTransform: "capitalize",
                    }}
                  >
                    <DeliveryKey>Shipping Fee:</DeliveryKey>
                    <DeliveryValue>
                      {currency}
                      {isSeller ? shippingPrice : order.shippingPrice}
                    </DeliveryValue>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      textTransform: "capitalize",
                    }}
                  >
                    <DeliveryKey>Total:</DeliveryKey>
                    <DeliveryValue>
                      <ItemPrice>
                        {currency}
                        {isSeller
                          ? itemsPrice + shippingPrice
                          : order.totalPrice}
                      </ItemPrice>
                    </DeliveryValue>
                  </div>
                </div>
                {isSeller && (
                  <>
                    <hr />
                    <Commision>
                      <ItemNum>
                        <Key>Total cost:</Key>
                        <Value>
                          {" "}
                          {currency}
                          {itemsPrice + shippingPrice}
                        </Value>
                      </ItemNum>
                      <ItemNum>
                        <Key>Repeddle Commision (7.9%):</Key>
                        <Value>
                          {" "}
                          {currency}
                          {((7.9 / 100) * (itemsPrice + shippingPrice)).toFixed(
                            2
                          )}
                        </Value>
                      </ItemNum>
                      <ItemNum>
                        <Key>You will Receive:</Key>
                        <Value>
                          {" "}
                          {currency}
                          {(
                            itemsPrice +
                            shippingPrice -
                            (7.9 / 100) * (itemsPrice + shippingPrice)
                          ).toFixed(2)}
                        </Value>
                      </ItemNum>
                    </Commision>
                  </>
                )}
              </PaymentRow>
            </SumaryContDetails>
          </PaymentDliveryItem>
          {/* <PaymentDliveryItem>
            <Heading>Delivery</Heading>
            <SumaryContDetails mode={mode}>
              <Name>Deliver Address</Name>
              <ItemNum>
                {order.shippingAddress.address}, {order.shippingAddress.city},{" "}
                {order.shippingAddress.postalCode},
                {order.shippingAddress.country}
              </ItemNum>
            </SumaryContDetails>
          </PaymentDliveryItem> */}
        </PaymentDlivery>
      </Container>

      {/* <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {order.shippingAddress.fullName}
                <br /
                <strong>Address:</strong> {order.shippingAddress.address},{' '}
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                ,{order.shippingAddress.country}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  Delivered at {order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">
                  Not Delivered. <Track>Track</Track>
                </MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {order.paymentMethod}
              </Card.Text>

              {order.isPaid ? (
                <MessageBox varioant="success">
                  Paid at {order.paidAt}{' '}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Paid</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={6}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-flush rounded img-thumbnail"
                        ></img>
                        {''}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={3}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={3}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Total Items Cost</Col>
                    <Col>${order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Order Total</Col>
                    <Col>${order.totalPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                {!order.isPaid && (
                  <ListGroup.Item>
                    {isPending ? (
                      <LoadingBox />
                    ) : (
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                    {loadingPay && <LoadingBox></LoadingBox>}
                  </ListGroup.Item>
                )}
                {userInfo &&
                  userInfo.isAdmin &&
                  order.isPaid &&
                  !order.isDelivered && (
                    <ListGroup.Item>
                      {loadingDeliver && <LoadingBox></LoadingBox>}
                      <div className="d-grid">
                        <button
                          type="button"
                          className="search-btn1"
                          onClick={deliverOrderHandler}
                        >
                          Deliver Order
                        </button>
                      </div>
                    </ListGroup.Item>
                  )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row> */}
    </Main>
  );
}
