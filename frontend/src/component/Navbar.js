import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import IconsTooltips from "./IconsTooltips";
import {
  faBell,
  faEnvelope,
  faHeart,
  faMoon,
  faShoppingCart,
  faSun,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchBox from "./SearchBox";
import { Link } from "react-router-dom";
import { Store } from "../Store";
import axios from "axios";
import { getError } from "../utils";
import { ReactComponent as MessageIcon } from "./../icons/Icons-04.svg";
import { ReactComponent as CartIcon } from "./../icons/Icons-08.svg";
import { ReactComponent as Notification } from "./../icons/Icons-11.svg";
import { socket } from "../App";
import moment from "moment";
import { logout } from "../hooks/initFacebookSdk";
import { BsFillSunFill } from "react-icons/bs";
import { BsFillMoonStarsFill } from "react-icons/bs";
import secureLocalStorage from "react-secure-storage";
import RedirectButton from "./RedirectButton";

const Container = styled.div`
  width: 100%;
  margin-bottom: 20px;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  @media (max-width: 992px) {
    margin-bottom: 0;
  }
`;
const Wrapper = styled.div`
  padding: 0 20px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
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
    padding-bottom: 10px;
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
  /* display: flex;
  justify-content: center; */
  color: #fff;
  overflow-x: hidden;
  /* white-space: nowrap;
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
  } */
`;

const SliderCont = styled.div`
  display: flex;
  position: relative;
  top: 0;
  right: 0;
  animation: slideh linear 30s infinite;
  @keyframes slideh {
    /* (D0) THE IDEA - USE KEYFRAMES TO SHIFT SLIDES *
    0% {
      right: 0;
    }
    33% {
      right: 100%;
    }
    66% {
      right: 200%;
    }
    100% {
      right: 0;
    }

    /* (D1) BUT THE ABOVE WILL SHIFT NON-STOP */
    /* SO WE ADD PAUSES BETWEEN EACH SLIDE */
    0% {
      right: 0;
    }
    30% {
      right: 0;
    }
    33% {
      right: 100%;
    }
    63% {
      right: 100%;
    }
    66% {
      right: 200%;
    }
    97% {
      right: 200%;
    }
    100% {
      right: 0;
    }
  }
  &:hover {
    animation-play-state: paused;
  }
`;
const First = styled.span`
  display: flex;
  width: 100%;
  flex-shrink: 0;
  box-sizing: border-box;
  justify-content: center;
  @media (max-width: 992px) {
    font-size: 11px !important;
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
  &:hover {
    animation-play-state: paused;
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
  &:hover {
    animation-play-state: paused;
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
  position: relative;
  cursor: pointer;

  &:hover .text {
    display: block;
  }
`;

const Logo = styled.div`
  flex: 1;
  padding-right: 20px;
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
  margin: 0 10px;
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
  padding: 0 10px;
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
  text-transform: uppercase;
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
  text-transform: uppercase;
  font-weight: bold;
  white-space: nowrap;
  font-size: 12px;
  align-self: start;
`;
const SubCategoryItemS = styled.li`
  white-space: nowrap;
  align-self: start;
  font-size: 12px;
  padding-bottom: 10px;
  text-transform: uppercase;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    color: var(--orange-color);
    text-decoration: underline;
  }
`;
export const Badge = styled.span`
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
  cursor: default;
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
  height: 550px;
  background: ${(props) => (props.bg ? "#fff" : "#000")};
  display: none;
  flex-direction: column;
  align-items: center;
  padding: 40px 120px;
  z-index: 9;
  flex-wrap: wrap;
`;

const SignIn = styled.div`
  margin-left: 20px;
  font-size: 14px;
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
  & svg {
    color: white;
  }
`;

const Switch = styled.input.attrs({
  type: "checkbox",
  id: "darkmodeSwitch",
  role: "switch",
})`
  position: relative;
  margin: 0 10px;
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
  padding: 10px;
  position: absolute;
  left: -130px;
  width: 200px;
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
    padding: 5px 30px;
  }
  & ul li:hover {
    background: ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
    color: var(--orange-color);
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
  font-size: 12px;
  cursor: pointer;
  &:hover {
    color: var(--orange-color);
    text-decoration: underline;
  }
`;
const LogoImage = styled.img`
  width: 80%;
`;

const Li = styled.li`
  position: relative;
`;

const NotificationMenu = styled.div`
  width: 270px;
  max-height: 70vh;
  overflow: auto;
  position: absolute;
  z-index: 9;
  padding: 10px;
  border-radius: 0.2rem;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
  background: ${(props) => (props.mode === "pagebodydark" ? "black" : "white")};

  box-shadow: ${(props) =>
    props.mode === "pagebodylight "
      ? "0 5px 16px rgba(0, 0, 0, 0.2)"
      : "0 5px 16px rgba(225, 225, 225, 0.2)"};
`;
const Title = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
  color: ${(props) => (props.mode === "pagebodydark" ? "white" : "black")};
`;
const NotItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  position: relative;
  padding: 3px;
  &:hover {
    background: ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  }
`;
const NotImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;
const NotDetail = styled.div`
  font-size: 14px;
  margin-left: 5px;
`;
const NotText = styled.div`
  color: ${(props) => (props.mode === "pagebodydark" ? "white" : "black")};
`;
const Time = styled.div`
  color: var(--orange-color);
`;

const Tips = styled.span`
  position: relative;
  &:hover::after {
    content: "${(props) => props.tips}";
    width: 350px;
    position: absolute;
    border-radius: 0.5rem;
    left: 30px;
    text-align: justify;
    font-size: 14px;
    z-index: 2;
    line-height: 1.2;
    font-weight: 400;
    padding: 10px;
    background: ${(props) =>
      props.mode === "pagebodydark"
        ? "var(--white-color)"
        : "var(--black-color)"};
    color: ${(props) =>
      props.mode === "pagebodydark"
        ? "var(--black-color)"
        : "var(--white-color)"};
  }
`;

const DetailText = styled.div`
  display: none;
  position: fixed;
  left: 50%;
  top: 40px;
  z-index: 9;
  width: 300px;
  padding: 10px;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--white-color)"
      : "var(--black-color)"};
  color: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--black-color)"
      : "var(--white-color)"};
  @media (max-width: 992px) {
    left: 25%;
    width: 250px;
    top: 20px;
  }
`;

const Welcome = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: var(--orange-color);
`;

export const signoutHandler = () => {
  logout();
  localStorage.removeItem("userInfo");
  localStorage.removeItem("cartItems");
  localStorage.removeItem("shippingAddress");
  localStorage.removeItem("useraddress");
  localStorage.removeItem("paymentMethod");
  window.location.href = "/signin";
};
export default function Navbar({
  menu,
  setMymenu,
  setmodelRef1,
  setmodelRef2,
  showNotification,
  setShowNotification,
}) {
  const modelRef = useRef();
  const modelRef2 = useRef();
  useEffect(() => {
    setmodelRef1(modelRef.current);
    setmodelRef2(modelRef2.current);
  }, []);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo, mode, notifications, refresher } = state;

  const [categories, setCategories] = useState([]);

  const messageNotification = notifications.filter(
    (x) => x.notifyType === "message" && x.read === false
  );
  const purchaseNotification = notifications.filter(
    (x) => x.notifyType === "purchase" && x.read === false
  );
  const soldNotification = notifications.filter(
    (x) => x.notifyType === "sold" && x.read === false
  );
  const productNotification = notifications.filter(
    (x) => x.notifyType === "product" && x.read === false
  );
  const allNotification = notifications.filter((x) => x.read === false);

  useEffect(() => {
    try {
      const fetchCategories = async () => {
        const { data } = await axios.get(`/api/categories`);
        setCategories(data);
        console.log("categori", data);
      };
      fetchCategories();
    } catch (err) {
      console.log(getError(err));
    }
  }, [userInfo]);

  const [user, setUser] = useState(null);
  useEffect(() => {
    try {
      const fetchUser = async () => {
        const { data } = await axios.get(`/api/users/profile/user`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setUser(data);
        console.log("user", data);
      };
      fetchUser();
    } catch (err) {
      console.log(getError(err));
    }
  }, [userInfo, refresher]);

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

  return (
    <Container mode={mode}>
      <Wrapper>
        <Left>
          <SwitchCont>
            <BsFillSunFill />
            <Switch
              checked={mode === "pagebodydark"}
              onChange={(e) => darkMode(e.target.checked)}
            ></Switch>
            <BsFillMoonStarsFill />
          </SwitchCont>
        </Left>
        <Center>
          <SliderCont>
            <First>
              <Underline>
                <Link to="signup">SIGN UP</Link>
              </Underline>
              , List All Item For Free{" "}
            </First>
            <First>
              No Selling Fees, Hurry, Start Selling, Limited Offer!!{" "}
              <Underline>
                DETAILS
                <DetailText className="text">
                  Sell more than 10,400 brand names you love. To give you
                  unmatched user experiencd and support the growth of your
                  business as part of our thrift secondhand community, you will
                  not be charge Repeddle seller's commision fee.
                </DetailText>
              </Underline>
            </First>
            <First>
              Easy on the App. Explore Repeddle on <Underline>IOS</Underline>{" "}
              and <Underline>ANDRIOD</Underline>
            </First>
          </SliderCont>
        </Center>
        <Right>
          <Link to={userInfo?.isSeller ? "/newproduct" : "/sell"}>
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
                  ? "https://res.cloudinary.com/emirace/image/upload/v1661147636/Logo_White_3_ii3edm.gif"
                  : "https://res.cloudinary.com/emirace/image/upload/v1661147778/Logo_Black_1_ampttc.gif"
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
              {messageNotification.length > 0 && (
                <Badge>
                  <span>{messageNotification.length}</span>
                </Badge>
              )}
            </Link>
          </MenuItem>
          <MenuItem>
            <div
              onClick={() => {
                setShowNotification(!showNotification);
                console.log(showNotification);
              }}
              styled={{ position: "relative" }}
            >
              <FontAwesomeIcon
                icon={faBell}
                color="var(--malon-color)"
                style={{ cursor: "pointer", size: "25px" }}
              />
              <div
                ref={modelRef2}
                style={{
                  position: "absolute",
                  left: "0",
                  top: "0",
                  right: "0",
                  bottom: "0",
                  cursor: "pointer",
                }}
              ></div>
            </div>

            <IconsTooltips tips="Notifications" />
            {allNotification.length > 0 && (
              <Badge>
                <span>{allNotification.length}</span>
              </Badge>
            )}
            {showNotification && (
              <NotificationMenu mode={mode}>
                <Title mode={mode}>Notifications</Title>
                {notifications.length < 0 ? (
                  <b>No Notification</b>
                ) : (
                  notifications.map((not) => (
                    <Link to={not.link}>
                      <NotItem
                        mode={mode}
                        key={not._id}
                        onClick={() => {
                          socket.emit("remove_id_notifications", not._id);
                        }}
                      >
                        <NotImage src={not.userImage} alt="img" />
                        <NotDetail>
                          <NotText mode={mode}>{not.msg}</NotText>
                          <Time>{moment(not.createdAt).fromNow()}</Time>
                        </NotDetail>
                        {!not.read && (
                          <Badge
                            style={{
                              top: "50%",
                              transform: "translateY(-50%)",
                            }}
                          />
                        )}
                      </NotItem>
                    </Link>
                  ))
                )}
              </NotificationMenu>
            )}
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
          <Link to={userInfo?.isSeller ? "/newproduct" : "/sell"}>
            <SellButton>Sell</SellButton>
          </Link>
          {userInfo ? (
            <ProfileCont>
              <ProfileImg
                src={userInfo.image}
                ref={modelRef}
                onClick={() => setMymenu(!menu)}
              />
              {console.log(mode)}
              {menu && (
                <ProfileMenu mode={mode} className={mode}>
                  <Welcome>Hi {userInfo.username}</Welcome>
                  <ul>
                    <Li>
                      <Link to={`/seller/${userInfo._id}`}>My Profile</Link>

                      {/* {messageNotification.length > 0 && (
                        <Badge>
                          <span>{messageNotification.length}</span>
                        </Badge>
                      )} */}
                    </Li>
                    <Li>
                      <Link to="/dashboard/orderlist">Purchased Orders</Link>

                      {purchaseNotification.length > 0 && (
                        <Badge>
                          <span>{purchaseNotification.length}</span>
                        </Badge>
                      )}
                    </Li>
                    <Li>
                      <Link to="/dashboard/saleslist">Sold Orders</Link>
                      {console.log("sold", soldNotification)}

                      {soldNotification.length > 0 && (
                        <Badge>
                          <span>{soldNotification.length}</span>
                        </Badge>
                      )}
                    </Li>
                    <Li>
                      <Link to="/earning">My Earnings</Link>

                      {productNotification.length > 0 && (
                        <Badge>
                          <span>{productNotification.length}</span>
                        </Badge>
                      )}
                    </Li>
                    <Li>
                      <Link to="/dashboard/wallet">My Wallet</Link>

                      {productNotification.length > 0 && (
                        <Badge>
                          <span>{productNotification.length}</span>
                        </Badge>
                      )}
                    </Li>
                    <Li>
                      <Link to="/dashboard/productlist">My Products</Link>
                      {console.log("product", productNotification)}

                      {productNotification.length > 0 && (
                        <Badge>
                          <span>{productNotification.length}</span>
                        </Badge>
                      )}
                    </Li>

                    <Li>
                      <Link to="/cart?wishlist=true">
                        Wishlist{" "}
                        <span style={{ color: "var(--orange-color)" }}>
                          ({user?.saved?.length})
                        </span>
                      </Link>
                      {productNotification.length > 0 && (
                        <Badge>
                          <span>{productNotification.length}</span>
                        </Badge>
                      )}
                    </Li>
                    <Li>
                      <Link to="/dashboard">Dashboard</Link>
                    </Li>
                    <li onClick={() => signoutHandler()}>Log Out</li>
                    <Li>
                      <RedirectButton />
                    </Li>
                  </ul>
                </ProfileMenu>
              )}
            </ProfileCont>
          ) : (
            <SignIn>
              <Link to="signin">SIGN IN / SIGN UP</Link>
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
                      return (
                        <SubCategoryItemS>
                          <a href={`/search?query=${s.name}`}>{s.name}</a>
                        </SubCategoryItemS>
                      );
                    } else {
                      return (
                        <Group>
                          <SubCategoryItem>{s.name}</SubCategoryItem>
                          <UList>
                            {s.items.map((l) => (
                              <a href={`/search?query=${l}`}>
                                <SList>{l}</SList>
                              </a>
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
