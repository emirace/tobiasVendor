import Button from 'react-bootstrap/Button';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import MessageBox from '../component/MessageBox';
import axios from 'axios';
import '../style/Cart.css';
import { Store } from '../Store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { getError } from '../utils';

const CartCont = styled.div`
  display: flex;
  margin: 20px;
  gap: 20px;
`;
const LeftCorner = styled.div`
  flex: 3;
  & h1 {
    font-size: 28px;
    margin-bottom: 10px;
  }
`;
const RightCorner = styled.div`
  flex: 1;
  border-radius: 0.2rem;
  padding: 20px;
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev1)' : 'var(--light-ev1)'};
`;

const Top = styled.div`
  padding: 20px;
  border-radius: 0.2rem;
  margin: 0 0 20px 0;
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev1)' : 'var(--light-ev1)'};
`;
const Bottom = styled.div`
  padding: 20px;
  margin: 0 0 20px 0;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev1)' : 'var(--light-ev1)'};
`;

const SumCont = styled.div`
  display: flex;
  margin-bottom: 20px;
`;
const Left = styled.div`
  display: flex;
  flex: 3;
`;
const Right = styled.div`
  flex: 1;
`;
const Item = styled.div`
  margin: 20px 10px;
`;

const Summary = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_USER_REQUEST':
      return { ...state, loadingUser: true };
    case 'FETCH_USER_SUCCESS':
      return {
        ...state,
        loadingUser: false,
        user: action.payload,
        error: '',
      };
    case 'FETCH_PRODUCT_REQUEST':
      return { ...state, loadingUser: true };
    default:
      return state;
  }
};

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
    userInfo,
    mode,
  } = state;
  const [{ loadingUser, error, user }, dispatch] = useReducer(reducer, {
    loadingUser: true,
    error: '',
    user: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_USER_REQUEST' });
        const { data: dataUser } = await axios.get(
          `/api/users/seller/${userInfo._id}`
        );
        console.log('userdata', dataUser);
        dispatch({ type: 'FETCH_USER_SUCCESS', payload: dataUser });
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [userInfo]);
  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      ctxDispatch({
        type: 'SHOW_TOAST',
        payload: {
          message: 'Sorry. Product is out of stock',
          showStatus: true,
          state1: 'visible1 error',
        },
      });
      return;
    }
    console.log('item', item);
    console.log('quan', quantity);
    //
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  const removeItemHandler = (item) => {
    ctxDispatch({ type: 'CART_REMOVE_ITEM', payload: item });
  };
  const checkoutHandler = () => {
    if (cartItems.length === 0) {
      toast.error('cart is empty');
    } else {
      if (userInfo) {
        navigate('../shipping');
      } else {
        navigate('../signin');
      }
    }
  };

  return (
    <div className="m-4 ">
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>

      <CartCont>
        <LeftCorner>
          <Top mode={mode}>
            <h1>Shopping Cart</h1>
            {cartItems.length === 0 ? (
              <MessageBox>
                Cart is empty. <Link to="/">Go Shopping</Link>
              </MessageBox>
            ) : (
              <>
                {cartItems.map((item) => (
                  <Item key={item._id}>
                    <Row className="align-items-center justify-content-between">
                      <div className="col-5 d-flex  align-items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>{' '}
                        <div className="cart_item_detail">
                          <Link to={`/product/${item.slug}`}>{item.name}</Link>

                          <div> ${item.price}</div>
                        </div>
                      </div>
                      <div className="col-3 d-flex align-items-center">
                        <Button
                          variant="none"
                          onClick={() =>
                            updateCartHandler(item, item.quantity - 1)
                          }
                          disabled={item.quantity === 1}
                        >
                          <FontAwesomeIcon icon={faMinus} />
                        </Button>{' '}
                        <span>{item.quantity}</span>{' '}
                        <Button
                          variant="none"
                          onClick={() =>
                            updateCartHandler(item, item.quantity + 1)
                          }
                          disabled={item.quantity === item.countInStock}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </Button>
                      </div>
                      <div className="col-2">
                        <Button
                          onClick={() => removeItemHandler(item)}
                          variant="none"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </Button>
                      </div>
                    </Row>
                  </Item>
                ))}
              </>
            )}
          </Top>
          {userInfo && (
            <Bottom mode={mode}>
              <h1>Save Item</h1>
              {cartItems.length === 0 ? (
                <MessageBox>
                  Cart is empty. <Link to="/">Go Shopping</Link>
                </MessageBox>
              ) : (
                <>
                  {user.saved &&
                    user.saved.map((product, index) => (
                      <Item key={index}>
                        <Row className="align-items-center justify-content-between">
                          <div className="col-5 d-flex  align-items-center">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="img-fluid rounded img-thumbnail"
                            ></img>{' '}
                            <div className="cart_item_detail">
                              <Link to={`/product/${product.slug}`}>
                                {product.name}
                              </Link>

                              <div> ${product.price}</div>
                            </div>
                          </div>
                          <div className="col-2">
                            <Button
                              onClick={() =>
                                updateCartHandler(product, product.quantity + 1)
                              }
                              variant="none"
                            >
                              Add to Cart
                            </Button>
                          </div>
                        </Row>
                      </Item>
                    ))}
                </>
              )}
            </Bottom>
          )}
        </LeftCorner>
        <RightCorner mode={mode}>
          <Summary>
            {cartItems.map((c) => (
              <SumCont>
                <Left>
                  <Right>{c.quantity} </Right>
                  <Right>x </Right>
                  <Right>${c.price}</Right>
                </Left>
                <Right>{' =  $' + c.quantity * c.price}</Right>
              </SumCont>
            ))}
            <div>
              <h4>
                Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} items)
                : ${cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
              </h4>
            </div>
            <div>
              <div className="d-grid">
                <button
                  type="button"
                  className="search-btn1"
                  onClick={checkoutHandler}
                  variant="primary"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </Summary>
        </RightCorner>
      </CartCont>
    </div>
  );
}
