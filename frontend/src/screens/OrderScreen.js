import axios from "axios";
import React, { useContext, useEffect, useReducer } from "react";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import LoadingBox from "../component/LoadingBox";
import MessageBox from "../component/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils";
import ListGroup from "react-bootstrap/ListGroup";
import { toast } from "react-toastify";
import styled from "styled-components";

const Container = styled.div`
    width: 100%;
    margin-bottom: 30px;
    border: 1px solid var(--border-color);
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
    border: 1px solid var(--border-color);
    border-radius:5px;
    border-bottom: 0;
    @media (max-width: 992px) {
        padding: 10px 10px;
        margin-top;15px;
    }
`;
const SumaryContDetails = styled.div`
    border: 1px solid var(--border-color);
    border-radius: 5px;
    padding: 15px 30px;
    margin-bottom: 15px;
    @media (max-width: 992px) {
        padding: 10px 15px;
    }
`;
const SumaryCont = styled.div`
    padding: 15px 0;
    border-bottom: 1px solid var(--border-color);
`;
const OrderId = styled.div`
    font-weight: bold;
`;
const Heading = styled.div`
    padding: 15px 0;
    font-weight: bold;
    text-transform: uppercase;
`;
const ItemNum = styled.div``;
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
    margin-bottom: 10px;
`;
const Image = styled.img`
    object-fit: cover;
    object-position: top;
    width: 100px;
    height: 130px;
`;
const Details1 = styled.div`
    padding: 20px;
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
    font-weighit: bold;
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
    const { state } = useContext(Store);
    const { userInfo } = state;
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

    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

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

    async function deliverOrderHandler() {
        try {
            dispatch({ type: "DELIVER_REQUEST" });
            await axios.put(
                `/api/orders/${order._id}/deliver`,
                {},
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                }
            );
            dispatch({ type: "DELIVER_SUCCESS" });
            toast.success("Order delivered");
        } catch (err) {
            toast.error(getError(err));
            dispatch({ type: "DELIVER_FAIL" });
        }
    }

    return loading ? (
        <LoadingBox></LoadingBox>
    ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
    ) : (
        <div className="container">
            <Helmet>
                <title>Order {orderId}</title>
            </Helmet>
            <Header>Order Detail</Header>
            <Container>
                <SumaryCont>
                    <OrderId>Order number {orderId}</OrderId>
                    <ItemNum>
                        {order.orderItems.length} Item
                        {order.orderItems.length > 1 ? "s" : ""}
                    </ItemNum>
                    <Date>Placed on {order.createdAt.substring(0, 10)}</Date>
                    <Price>Total: ${order.totalPrice}</Price>
                </SumaryCont>

                <Heading>Items in your order</Heading>

                {order.orderItems.map((order) => (
                    <SumaryContDetails>
                        <Name>On</Name>
                        <hr />
                        <OrderItem>
                            <Image src={order.image} alt={order.name} />
                            <Details1>
                                <Name>{order.name}</Name>
                                <Quantity>QTY: {order.quantity}</Quantity>
                                <ItemPrice>$ {order.price}</ItemPrice>
                            </Details1>
                        </OrderItem>
                        <button className="btn btn-primary w-100">
                            <Link to={`/product/${order.slug}`}>Buy Again</Link>
                        </button>
                        <button className="btn btn-outline-primary w-100 mt-2">
                            See Delivery history
                        </button>
                    </SumaryContDetails>
                ))}

                <Heading>Payment</Heading>
                <SumaryContDetails>
                    <Name>Pay Method</Name>
                    <ItemNum>paypal</ItemNum>
                    <hr />
                    <Name>Pay Details</Name>
                    <ItemNum>
                        Item Total:
                        <ItemPrice>${order.totalPrice}</ItemPrice>
                    </ItemNum>
                    <ItemNum>Shipping Fee: ${0}</ItemNum>
                    <ItemNum>Total: ${order.totalPrice}</ItemNum>
                </SumaryContDetails>
                <Heading>Delivery</Heading>
                <SumaryContDetails>
                    <Name>Deliver Option</Name>
                    <ItemNum>Home delivery</ItemNum>
                    <hr />
                    <Name>Deliver Address</Name>
                    <ItemNum>{"address goes here"}</ItemNum>
                </SumaryContDetails>
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
        </div>
    );
}
