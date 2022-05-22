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
  position: relative;
  @media (max-width: 992px) {
    flex-direction: column;
    margin: 0;
  }
`;

const Left = styled.div`
  flex: 1;
  @media (max-width: 992px) {
    display: none;
  }
`;

const DetailLeft = styled.div`
  flex: 1;
  @media (max-width: 992px) {
  }
`;

const Right = styled.div`
  display: flex;
  flex: 3;
  @media (max-width: 992px) {
    flex: 1;
    margin-top: 20px;
  }
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
  @media (max-width: 992px) {
    margin-left: 5px;
    margin-right: 5px;
  }
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

const DetailCont = styled.div`
  display: flex;
  flex-direction: column;
`;

const MobileMenu = styled.div.attrs((props) => ({
  id: props.mode,
}))`
  display: none;
  @media (max-width: 992px) {
    display: ${(props) => (props.displaymenu ? 'none' : 'block')};
    overflow: auto;
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: #fff;
    z-index: 8;
    padding: 100px 30px 55px 30px;
  }
`;
const MobileMenuItem = styled.div`
  border-bottom: 1px solid #ddd;
  padding: 15px 0;
  & svg {
    margin-right: 10px;
  }
  &:hover {
    background: var(--orange-color);
  }
`;

const AdsImage = styled.img.attrs({
  src: '/images/p8.png',
  alt: 'ads',
})`
  width: 100vw;
  height: 100px;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
`;

const Switch = styled.input.attrs({
  type: 'checkbox',
  id: 'darkmodeSwitch',
  role: 'switch',
})`
  position: relative;

  width: 40px;
  height: 15px;
  -webkit-appearance: none;
  background: #000;
  border-radius: 20px;
  outline: none;
  transition: 0.5s;
  @media (max-width: 992px) {
  }

  &:checked {
    background: #fff;
    &:before {
      left: 25px;
      background: #000;
    }
  }
  &:before {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    background: #fff;
    transition: 0.5s;
  }
`;

const Label = styled.label.attrs({
  for: 'darkmodeSwitch',
})`
  margin-left: 5px;
  @media (max-width: 992px) {
  }
`;

const SwitchCont = styled.div`
  padding: 10px 0;
  display: flex;
  justify-content: end;
  align-items: center;
`;

export default function MyAccountScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, cart, mode } = state;
  const { shippingAddress: address } = cart;

  const [display, setDispalay] = useState('account');
  const [hideMenu, setHideMwnu] = useState(false);

  const displaySection = () => {
    switch (display) {
      case 'account':
        return (
          <DetailCont>
            <DetailLeft>
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
                  <MessageBox>Enter Payment Information here</MessageBox>
                )}
              </Card>
            </DetailLeft>
            <DetailLeft>
              <Card>
                <CardTitle>
                  Shipping Address
                  <Link to="/shipping">
                    {' '}
                    <FontAwesomeIcon icon={faPen} />
                  </Link>
                </CardTitle>
                {address.address ? (
                  <>
                    <Location>Address: {address.address} </Location>
                    <Location>City: {address.city}</Location>
                    <Location>State: {address.state}</Location>
                    <Location>Postal Code: {address.postal}</Location>
                    <Location>Country: {address.country}</Location>
                  </>
                ) : (
                  <MessageBox>Enter Shipping Information here</MessageBox>
                )}
              </Card>
              <Card>
                <CardTitle>Wallet</CardTitle>
              </Card>
            </DetailLeft>
          </DetailCont>
        );

      case 'order':
        return <OrderHistoryScreen />;
      case 'product':
        return <ProductListScreen />;
      default:
        break;
    }
  };

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };

  const darkMode = (mode) => {
    if (mode) {
      ctxDispatch({ type: 'CHANGE_MODE', payload: 'pagebodydark' });
      localStorage.setItem('mode', 'pagebodydark');
    } else {
      ctxDispatch({ type: 'CHANGE_MODE', payload: 'pagebodylight' });
      localStorage.setItem('mode', 'pagebodylight');
    }
  };

  return (
    <Container>
      <MobileMenu mode={mode} displaymenu={hideMenu}>
        <AdsImage />
        <SwitchCont>
          <Switch
            checked={mode === 'pagebodydark'}
            onChange={(e) => darkMode(e.target.checked)}
          ></Switch>
          <Label>{mode === 'pagebodydark' ? 'DarkMode' : 'LightMode'}</Label>
        </SwitchCont>
        <MobileMenuItem
          onClick={() => {
            setDispalay('account');
            setHideMwnu(true);
          }}
        >
          <FontAwesomeIcon icon={faUser} />
          Account
        </MobileMenuItem>
        <MobileMenuItem
          onClick={() => {
            setDispalay('order');
            setHideMwnu(true);
          }}
        >
          <FontAwesomeIcon icon={faBagShopping} />
          Orders
        </MobileMenuItem>
        <MobileMenuItem>
          <Link to="/messages">
            <FontAwesomeIcon icon={faEnvelope} />
            Inbox
          </Link>
        </MobileMenuItem>
        <MobileMenuItem
          onClick={() => {
            setDispalay('product');
            setHideMwnu(true);
          }}
        >
          <FontAwesomeIcon icon={faBasketShopping} />
          Product
        </MobileMenuItem>
        <MobileMenuItem onClick={() => signoutHandler()}>
          <FontAwesomeIcon icon={faRightFromBracket} />
          Logout
        </MobileMenuItem>
      </MobileMenu>
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
          <MenuItem onClick={() => signoutHandler()}>
            <FontAwesomeIcon icon={faRightFromBracket} />
            Logout
          </MenuItem>
        </Menu>
      </Left>
      <Right>{displaySection()}</Right>
    </Container>
  );
}
