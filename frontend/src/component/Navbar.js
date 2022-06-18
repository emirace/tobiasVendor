import React, { useContext, useRef, useState } from 'react';
import styled from 'styled-components';
import IconsTooltips from './IconsTooltips';
import {
  faEnvelope,
  faHeart,
  faShoppingCart,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SearchBox from './SearchBox';
import { Link } from 'react-router-dom';
import { Store } from '../Store';

const Container = styled.div`
  width: 100%;
  margin-bottom: 10px;
`;
const Wrapper = styled.div`
  padding: 0 20px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const Wrapper2 = styled.div`
  padding: 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 992px) {
    margin-bottom: 10px;
  }
`;
const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  @media (max-width: 992px) {
    display: none;
  }
`;
const Center = styled.div`
  flex: 2;
  display: flex;
  justify-content: center;
  color: #fff;
  white-space: nowrap;
  @media (max-width: 992px) {
    animation: moving 25s infinite linear;
    @keyframes moving {
      0% {
        transform: translateX(100%);
      }
      100% {
        transform: translateX(-100%);
      }
    }
  }
`;
const Right = styled.div`
  flex: 1;
  content: '';
  display: flex;
  justify-content: end;
  @media (max-width: 992px) {
    display: none;
  }
`;
const Sell = styled.div`
  background-color: var(--orange-color);
  border-radius: 8px;
  margin: 5px;
  display: flex;
  padding: 5px 30px;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  &:hover {
    background: var(--malon-color);
  }
`;

const Love = styled.div`
  position: relative;
  &:hover div {
    display: block;
  }
`;

const Logo = styled.div`
  flex: 1;
  font-size: 40px;
  font-weight: bold;
  text-transform: uppercase;
`;
const Search = styled.div`
  flex: 3;
  @media (max-width: 992px) {
    display: none;
  }
`;
const RightMenu = styled.div`
  flex: 1;
  display: flex;
  justify-content: end;
  align-items: center;
`;

const MenuItem = styled.div`
  font-size: 20px;
  margin-left: 20px;
  position: relative;
  @media (max-width: 992px) {
    display: none;
  }
  &:hover {
    color: var(--orange-color);
  }
  &:hover div {
    opacity: 1;
  }
`;
const MenuItemCart = styled.div`
  font-size: 20px;
  margin-left: 20px;
  position: relative;
  &:hover {
    color: var(--orange-color);
  }
  &:hover div {
    opacity: 1;
  }
`;
const ProfileImg = styled.img.attrs((props) => ({
  src: props.src ? props.src : '/images/pimage.png',
}))`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  margin-left: 20px;
  object-fit: cover;
  @media (max-width: 992px) {
    display: none;
  }
`;
const Category = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 992px) {
    display: none;
  }
`;
const CategoryItem = styled.li`
  font-weight: 600;
  text-transform: capitalize;
  padding: 10px 20px;
  cursor: pointer;

  &:hover {
    color: var(--orange-color);
  }
`;
const CategoryGroup = styled.div`
  position: relative;
  &:hover ul {
    display: block;
  }
`;
const SubCategory = styled.ul.attrs({})`
  position: absolute;
  box-shadow: ${(props) =>
    props.bg
      ? '0 0 3px rgba(0, 0, 0, 0.2)'
      : '0 0 3px rgba(225, 225, 225, 0.2)'};
  top: 35px;
  left: 20px;
  background: ${(props) => (props.bg ? '#fff' : '#000')};
  display: none;
  padding: 20px;
  z-index: 9;
`;
const SubCategoryItem = styled.li`
  white-space: nowrap;
  padding-bottom: 10px;
  cursor: pointer;
  &:hover {
    color: var(--orange-color);
    text-decoration: underline;
  }
`;
const Badge = styled.span`
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--orange-color);
  color: #fff;
  font-size: 10px;
  border-radius: 50%;
  position: absolute;
  right: 0;
  top: 0;
`;

const SellButton = styled.div`
  background: var(--orange-color);
  cursor: pointer;
  color: #fff;
  border-radius: 10px;
  padding: 5px 20px;
  margin-left: 10px;
  display: none;
  &:hover {
    background: var(--malon-color);
  }
  @media (max-width: 992px) {
    display: block;
  }
`;

const SignIn = styled.div`
  margin-left: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    color: var(--orange-color);
  }
  @media (max-width: 992px) {
    display: none;
  }
`;

const SwitchCont = styled.div`
  padding: 10px 0;
  display: flex;
  justify-content: end;
  align-items: center;
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
  background: #fff;
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
    background: #000;
    transition: 0.5s;
  }
`;

const Label = styled.label.attrs({
  for: 'darkmodeSwitch',
})`
  margin-left: 5px;
  color: #fff;
  @media (max-width: 992px) {
  }
`;

const ProfileMenu = styled.div`
  z-index: 9;
  padding: 15px;
  position: absolute;
  left: -15px;
  top: 50px;
  box-shadow: ${(props) =>
    props.mode === 'pagebodylight '
      ? '0 5px 16px rgba(0, 0, 0, 0.2)'
      : '0 5px 16px rgba(225, 225, 225, 0.2)'};
  border-radius: 5px;
  font-size: 14px;
  & ul li {
    white-space: nowrap;
    cursor: pointer;
    margin-bottom: 10px;
  }
`;
const ProfileCont = styled.div`
  position: relative;
`;

export default function Navbar({ menu, setMymenu, setmodelRef1 }) {
  const modelRef = useRef();
  setmodelRef1(modelRef.current);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo, mode } = state;

  const backMode = (mode) => {
    if (mode === 'pagebodydark') {
      mode = false;
    } else {
      mode = true;
    }
    return mode;
  };
  const subCateMode = backMode(mode);

  const darkMode = (mode) => {
    if (mode) {
      ctxDispatch({ type: 'CHANGE_MODE', payload: 'pagebodydark' });
      localStorage.setItem('mode', 'pagebodydark');
    } else {
      ctxDispatch({ type: 'CHANGE_MODE', payload: 'pagebodylight' });
      localStorage.setItem('mode', 'pagebodylight');
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

  return (
    <Container>
      <Wrapper>
        <Left>
          <SwitchCont>
            <Switch
              checked={mode === 'pagebodydark'}
              onChange={(e) => darkMode(e.target.checked)}
            ></Switch>
            <Label>{mode === 'pagebodydark' ? 'DarkMode' : 'LightMode'}</Label>
          </SwitchCont>
        </Left>
        <Center>
          50% discount on Newly Registered User... You Will Love
          <Love>
            <FontAwesomeIcon color="#F79A23" icon={faHeart} />
          </Love>
          Shopping with Us
        </Center>
        <Right>
          <Sell>Sell</Sell>
        </Right>
      </Wrapper>
      <Wrapper2>
        <Logo>
          <Link to="/">Repeddle</Link>
        </Logo>

        <Search>
          <SearchBox />
        </Search>
        <RightMenu>
          <MenuItem>
            <Link to="/messages">
              <FontAwesomeIcon icon={faEnvelope} />
              <IconsTooltips tips="Messages" />
            </Link>
          </MenuItem>
          <MenuItemCart>
            <Link to="/cart">
              <FontAwesomeIcon icon={faShoppingCart} />

              <IconsTooltips tips="Cart" />

              {cart.cartItems.length > 0 && (
                <Badge>
                  <span>{cart.cartItems.length}</span>
                </Badge>
              )}
            </Link>
          </MenuItemCart>
          <SellButton>Sell</SellButton>
          {userInfo ? (
            <ProfileCont>
              <ProfileImg
                src={userInfo.image}
                ref={modelRef}
                onClick={() => setMymenu(!menu)}
              />
              {menu && (
                <ProfileMenu mode={mode} className={mode}>
                  <ul>
                    <li>
                      <Link to={`/seller/${userInfo._id}`}>My Profile</Link>
                    </li>
                    <li>
                      <Link to="/dashboard">Dashboard</Link>
                    </li>
                    <li onClick={() => signoutHandler()}>Log Out</li>
                  </ul>
                </ProfileMenu>
              )}
            </ProfileCont>
          ) : (
            <SignIn>
              <Link to="signin">Signin / Register</Link>
            </SignIn>
          )}
        </RightMenu>
      </Wrapper2>
      <Category>
        <CategoryGroup>
          <Link to="/category/womenswear">
            <CategoryItem>Womenswear</CategoryItem>
          </Link>
          <SubCategory bg={subCateMode}>
            <SubCategoryItem>Sub Category</SubCategoryItem>
            <SubCategoryItem>Sub Category</SubCategoryItem>
            <SubCategoryItem>Sub Category</SubCategoryItem>
          </SubCategory>
        </CategoryGroup>
        <CategoryGroup>
          <Link to="/category/menswear">
            <CategoryItem>Menswear</CategoryItem>
          </Link>
          <SubCategory bg={subCateMode}>
            <SubCategoryItem>Sub Category 2</SubCategoryItem>
            <SubCategoryItem>Sub Category 2</SubCategoryItem>
            <SubCategoryItem>Sub Category 2</SubCategoryItem>
          </SubCategory>
        </CategoryGroup>
        <Link to="/category/kids">
          <CategoryItem>Kids</CategoryItem>
        </Link>
        <Link to="/category/curve-plus">
          <CategoryItem>Curve +Plus</CategoryItem>
        </Link>
        <Link to="/brand">
          <CategoryItem>Shop by brand</CategoryItem>
        </Link>
        <Link to="shopbyoutfit">
          <CategoryItem>Shop by outfit</CategoryItem>
        </Link>
      </Category>
    </Container>
  );
}
