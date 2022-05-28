import React, { useContext, useEffect, useReducer } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { Helmet } from 'react-helmet-async';
import CheckoutSteps from '../component/CheckoutSteps';
import { Store } from '../Store';
import { Link, useNavigate } from 'react-router-dom';
import { getError } from '../utils';
import { toast } from 'react-toastify';
import axios from 'axios';
import LoadingBox from '../component/LoadingBox';
import styled from 'styled-components';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

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

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false, order: action.payload };
    case 'CREATE_FAIL':
      return { ...state, loading: false };
    case 'PAY_REQUEST':
      return { ...state, loadingPay: true };
    case 'PAY_SUCCESS':
      return { ...state, loadingPay: false, successPay: true };
    case 'PAY_FAIL':
      return { ...state, loadingPay: false };
    case 'PAY_RESET':
      return { ...state, loadingPay: false, successPay: false };

    default:
      return state;
  }
};

export default function PlaceOrderScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const navigate = useNavigate();
  const [{ loading, loadingPay, order, successPay }, dispatch] = useReducer(
    reducer,
    {
      loading: false,
      loadingPay: false,
      order: null,
    }
  );

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
        '/api/keys/paypal',
        userInfo
          ? { headers: { authorization: `Bearer ${userInfo.token}` } }
          : {}
      );
      paypalDispatch({
        type: 'resetOptions',
        value: {
          'client-id': clientId,
          currency: 'USD',
        },
      });
      paypalDispatch({ type: 'useLoadingStatus', value: 'pending' });
    };
    loadPaypalScript();
  }, [userInfo, paypalDispatch]);

  const placeOrderHandler = async () => {
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        },
        userInfo
          ? { headers: { authorization: `Bearer ${userInfo.token}` } }
          : {}
      );
      console.log('');
      dispatch({ type: 'CREATE_SUCCESS', payload: data });
      return data;
    } catch (err) {
      dispatch({ type: 'CREATE_FAIL' });
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
    console.log(order1);
    if (order1) {
      return actions.order.capture().then(async function (details) {
        try {
          dispatch({ type: 'PAY_REQUEST' });
          const { data } = await axios.put(
            `/api/orders/${order1.order._id}/pay`,
            details,
            userInfo
              ? { headers: { authorization: `Bearer ${userInfo.token}` } }
              : {}
          );
          dispatch({ type: 'PAY_SUCCESS', payload: data });
          toast.success('Order is paid');
          localStorage.removeItem('cartItems');
          ctxDispatch({ type: 'CART_CLEAR' });
          navigate(`/order/${data.order._id}`);
        } catch (err) {
          dispatch({ type: 'PAY_FAIL', payload: getError(err) });
          toast.error(getError(err));
        }
      });
    } else {
      toast.error('no order found');
    }
  };

  function onError(err) {
    toast.error(getError(err));
  }

  return (
    <div className="container">
      <Helmet>
        <title>Preview Order</title>
      </Helmet>
      <h1 className="my-3">Preview Order</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Shipping</Card.Title>
              <Card.Text>
                <strong>Name: </strong>
                {cart.shippingAddress.firstname +
                  ' ' +
                  cart.shippingAddress.lastname}
                <br />
                <strong>Address: </strong>
                {cart.shippingAddress.address},{cart.shippingAddress.city},{' '}
                {cart.shippingAddress.pstalCode}, {cart.shippingAddress.country}
              </Card.Text>
              <Link className="simple_link" to="/shipping">
                Edit
              </Link>
            </Card.Body>
          </Card>
          <Card className="mb-3">
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
          </Card>
          <Card className="mb-3">
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
                        ></img>{' '}
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
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>Oeder Summary</Card.Title>
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
                            <Right>{' =  $' + c.quantity * c.price}</Right>
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
                    <Col>Order Total</Col>
                    <Col>${cart.totalPrice.toFixed(2)}</Col>
                  </Row>
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
                      onClick={placeOrderHandler}
                      disabled={cart.cartItems.length === 0}
                    >
                      Place Order
                    </button>
                    {loading && <LoadingBox></LoadingBox>}
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
