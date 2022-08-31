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
import { displayDeliveryStatus, getError, timeDifference } from "../utils";
import ListGroup from "react-bootstrap/ListGroup";
import { toast } from "react-toastify";
import styled from "styled-components";
import moment from "moment";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { useReactToPrint } from "react-to-print";
import ModelLogin from "../component/ModelLogin";
import Return from "../component/Return";

const Main = styled.div`
  padding: 20px 5vw 0 5vw;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
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
  width: 100%;
  padding: 15px 30px;
  @media (max-width: 992px) {
    padding: 10px 10px;
    margin-top: 15px;
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
  &:hover {
    background: var(--malon-color);
  }
`;
const Print = styled.div`
  font-weight: 500;
  color: white;
  padding: 1px 8px;
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
  const { userInfo, mode } = state;
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

  async function deliverOrderHandler(deliveryStatus) {
    try {
      dispatch({ type: "DELIVER_REQUEST" });
      await axios.put(
        `/api/orders/${order._id}/deliver`,
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
      toast.error(getError(err));
      dispatch({ type: "DELIVER_FAIL" });
    }
  }

  const daydiff =
    order.createdAt &&
    3 - timeDifference(new window.Date(order.createdAt), new window.Date());

  var itemsPrice = 0;
  var shippingPrice = 0;
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
      <div style={{ display: "flex" }}>
        <Header>Order Details</Header>
        <Print onClick={handlePrint}>Print</Print>
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
          <Price>Total: ${order.totalPrice}</Price>
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
          {!isSeller && (
            <div
              style={{ cursor: "pointer" }}
              onClick={() => setShowReturn(true)}
            >
              <b>Log a return</b>
              <div style={{ color: "red" }}>{daydiff} days left</div>
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
        {console.log(isSeller)}
        {order.orderItems.map((orderitem) =>
          isSeller ? (
            orderitem.seller._id === userInfo._id && (
              <SumaryContDetails mode={mode}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  {(itemsPrice = itemsPrice + orderitem.actualPrice)}
                  {
                    (shippingPrice =
                      shippingPrice + Number(orderitem.deliverySelect.cost))
                  }
                  {console.log(itemsPrice, "price", shippingPrice)}
                  <div>
                    {displayDeliveryStatus(order.deliveryStatus)}
                    <Name>
                      On{" "}
                      {moment(order.deliveredAt).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}
                    </Name>
                  </div>
                  {userInfo &&
                    order.user === userInfo._id &&
                    order.deliveryStatus === "Delivered" && (
                      <Received onClick={() => deliverOrderHandler("Recieved")}>
                        Comfirm you have recieved order
                      </Received>
                    )}
                  {userInfo && order.seller === userInfo._id && (
                    <SetStatus>
                      <FormControl
                        disabled={
                          order.deliveryStatus === "Hold" ||
                          order.deliveryStatus === "Received"
                        }
                        sx={{
                          minWidth: "200px",
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
                          Set delivery Status
                        </InputLabel>

                        <Select
                          onChange={(e) => deliverOrderHandler(e.target.value)}
                          displayEmpty
                          id="deliveryStatus"
                        >
                          <MenuItem value="Not yet Dispatched">
                            Not yet Dispatched
                          </MenuItem>
                          <MenuItem value="Dispatch">Dispatch</MenuItem>
                          <MenuItem value="In transit">In transit</MenuItem>
                          <MenuItem value="Delivered">Delivered</MenuItem>
                        </Select>
                      </FormControl>
                    </SetStatus>
                  )}
                </div>
                <hr />
                <DetailButton>
                  <OrderItem>
                    <Image src={orderitem.image} alt={orderitem.name} />
                    <Details1>
                      <Name>{orderitem.name}</Name>
                      <Quantity>QTY: {orderitem.quantity}</Quantity>
                      <ItemPrice>$ {orderitem.actualPrice}</ItemPrice>
                    </Details1>
                  </OrderItem>
                  <ActionButton>
                    <button className="btn btn-primary w-100">
                      <Link to={`/product/${orderitem.slug}`}>Buy Again</Link>
                    </button>
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
                      <div style={{ flex: "1" }}>{key}:</div>
                      <div style={{ flex: "5" }}>{value}</div>
                    </div>
                  )
                )}
              </SumaryContDetails>
            )
          ) : (
            <SumaryContDetails mode={mode}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <div>
                  {displayDeliveryStatus(order.deliveryStatus)}
                  <Name>
                    On{" "}
                    {moment(order.deliveredAt).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )}
                  </Name>
                </div>
                {userInfo &&
                  order.user === userInfo._id &&
                  order.deliveryStatus === "Delivered" && (
                    <Received onClick={() => deliverOrderHandler("Recieved")}>
                      Comfirm you have recieved order
                    </Received>
                  )}
                {userInfo && order.seller === userInfo._id && (
                  <SetStatus>
                    <FormControl
                      disabled={
                        order.deliveryStatus === "Hold" ||
                        order.deliveryStatus === "Received"
                      }
                      sx={{
                        minWidth: "200px",
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
                        Set delivery Status
                      </InputLabel>

                      <Select
                        onChange={(e) => deliverOrderHandler(e.target.value)}
                        displayEmpty
                        id="deliveryStatus"
                      >
                        <MenuItem value="Not yet Dispatched">
                          Not yet Dispatched
                        </MenuItem>
                        <MenuItem value="Dispatch">Dispatch</MenuItem>
                        <MenuItem value="In transit">In transit</MenuItem>
                        <MenuItem value="Delivered">Delivered</MenuItem>
                      </Select>
                    </FormControl>
                  </SetStatus>
                )}
              </div>
              <hr />
              <DetailButton>
                <OrderItem>
                  <Image src={orderitem.image} alt={orderitem.name} />
                  <Details1>
                    <Name>{orderitem.name}</Name>
                    <Quantity>QTY: {orderitem.quantity}</Quantity>
                    <Quantity>Size: {orderitem.selectSize}</Quantity>
                    <ItemPrice>$ {orderitem.actualPrice}</ItemPrice>
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
                >
                  <div style={{ flex: "1" }}>{key}:</div>
                  <div style={{ flex: "5" }}>{value}</div>
                </div>
              ))}
            </SumaryContDetails>
          )
        )}
        <PaymentDlivery>
          <PaymentDliveryItem>
            <Heading>Payment</Heading>
            <SumaryContDetails mode={mode}>
              <Name>Payment Method</Name>
              <ItemNum>{order.paymentMethod}</ItemNum>
              <hr />
              <Name>Payment Details</Name>
              <ItemNum>
                Item Total:{"   "} ${isSeller ? itemsPrice : order.itemsPrice}
              </ItemNum>
              <ItemNum>
                Shipping Fee: ${isSeller ? shippingPrice : order.shippingPrice}
              </ItemNum>
              <ItemNum>
                Total:{" "}
                <ItemPrice>
                  ${isSeller ? itemsPrice + shippingPrice : order.totalPrice}
                </ItemPrice>
              </ItemNum>
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
