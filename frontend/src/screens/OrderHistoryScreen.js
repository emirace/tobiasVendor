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
import { faPen } from '@fortawesome/free-solid-svg-icons';

const ContainerBig = styled.div`
  width: 100%;
  height: 100%;
  margin: 0 10px;
`;

const Container = styled.div`
  width: 100%;
  margin: 0 20px;
  height: 200px;
`;

const Tab = styled.div`
  display: flex;
  margin-bottom: 10px;
  border: 1px solid rgba(99, 91, 91, 0.2);
`;
const TabItem = styled.div`
  cursor: pointer;
  margin: 15px;
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
      bottom: -15px;
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
    color: var(--orange-color);
  }
  &:hover {
    color: var(--malon-color);
  }
`;
const OrderImg = styled.img.attrs({
  src: '/images/pimage.png',
  alt: 'imag',
})`
  object-fit: cover;
  width: 120px;
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
  }
`;
const OrderNum = styled.div`
  font-size: 13px;
  margin: 0 5px 10px 5px;
`;
const Status = styled.div`
  margin: 0 5px 10px 5px;

  background: green;
  color: #fff;
  font-size: 13px;
  padding: 2px 5px;
  width: 70px;
  text-align: center;

  border: 0;
  cursor: none;
`;
const Date = styled.div`
  margin: 0 5px 10px 5px;
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
        return (
          <Content>
            <Left>
              <OrderImg></OrderImg>
            </Left>
            <Center>
              <Name>this is the dress of all hshevfwgge</Name>
              <OrderNum>Order 123456789098765543</OrderNum>
              <Status>Delivered</Status>
              <Date>On 22-02-22</Date>
            </Center>
            <Right>
              {/* <FontAwesomeIcon icon={faPen} /> */}
              <Link to={`/order/${order._id}`}>See Details</Link>
            </Right>
          </Content>
        );
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
