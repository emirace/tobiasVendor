import axios from 'axios';
import React, { useContext, useReducer, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { getError } from '../utils';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBagShopping,
  faCircleHalfStroke,
  faEnvelope,
  faGear,
  faHeart,
  faRightFromBracket,
  faTag,
  faBasketShopping,
  faUser,
  faPen,
} from '@fortawesome/free-solid-svg-icons';
import Rating from '../component/Rating';
import { Link, Route, Routes } from 'react-router-dom';
import MessageBox from '../component/MessageBox';
import ProtectedRoute from '../component/ProtectedRoute';
import OrderHistoryScreen from './OrderHistoryScreen';
import ProductListScreen from './ProductListScreen';

const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };

    default:
      return state;
  }
};

const Container = styled.div`
  margin: 30px;
  display: flex;
`;

const Left = styled.div`
  flex: 1;
`;

const Right = styled.div`
  display: flex;
  flex: 3;
`;
const Menu = styled.div`
  padding: 0 20px;
  border: 1px solid #ddd;
`;
const MenuItem = styled.div`
  margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
  position: relative;
  padding: 5px;
  cursor: pointer;
  &:hover {
    background: var(--orange-color);
    color: var(--malon-color);
  }
  & svg {
    margin-right: 10px;
  }
  &:last-child {
    border-bottom: 0;
  }
`;
const Profile = styled.div`
  display: flex;
  padding: 0 10px;
`;
const Status = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Action = styled.div``;
const Image = styled.img.attrs((props) => ({
  src: props.src,
  alt: props.alt,
}))`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
`;
const Detail = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 15px;
  justify-content: center;
`;
const Name = styled.div`
  font-weight: bold;
  text-transform: capitalize;
`;
const Location = styled.div`
  text-transform: capitalize;
  margin-left: 20px;
`;
const Sold = styled.div`
  margin-left: 10px;
  & svg {
    color: var(--orange-color);
    margin-right: 10px;
  }
`;
const Online = styled.div`
  border: 1px solid var(--orange-color);
  padding: 0 10px;
  border-radius: 10px;
  color: var(--orange-color);
`;

const Card = styled.div`
  border: 1px solid #ddd;
  padding: 5px 20px;
  margin-bottom: 20px;
  margin-left: 20px;
  border-radius: 5px;
  height: 170px;
`;
const CardTitle = styled.div`
  text-transform: uppercase;
  padding: 0 0 5px 15px;
  position: relative;
  & svg {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translate(0, -50%);
  }
`;
const Email = styled.div`
  text-transform: capitalize;
`;

export default function MyAccountScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [display, setDispalay] = useState('order');

  const displaySection = () => {
    switch (display) {
      case 'account':
        return (
          <>
            <Left>
              <Card>
                <CardTitle>
                  account Information{' '}
                  <Link to="/profile">
                    <FontAwesomeIcon icon={faPen} />
                  </Link>
                </CardTitle>
                <Profile>
                  <Image alt="profile" src="/images/pimage.png" />
                  <Detail>
                    <Name>{userInfo.name}</Name>
                    <Email>{userInfo.email}</Email>
                    <Rating rating={5} />
                  </Detail>
                </Profile>
                <Status>
                  <Sold>
                    <FontAwesomeIcon icon={faTag} />
                    51 Sold
                  </Sold>
                  <Online>Online</Online>
                </Status>
                <Action></Action>
              </Card>
              <Card>
                <CardTitle>
                  Payment Information{' '}
                  <Link to="/paymentinfo">
                    <FontAwesomeIcon icon={faPen} />
                  </Link>
                </CardTitle>
                {userInfo.paymentinfo ? (
                  <>payment Information here</>
                ) : (
                  <MessageBox>Enter payment Information here</MessageBox>
                )}
              </Card>
            </Left>
            <Left>
              <Card>
                <CardTitle>
                  Shipping Address <FontAwesomeIcon icon={faPen} />
                </CardTitle>

                <Location>Address: 102 james williams avenue</Location>
                <Location>City: benin city</Location>
                <Location>State: Edo state</Location>
                <Location>Postal Code: 300102</Location>
                <Location>Country: Nigeria</Location>
              </Card>
              <Card>
                <CardTitle>Wallet</CardTitle>
              </Card>
            </Left>
          </>
        );

      case 'order':
        return <OrderHistoryScreen />;
      case 'product':
        return <ProductListScreen />;
      default:
        break;
    }
  };

  return (
    <Container>
      <Left>
        <Menu>
          <MenuItem onClick={() => setDispalay('account')}>
            <FontAwesomeIcon icon={faUser} />
            Account
          </MenuItem>
          <MenuItem onClick={() => setDispalay('order')}>
            <FontAwesomeIcon icon={faBagShopping} />
            Orders
          </MenuItem>
          <MenuItem>
            <Link to="/messages">
              <FontAwesomeIcon icon={faEnvelope} />
              Inbox
            </Link>
          </MenuItem>
          <MenuItem onClick={() => setDispalay('product')}>
            <FontAwesomeIcon icon={faBasketShopping} />
            Product
          </MenuItem>
          <MenuItem>
            <FontAwesomeIcon icon={faRightFromBracket} />
            Logout
          </MenuItem>
        </Menu>
      </Left>
      <Right>{displaySection()}</Right>
    </Container>
  );
}
