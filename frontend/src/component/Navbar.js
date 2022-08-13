import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import IconsTooltips from "./IconsTooltips";
import {
  faEnvelope,
  faHeart,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchBox from "./SearchBox";
import { Link } from "react-router-dom";
import { Store } from "../Store";
import axios from "axios";
import { getError } from "../utils";
import { ReactComponent as MessageIcon } from "./../icons/Icons-04.svg";
import { ReactComponent as CartIcon } from "./../icons/Icons-08.svg";

const Container = styled.div`
  width: 100%;
  margin-bottom: 20px;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
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
const First = styled.div`
  animation: first 30s infinite linear;
  display: flex;
  justify-content: center;
  @keyframes first {
    0% {
      width: 100%;
      opacity: 1;
    }
    28% {
      width: 100%;
      opacity: 1;
    }
    33% {
      width: 0;
      opacity: 0;
    }
    99% {
      width: 0;
      opacity: 0;
    }
  }
`;
const Second = styled.div`
  animation: second 30s infinite linear;
  display: flex;
  justify-content: center;
  @keyframes second {
    0% {
      opacity: 0;
      width: 0;
    }
    28% {
      opacity: 0;
      width: 0;
    }
    33% {
      width: 100%;
      opacity: 1;
    }
    61% {
      width: 100%;
      opacity: 1;
    }
    66% {
      width: 0;
      opacity: 0;
    }
    100% {
      width: 0;
      opacity: 0;
    }
  }
`;
const Third = styled.div`
  animation: third 30s infinite linear;
  display: flex;
  justify-content: center;
  @keyframes third {
    0% {
      width: 0;
      opacity: 0;
    }
    33% {
      width: 0;
      opacity: 0;
    }
    61% {
      width: 0;
      opacity: 0;
    }
    66% {
      width: 100%;
      opacity: 1;
    }
    95% {
      width: 100%;
      opacity: 1;
    }
    100% {
      width: 0;
      opacity: 0;
    }
  }
`;

const Right = styled.div`
  flex: 1;
  content: "";
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

const Underline = styled.div`
  margin: 0 5px;
  color: var(--orange-color);
  text-decoration: underline;
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
const ProfileImg = styled.img`
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
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 992px) {
    display: none;
  }
`;
const CategoryItem = styled.li`
  font-weight: 500;
  font-size: 15px;
  text-transform: capitalize;
  cursor: pointer;
  &:hover {
    color: var(--orange-color);
  }
`;
const CategoryGroup = styled.div`
  margin: 10px 20px;
  &:hover ul {
    display: flex;
  }
`;

const SubCategoryItem = styled.li`
  white-space: nowrap;
  align-self: start;
  font-weight: 500;
`;
const SubCategoryItemS = styled.li`
  white-space: nowrap;
  align-self: start;
  padding-bottom: 10px;
  font-weight: 500;
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

const SubCategory = styled.ul`
  position: absolute;
  box-shadow: ${(props) =>
    props.bg
      ? "0 0 3px rgba(0, 0, 0, 0.2)"
      : "0 0 3px rgba(225, 225, 225, 0.2)"};
  top: 32px;
  left: 0;
  width: 100vw;
  height: 350px;
  background: ${(props) => (props.bg ? "#fff" : "#000")};
  display: none;
  flex-direction: column;
  align-items: center;
  padding: 40px 150px;
  z-index: 9;
  flex-wrap: wrap;
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
  type: "checkbox",
  id: "darkmodeSwitch",
  role: "switch",
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
    content: "";
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    background: #000;
    transition: 0.5s;
  }
`;

const Label = styled.label.attrs({
  for: "darkmodeSwitch",
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
  left: -60px;
  top: 50px;
  box-shadow: ${(props) =>
    props.mode === "pagebodylight "
      ? "0 5px 16px rgba(0, 0, 0, 0.2)"
      : "0 5px 16px rgba(225, 225, 225, 0.2)"};
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
const Group = styled.div`
  align-self: start;
  margin-bottom: 10px;
`;
const UList = styled.ul`
  display: flex;
  flex-direction: column;
`;
const SList = styled.li`
  cursor: pointer;
  &:hover {
    color: var(--orange-color);
    text-decoration: underline;
  }
`;
const LogoImage = styled.img`
  width: 100%;
`;

export default function Navbar({ menu, setMymenu, setmodelRef1 }) {
  const modelRef = useRef();
  useEffect(() => {
    setmodelRef1(modelRef.current);
  }, []);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo, mode } = state;

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    try {
      const fetchCategories = async () => {
        const { data } = await axios.get("/api/categories");
        setCategories(data);
      };
      fetchCategories();
    } catch (err) {
      console.log(getError(err));
    }
  }, [userInfo]);

  const backMode = (mode) => {
    if (mode === "pagebodydark") {
      mode = false;
    } else {
      mode = true;
    }
    return mode;
  };
  const subCateMode = backMode(mode);

  const darkMode = (mode) => {
    if (mode) {
      ctxDispatch({ type: "CHANGE_MODE", payload: "pagebodydark" });
      localStorage.setItem("mode", "pagebodydark");
    } else {
      ctxDispatch({ type: "CHANGE_MODE", payload: "pagebodylight" });
      localStorage.setItem("mode", "pagebodylight");
    }
  };

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("useraddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin";
  };

  return (
    <Container mode={mode}>
      <Wrapper>
        <Left>
          <SwitchCont>
            <Switch
              checked={mode === "pagebodydark"}
              onChange={(e) => darkMode(e.target.checked)}
            ></Switch>
            <Label>{mode === "pagebodydark" ? "DarkMode" : "LightMode"}</Label>
          </SwitchCont>
        </Left>
        <Center>
          <First>
            <Underline>
              <Link to="signup">SIGN UP</Link>
            </Underline>{" "}
            , List All Item For Free{" "}
          </First>
          <Second>
            No Selling Fees, Hurry, Start Selling, Limited Off!!{" "}
            <Underline>DETAILS</Underline>
          </Second>
          <Third>
            Easy on the App. Explore Repeddle on <Underline>IOS</Underline> and{" "}
            <Underline>ANDRIOD</Underline>
          </Third>
        </Center>
        <Right>
          <Link to="/sell">
            <Sell>Sell</Sell>
          </Link>
        </Right>
      </Wrapper>
      <Wrapper2>
        <Logo>
          <Link to="/">
            <LogoImage
              src={
                mode === "pagebodydark"
                  ? "https://res.cloudinary.com/emirace/image/upload/v1659377710/Repeddle-White_pani6a.gif"
                  : "https://res.cloudinary.com/emirace/image/upload/v1659377672/Repeddle-Black_eko2g5.gif"
              }
            />
          </Link>
        </Logo>

        <Search>
          <SearchBox />
        </Search>
        <RightMenu>
          <MenuItem>
            <Link to="/messages">
              <MessageIcon height={25} width={25} />
              <IconsTooltips tips="Messages" />
            </Link>
          </MenuItem>
          <MenuItemCart>
            <Link to="/cart">
              <CartIcon height={25} width={25} />
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
                      <Link to="/dashboard/orderlist">Purchase Orders</Link>
                    </li>
                    <li>
                      <Link to="/dashboard/saleslist">Sold Orders</Link>
                    </li>
                    <li>
                      <Link to="/dashboard/productlist">My Products</Link>
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
        {categories.length > 0 &&
          categories.map((c) => (
            <CategoryGroup>
              <CategoryItem>
                <Link to={`/category/${c.name}`}>{c.name}</Link>
              </CategoryItem>

              <SubCategory bg={subCateMode}>
                {c.subCategories.length > 0 &&
                  c.subCategories.map((s) => {
                    if (s.items.length === 0) {
                      return <SubCategoryItemS>{s.name} </SubCategoryItemS>;
                    } else {
                      return (
                        <Group>
                          <SubCategoryItem>{s.name}</SubCategoryItem>
                          <UList>
                            {s.items.map((l) => (
                              <SList>{l}</SList>
                            ))}
                          </UList>
                        </Group>
                      );
                    }
                  })}
              </SubCategory>
            </CategoryGroup>
          ))}
        <CategoryGroup>
          <Link to="/brand">
            <CategoryItem>SHOP BY BRAND</CategoryItem>
          </Link>
        </CategoryGroup>
        <CategoryGroup>
          <Link to="/recurated">
            <CategoryItem>RE:CURATED</CategoryItem>
          </Link>
        </CategoryGroup>
      </Category>
    </Container>
  );
}
