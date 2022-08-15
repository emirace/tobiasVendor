import React, { useContext, useEffect, useReducer, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
import { Helmet } from "react-helmet-async";
import CheckoutSteps from "../component/CheckoutSteps";
import { Store } from "../Store";
import { Link, useNavigate } from "react-router-dom";
import { couponDiscount, getError } from "../utils";
import { toast } from "react-toastify";
import axios from "axios";
import LoadingBox from "../component/LoadingBox";
import styled from "styled-components";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  display: flex;
  gap: 20px;
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;
const Main = styled.div`
  padding: 20px 5vw 0 5vw;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
`;
const LeftC = styled.div`
  flex: 8;
`;
const RightC = styled.div`
  flex: 4;
`;

const SumCont = styled.div`
  display: flex;
`;
const Left = styled.div`
  display: flex;
  flex: 3;
`;
const Right = styled.div`
  flex: 1;
`;
const Section = styled.div`
  margin: 20px 0;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev2)"};
`;

const CouponCont = styled.div`
  border: 1px solid var(--malon-color);
  height: 40px;
  display: flex;
  border-radius: 0.2rem;
`;
const Input = styled.input`
  flex: 4;
  border-top-left-radius: 0.2rem;
  border-bottom-left-radius: 0.2rem;
  border: 0;
  padding: 5px;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-1)" : "var(--light-ev1)"};
  &:focus-visible {
    outline: none;
  }
`;
const Apply = styled.button`
  flex: 1;
  color: var(--malon-color);
  background: none;
  border: 1px solid var(--malon-color);
  border-top-right-radius: 0.2rem;
  border-bottom-right-radius: 0.2rem;
`;

const Remove = styled.span`
  & svg {
    color: var(--red-color);
    margin-left: 10px;
  }
`;

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false, order: action.payload };
    case "CREATE_FAIL":
      return { ...state, loading: false };
    case "PAY_REQUEST":
      return { ...state, loadingPay: true };
    case "PAY_SUCCESS":
      return { ...state, loadingPay: false, successPay: true };
    case "PAY_FAIL":
      return { ...state, loadingPay: false };
    case "PAY_RESET":
      return { ...state, loadingPay: false, successPay: false };

    default:
      return state;
  }
};

export default function PlaceOrderScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo, mode } = state;
  const navigate = useNavigate();
  const [{ loading, loadingPay, order, successPay }, dispatch] = useReducer(
    reducer,
    {
      loading: false,
      loadingPay: false,
      order: null,
    }
  );

  const [code, setCode] = useState("");
  const [coupon, setCoupon] = useState(null);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
  cart.itemsPrice = round2(
    cart.cartItems.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  cart.shippingPrice = cart.itemsPrice > 100 ? round2(0) : round2(10);
  cart.taxPrice = round2(0.15 * cart.itemsPrice);
  cart.totalPrice = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;

  useEffect(() => {
    const loadPaypalScript = async () => {
      const { data: clientId } = await axios.get(
        "/api/keys/paypal",
        userInfo
          ? { headers: { authorization: `Bearer ${userInfo.token}` } }
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
  }, [userInfo, paypalDispatch]);

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: "CREATE_REQUEST" });
      const { data } = await axios.post(
        "/api/orders",
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
          deliveryMethod: cart.deliveryMethod,
        },
        userInfo
          ? { headers: { authorization: `Bearer ${userInfo.token}` } }
          : {}
      );
      console.log("");
      dispatch({ type: "CREATE_SUCCESS", payload: data });
      return data;
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      toast.error(getError(err));
    }
  };
  const saveOrderHandler = async () => {
    try {
      dispatch({ type: "CREATE_REQUEST" });
      const { data } = await axios.post(
        "/api/orders",
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
          deliveryMethod: cart.deliveryMethod,
        },
        userInfo
          ? { headers: { authorization: `Bearer ${userInfo.token}` } }
          : {}
      );
      console.log("");
      dispatch({ type: "CREATE_SUCCESS", payload: data });
      toast.success("Order is saved");
      localStorage.removeItem("cartItems");
      ctxDispatch({ type: "CART_CLEAR" });
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      toast.error(getError(err));
    }
  };

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: { value: cart.totalPrice },
          },
        ],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  const onApprove = async (data, actions) => {
    const order1 = await placeOrderHandler();
    if (order1) {
      return actions.order.capture().then(async function (details) {
        try {
          dispatch({ type: "PAY_REQUEST" });
          const { data } = await axios.put(
            `/api/orders/${order1.order._id}/pay`,
            details,
            userInfo
              ? { headers: { authorization: `Bearer ${userInfo.token}` } }
              : {}
          );
          dispatch({ type: "PAY_SUCCESS", payload: data });
          await axios.put(`api/bestsellers/${order1.order.seller}`);
          toast.success("Order is paid");
          ctxDispatch({
            type: "SHOW_TOAST",
            payload: {
              message: "Order is paid",
              showStatus: true,
              state1: "visible1 success",
            },
          });
          localStorage.removeItem("cartItems");
          ctxDispatch({ type: "CART_CLEAR" });
          navigate(`/order/${data.order._id}`);
        } catch (err) {
          dispatch({ type: "PAY_FAIL", payload: getError(err) });
          ctxDispatch({
            type: "SHOW_TOAST",
            payload: {
              message: "Error processing order, try again later",
              showStatus: true,
              state1: "visible1 error",
            },
          });
        }
      });
    } else {
      toast.error("no order found");
    }
  };

  function onError(err) {
    toast.error(getError(err));
  }
  const handleCoupon = async () => {
    try {
      const { data } = await axios.get(`/api/coupons/${code}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      console.log(data);
      setCoupon(data[0]);
    } catch (err) {
      console.log(getError(err));
    }
  };
  const removeCoupon = () => {
    setCoupon(null);
  };
  const discount = coupon ? couponDiscount(coupon, cart.totalPrice) : 0;

  return (
    <Main mode={mode}>
      <Helmet>
        <title>Order Preview</title>
      </Helmet>
      <h1 className="my-3">Order Preview</h1>
      <Container>
        <LeftC>
          <Section mode={mode}>
            <Card.Body>
              <Card.Title>Delivery Address</Card.Title>
              <Card.Text>
                <strong>Address Name: </strong>
                {cart.shippingAddress.fullName || cart.useraddress.fullName}
                <br />
                <strong>Address: </strong>
                {cart.shippingAddress.apartment}, {cart.shippingAddress.address}
                , {cart.shippingAddress.city}, {cart.shippingAddress.state},{" "}
                {cart.shippingAddress.postalCode},{" "}
                {cart.shippingAddress.country}
                <strong>Delivery Method: </strong>
                {cart.deliveryMethod.trg}
                <br />
                <strong>Pick up point: </strong>
                {cart.deliveryMethod.point.shortName}
              </Card.Text>
              <Link className="simple_link" to="/shipping">
                Edit
              </Link>
            </Card.Body>
          </Section>
          <Section mode={mode}>
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method: </strong>
                {cart.paymentMethod}
              </Card.Text>
              <Link className="simple_link" to="/payment">
                Edit
              </Link>
            </Card.Body>
          </Section>
          <Section mode={mode}>
            <Card.Body>
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <div className="col-6">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{" "}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </div>
                      <div className="col-3">
                        <span>{item.quantity}</span>
                      </div>
                      <div className="col-3">${item.price}</div>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link className="simple_link" to="/cart">
                Edit
              </Link>
            </Card.Body>
          </Section>
        </LeftC>
        <RightC>
          <Section mode={mode}>
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <div className="col-3">Items</div>
                    <div className="col-9">
                      {cart.cartItems.map((c) => (
                        <>
                          <SumCont>
                            <Left>
                              <Right>{c.quantity} </Right>
                              <Right>x </Right>
                              <Right>${c.price}</Right>
                            </Left>
                            <Right>{" =  $" + c.quantity * c.price}</Right>
                          </SumCont>
                        </>
                      ))}
                      <SumCont>
                        <Left>Total</Left>
                        <Right>${cart.itemsPrice.toFixed(2)}</Right>
                      </SumCont>
                    </div>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${cart.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${cart.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      Discount ({coupon ? coupon.code : ""})
                      {coupon && (
                        <Remove onClick={removeCoupon}>
                          <FontAwesomeIcon icon={faTimes} />
                        </Remove>
                      )}
                    </Col>
                    <Col>- ${discount}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Order Total</Col>
                    <Col>${(cart.totalPrice - discount).toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <CouponCont>
                    <Input
                      mode={mode}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Enter Coupon Code"
                    />
                    <Apply onClick={handleCoupon}>Apply</Apply>
                  </CouponCont>
                </ListGroup.Item>
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

                <ListGroup.Item>
                  <div className="d-grid">
                    <button
                      className="search-btn1"
                      type="button"
                      onClick={saveOrderHandler}
                      disabled={cart.cartItems.length === 0}
                    >
                      Save Order
                    </button>
                    {loading && <LoadingBox></LoadingBox>}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Section>
        </RightC>
      </Container>
    </Main>
  );
}
