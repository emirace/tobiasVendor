import Button from 'react-bootstrap/Button';
import React, { useContext } from 'react';
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

export default function CartScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = async (item, quantity) => {
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
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
    navigate('../shipping');
  };

  return (
    <div className="m-4 ">
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <h1>Shopping Cart</h1>
      <Row>
        <Col md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Cart is empty. <Link to="/">Go Shopping</Link>
            </MessageBox>
          ) : (
            <ListGroup>
              {cartItems.map((item) => (
                <ListGroup.Item key={item._id}>
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
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
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
                </ListGroup.Item>
                <ListGroup.Item>
                  <h4>
                    Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)}{' '}
                    items) : $
                    {cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
                  </h4>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid">
                    <button
                      type="button"
                      className="search-btn1"
                      onClick={checkoutHandler}
                      variant="primary"
                      disabled={cartItems.lenth === 0}
                    >
                      Proceed to Checkout
                    </button>
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
