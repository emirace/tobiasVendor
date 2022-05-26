import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import LoadingBox from '../component/LoadingBox';
import MessageBox from '../component/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const ContainerBig = styled.div`
  width: 100%;
  margin: 0 10px;
  @media (max-width: 992px) {
    margin: 0 5px;
  }
`;

const Container = styled.div`
  width: 100%;
  margin: 0 20px;

  @media (max-width: 992px) {
    margin: 0;
  }
`;

const Tab = styled.div`
  display: flex;
  margin-bottom: 5px;
  border: 1px solid rgba(99, 91, 91, 0.2);
`;
const TabItem = styled.div`
  cursor: pointer;
  margin: 10px;
  position: relative;
  text-transform: uppercase;
  &:hover {
    color: var(--orange-color);
  }
  &.active {
    color: var(--orange-color);
    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 100%;
      height: 2px;
      background: var(--orange-color);
    }
  }
`;
const Content = styled.div`
  display: flex;
  height: 130px;
  border: 1px solid rgba(99, 91, 91, 0.2);
  margin: 5px;
  padding: 5px;
`;
const Left = styled.div`
  flex: 1;
`;
const Center = styled.div`
  flex: 7;
  display: flex;
  flex-direction: column;

  padding: 5px;
`;
const Right = styled.div`
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: capitalize;
  color: var(--orange-color);
  cursor: pointer;
  & svg {
    display: none;
    color: var(--orange-color);
  }
  &:hover {
    color: var(--malon-color);
  }
  @media (max-width: 992px) {
    & svg {
      display: block;
    }
    & p {
      display: none;
    }
  }
`;
const OrderImg = styled.img.attrs((props) => ({
  src: props.src,
  alt: 'imag',
}))`
  object-fit: cover;
  object-position: top;
  width: 110px;
  height: 120px;
`;
const Name = styled.div`
  text-transform: capitalize;
  margin: 0 5px 10px 5px;
  @media (max-width: 992px) {
    width: 180px;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0 0 5px 0;
  }
`;
const OrderNum = styled.div`
  font-size: 13px;
  margin: 0 5px 10px 5px;
  @media (max-width: 992px) {
    width: 180px;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0 0 5px 0;
  }
`;

const Statuscont = styled.div`
  display: flex;
`;
const Status = styled.div`
  margin: 0 5px 10px 5px;

  background: ${(props) =>
    props.isDelivered || props.isPaid ? 'green' : 'grey'};
  color: #fff;
  font-size: 13px;
  padding: 2px 5px;
  width: ${(props) => (props.isDelivered || props.isPaid ? '70px' : '100px')};
  text-align: center;

  border: 0;
  cursor: none;
  @media (max-width: 992px) {
    margin: 0 0 5px 0;
  }
`;
const Date = styled.div`
  margin: 0 5px 10px 5px;
  @media (max-width: 992px) {
    margin: 0 0 5px 0;
    font-size: 13px;
  }
`;

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, orders: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function OrderHistoryScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();
  const [displayTab, setDisplayTab] = useState('openorders');

  const [{ loading, error, orders }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(`/api/orders/mine`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);

  const tabSwitch = (tab) => {
    switch (tab) {
      case 'openorders':
        return orders.map((order) => (
          <Content key={order._id}>
            <Left>
              <OrderImg src={order.orderItems[0].image}></OrderImg>
            </Left>
            <Center>
              <Name>{order.orderItems[0].name}</Name>
              <OrderNum>Order {order._id}</OrderNum>
              <Statuscont>
                <Status isDelivered={order.isDelivered}>
                  {order.isDelivered ? 'Delivered' : 'Not Delivered'}
                </Status>
                <Status isPaid={order.isPaid}>
                  {order.isPaid ? 'Paid' : 'Not Paid'}
                </Status>
              </Statuscont>
              <Date>By {order.user.name}</Date>
            </Center>
            <Right>
              <Link to={`/order/${order._id}`}>
                <p>See Details</p>
                <FontAwesomeIcon icon={faEye} />
              </Link>
            </Right>
          </Content>
        ));
      case 'closedorders':
        return <>closedorders</>;

      default:
        break;
    }
  };

  return (
    <ContainerBig>
      <Helmet>
        <title>Order History</title>
      </Helmet>
      <h1>Order History</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <Container>
            <Tab>
              <TabItem
                className={displayTab === 'openorders' && 'active'}
                onClick={() => setDisplayTab('openorders')}
              >
                Open Orders (5)
              </TabItem>
              <TabItem
                className={displayTab === 'closedorders' && 'active'}
                onClick={() => setDisplayTab('closedorders')}
              >
                Closed Orders (10)
              </TabItem>
            </Tab>
            {tabSwitch(displayTab)}
          </Container>
          {/*<table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.itemsPrice.toFixed(2)}</td>
                  <td>{order.isPaid ? order.paidAt.substring(0, 10) : 'No'}</td>
                  <td>
                    {order.isDelivered
                      ? order.deliveredAt.substring(0, 10)
                      : 'No'}
                  </td>
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => {
                        navigate(`/order/${order._id}`);
                      }}
                    >
                      Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table> */}
        </>
      )}
    </ContainerBig>
  );
}
