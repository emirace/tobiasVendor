import React, { useContext, useEffect, useReducer, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { Helmet } from "react-helmet-async";
import CheckoutSteps from "../component/CheckoutSteps";
import { Store } from "../Store";
import { Link, useNavigate } from "react-router-dom";
import { calcPrice, couponDiscount, getError, region } from "../utils";
import { toast } from "react-toastify";
import axios from "axios";
import LoadingBox from "../component/LoadingBox";
import styled from "styled-components";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import FlutterWave from "../component/FlutterWave";
import WalletModel from "../component/wallet/WalletModel";
import PayFund from "../component/wallet/PayFund";
import { socket } from "../App";

const Container = styled.div`
  display: flex;
  gap: 20px;
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;
const Main = styled.div`
  margin: 20px;
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
const Button = styled.div`
  cursor: pointer;
  color: var(--white-color);
  background: var(--malon-color);
  width: 100%;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.2rem;
  height: 40px;
`;

const RowData = styled.div`
  margin-left: 10px;
  display: flex;
`;
const ColTitle = styled.div`
  flex: 1;
`;
const ColValue = styled.div`
  flex: 5;
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
  const { cart, userInfo, mode, currency } = state;
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
  const [showModel, setShowModel] = useState(false);

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  calcPrice(cart);

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
        `/api/orders/${region()}`,
        {
          orderItems: cart.cartItems,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        { headers: { authorization: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: "CREATE_SUCCESS", payload: data });
      cart.cartItems.map(async (x) => {
        await axios.put(
          `/api/products/${x._id}/unsave`,
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
      });
      return data;
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: getError(err),
          showStatus: true,
          state1: "visible1 error",
        },
      });
    }
  };
  const saveOrderHandler = async () => {
    try {
      const data = await placeOrderHandler();
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Order saved",
          showStatus: true,
          state1: "visible1 success",
        },
      });
      localStorage.removeItem("cartItems");
      ctxDispatch({ type: "CART_CLEAR" });
      navigate(`/order/${data.order._id}`);
    } catch (err) {
      dispatch({ type: "CREATE_FAIL" });
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: getError(err),
          showStatus: true,
          state1: "visible1 error",
        },
      });
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

  const WalletSuccess = async (response) => {
    const order1 = await placeOrderHandler();
    if (order1) {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `/api/orders/${region()}/${order1.order._id}/pay`,
          response,
          { headers: { authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
        order1.order.seller.map(async (x) => {
          await axios.put(`api/bestsellers/${region()}/${order1.order.seller}`);
        });
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
        if (userInfo) {
          await axios.delete(`/api/cartItems/`, {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          });
        }
        order1.order.seller.map((s) => {
          socket.emit("post_data", {
            userId: s,
            itemId: order1.order._id,
            notifyType: "sold",
            msg: `${userInfo.username} ordered your product`,
            link: `/order/${order1.order._id}`,
            userImage: userInfo.image,
          });
        });
        navigate(`/order/${data.order._id}`);
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: getError(err) });
        console.log(err, getError(err));
        ctxDispatch({
          type: "SHOW_TOAST",
          payload: {
            message: `${getError(err)}`,
            showStatus: true,
            state1: "visible1 error",
          },
        });
      }
    } else {
      toast.error("no order found");
    }
  };
  const onApprove = async (response) => {
    const order1 = await placeOrderHandler();
    if (order1) {
      try {
        dispatch({ type: "PAY_REQUEST" });
        const { data } = await axios.put(
          `/api/orders/${region()}/${order1.order._id}/pay`,
          response,
          { headers: { authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: "PAY_SUCCESS", payload: data });
        order1.order.seller.map(async (x) => {
          await axios.put(`api/bestsellers/${region()}/${x}`);
        });
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
        if (userInfo) {
          await axios.delete(`/api/cartItems/`, {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          });
        }
        order1.order.seller.map((s) => {
          socket.emit("post_data", {
            userId: s,
            itemId: order1.order._id,
            notifyType: "sold",
            msg: `${userInfo.username} ordered your product`,
            link: `/order/${order1.order._id}`,
            userImage: userInfo.image,
          });
        });

        navigate(`/order/${data.order._id}`);
      } catch (err) {
        dispatch({ type: "PAY_FAIL", payload: getError(err) });
        console.log(err, getError(err));
        ctxDispatch({
          type: "SHOW_TOAST",
          payload: {
            message: `${getError(err)}`,
            showStatus: true,
            state1: "visible1 error",
          },
        });
      }
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
              <Card.Title>Items</Card.Title>
              <ListGroup variant="flush">
                {cart.cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <div
                        style={{
                          marginBottom: "10px",
                          display: "flex",
                          alignItems: "center",
                        }}
                        className="col-6"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{" "}
                        <div
                          style={{
                            marginLeft: "20px",
                          }}
                        >
                          <div>
                            <Link to={`/product/${item.slug}`}>
                              {item.name}
                            </Link>
                          </div>
                          <div>
                            {item.currency}
                            {item.actualPrice}
                          </div>
                          <div>Size: {item.selectSize}</div>
                        </div>
                      </div>
                      <div className="col-3">
                        <span>{item.quantity}</span>
                      </div>
                      <div className="col-3">
                        {currency}
                        {item.price}
                      </div>
                    </Row>
                    {Object.entries(item.deliverySelect).map(([key, value]) => (
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
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Link className="simple_link" to="/cart">
                Edit
              </Link>
            </Card.Body>
          </Section>
          {/* <Section mode={mode}>
            <Card.Body>
              <Card.Title>Delivery Address</Card.Title>
               <Card.Text>
                <RowData>
                  <ColTitle>Address Name:</ColTitle>
                  <ColValue>
                    {cart.shippingAddress.fullName || cart.useraddress.fullName}
                  </ColValue>
                </RowData>
                <RowData>
                  <ColTitle>Address:</ColTitle>
                  <ColValue>
                    {cart.shippingAddress.apartment}{" "}
                    {cart.shippingAddress.address}, {cart.shippingAddress.city},{" "}
                    {cart.shippingAddress.state},{" "}
                    {cart.shippingAddress.postalCode},{" "}
                    {cart.shippingAddress.country}
                  </ColValue>
                </RowData>
              </Card.Text> 
              <Link className="simple_link" to="/shipping">
                Edit
              </Link>
            </Card.Body>
          </Section> */}
          <Section mode={mode}>
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <RowData>
                  <ColTitle>Method</ColTitle>
                  <ColValue>{cart.paymentMethod}</ColValue>
                </RowData>
              </Card.Text>
              <Link className="simple_link" to="/payment">
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
                              <Right>
                                {currency}
                                {c.actualPrice}
                              </Right>
                            </Left>
                            <Right>
                              {` =  ${currency}` + c.quantity * c.actualPrice}
                            </Right>
                          </SumCont>
                        </>
                      ))}
                    </div>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Subtotal</Col>
                    <Col>
                      {currency}
                      {cart.itemsPrice.toFixed(2)}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>
                      {currency}
                      {cart.shippingPrice.toFixed(2)}
                    </Col>
                  </Row>
                </ListGroup.Item>

                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>
                      {currency}
                      {cart.taxPrice.toFixed(2)}
                    </Col>
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
                    <Col>
                      - {currency}
                      {discount}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <b>Order Total</b>
                    </Col>
                    <Col>
                      <b>
                        {currency}
                        {(cart.totalPrice - discount).toFixed(2)}
                      </b>
                    </Col>
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
                  {/* {isPending ? (
                    <LoadingBox />
                  ) : (
                    <div>
                      <PayPalButtons
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                      ></PayPalButtons>
                    </div>
                  )} */}

                  {loadingPay ? (
                    <LoadingBox />
                  ) : cart.paymentMethod === "Wallet" ? (
                    <Button
                      style={{ background: "var(--orange-color)" }}
                      onClick={() => setShowModel(true)}
                    >
                      Proceed to Payment
                    </Button>
                  ) : cart.paymentMethod === "Credit/Debit card" ? (
                    <FlutterWave
                      amount={cart.totalPrice}
                      currency={currency === "N " ? "NGN" : "ZAR"}
                      user={
                        userInfo
                          ? userInfo
                          : {
                              email: cart.shippingAddress.email,
                              name: cart.shippingAddress.fullName,
                              phone: cart.shippingAddress.phone,
                            }
                      }
                      onApprove={onApprove}
                    />
                  ) : (
                    ""
                  )}
                </ListGroup.Item>

                <WalletModel showModel={showModel} setShowModel={setShowModel}>
                  <PayFund
                    onApprove={WalletSuccess}
                    setShowModel={setShowModel}
                    amount={cart.totalPrice}
                  />
                </WalletModel>
                <ListGroup.Item>
                  <div className="d-grid">
                    <Button
                      type="button"
                      onClick={saveOrderHandler}
                      disabled={cart.cartItems.length === 0}
                    >
                      Save for later
                    </Button>
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
