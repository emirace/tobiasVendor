import {
  faGear,
  faRightFromBracket,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Store } from '../Store';

const Container = styled.div`
  display: none;
  @media (max-width: 992px) {
    overflow: auto;
    position: fixed;
    display: block;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 8;
    padding: 100px 30px 55px 30px;
  }
`;

const MobileMenuItem = styled.div`
  border-bottom: 1px solid rgba(99, 91, 91, 0.2);
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

export default function MobileProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo } = state;

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
    <Container className={mode}>
      <AdsImage />
      <SwitchCont>
        <Switch
          checked={mode === 'pagebodydark'}
          onChange={(e) => darkMode(e.target.checked)}
        ></Switch>
        <Label>{mode === 'pagebodydark' ? 'DarkMode' : 'LightMode'}</Label>
      </SwitchCont>
      <MobileMenuItem>
        <FontAwesomeIcon icon={faUser} />
        <Link to={`/seller/${userInfo._id}`}>My Profile</Link>
      </MobileMenuItem>
      <MobileMenuItem>
        <FontAwesomeIcon icon={faGear} />
        <Link to="/account">Settings</Link>
      </MobileMenuItem>

      <MobileMenuItem onClick={() => signoutHandler()}>
        <FontAwesomeIcon icon={faRightFromBracket} />
        Logout
      </MobileMenuItem>
    </Container>
  );
}
