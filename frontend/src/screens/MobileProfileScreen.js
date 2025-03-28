import {
  faArrowRotateLeft,
  faBasketShopping,
  faChartBar,
  faChartColumn,
  faChartLine,
  faComment,
  faEnvelope,
  faGear,
  faGift,
  faHeart,
  faHome,
  faListCheck,
  faMailBulk,
  faMessage,
  faMoneyBill,
  faMoneyBillTransfer,
  faQuestion,
  faQuestionCircle,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Store } from "../Store";
import secureLocalStorage from "react-secure-storage";
import { getError } from "../utils";
import axios from "axios";
import { logout } from "../hooks/initFacebookSdk";
import RedirectButton from "../component/RedirectButton";
import mixpanel from "mixpanel-browser";

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
    padding: 100px 15px 55px 15px;
  }
`;

const MobileMenuItem = styled.div`
  border-bottom: 1px solid rgba(99, 91, 91, 0.2);
  padding: 10px 10px;
  border-radius: 0.2rem;
  position: relative;
  & svg {
    margin-right: 10px;
  }
  &:hover {
    background: var(--orange-color);
  }
`;

const AdsImage = styled.img.attrs({
  src: "/images/p8.png",
  alt: "ads",
})`
  width: 100vw;
  height: 100px;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
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
    content: "";
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    background: #fff;
    transition: 0.5s;
  }
`;

const Label = styled.label.attrs({
  for: "darkmodeSwitch",
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
const SectionTitle = styled.div`
  padding: 10px;
  text-transform: uppercase;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev3)"};
`;
const Logout = styled.div`
  margin: 20px;
  text-align: center;
  & svg {
    margin-right: 10px;
  }
`;

const Welcome = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: var(--orange-color);
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
  /* position: absolute;
  right: 20px;
  top: 5px; */
  cursor: default;
`;

export default function MobileProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo, refresher, notifications } = state;

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

  const signoutHandler = () => {
    logout();
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    mixpanel.reset();
    window.location.href = "/signin";
  };

  const darkMode = (mode) => {
    if (mode) {
      ctxDispatch({ type: "CHANGE_MODE", payload: "pagebodydark" });
      localStorage.setItem("mode", "pagebodydark");
    } else {
      ctxDispatch({ type: "CHANGE_MODE", payload: "pagebodylight" });
      localStorage.setItem("mode", "pagebodylight");
    }
  };

  const purchaseNotification = notifications.filter(
    (x) => x.notifyType === "purchase" && x.read === false
  );
  const soldNotification = notifications.filter(
    (x) => x.notifyType === "sold" && x.read === false
  );
  const buyerReturnNotification = notifications.filter(
    (x) => x.notifyType === "buyerreturn" && x.read === false
  );
  const sellerReturnNotification = notifications.filter(
    (x) => x.notifyType === "sellerreturn" && x.read === false
  );
  const productNotification = notifications.filter(
    (x) => x.notifyType === "product" && x.read === false
  );
  const contactNotification = notifications.filter(
    (x) => x.notifyType === "contactus" && x.read === false
  );

  return (
    <Container className={mode}>
      <AdsImage />
      <SwitchCont>
        <Switch
          checked={mode === "pagebodydark"}
          onChange={(e) => darkMode(e.target.checked)}
        ></Switch>
        <Label>{mode === "pagebodydark" ? "DarkMode" : "LightMode"}</Label>
      </SwitchCont>
      <Welcome>Hi {userInfo?.username}</Welcome>
      <SectionTitle mode={mode}>Dashboard</SectionTitle>{" "}
      <Link to={`/seller/${userInfo._id}`}>
        <MobileMenuItem>
          <FontAwesomeIcon icon={faUser} />
          My Profile
        </MobileMenuItem>
      </Link>
      <Link to="/dashboard">
        <MobileMenuItem>
          <FontAwesomeIcon icon={faHome} />
          Home
        </MobileMenuItem>
      </Link>
      <Link to="/dashboard/productlist">
        <MobileMenuItem>
          <FontAwesomeIcon icon={faBasketShopping} />
          My Products
          {productNotification.length > 0 && (
            <Badge>
              <span>{productNotification.length}</span>
            </Badge>
          )}
        </MobileMenuItem>
      </Link>
      <Link to="/dashboard/orderlist">
        <MobileMenuItem>
          <FontAwesomeIcon icon={faChartBar} />
          Purchased Orders
          {purchaseNotification.length > 0 && (
            <Badge>
              <span>{purchaseNotification.length}</span>
            </Badge>
          )}
        </MobileMenuItem>
      </Link>
      <Link to="/dashboard/saleslist">
        <MobileMenuItem>
          <FontAwesomeIcon icon={faChartBar} />
          Sold Orders
          {soldNotification.length > 0 && (
            <Badge>
              <span>{soldNotification.length}</span>
            </Badge>
          )}
        </MobileMenuItem>
      </Link>
      <Link to="/earning">
        <MobileMenuItem>
          <FontAwesomeIcon icon={faMoneyBillTransfer} />
          My Earnings
        </MobileMenuItem>
      </Link>
      <Link to="/cart?wishlist=true">
        <MobileMenuItem>
          <FontAwesomeIcon icon={faHeart} />
          My Wishlist{" "}
          <span style={{ color: "var(--orange-color)" }}>
            ({user?.saved?.length})
          </span>
        </MobileMenuItem>
      </Link>
      <Link to="/dashboard/sellerreturns">
        <MobileMenuItem>
          <FontAwesomeIcon icon={faArrowRotateLeft} />
          Sold Returns
          {sellerReturnNotification.length > 0 && (
            <Badge>
              <span>{sellerReturnNotification.length}</span>
            </Badge>
          )}
        </MobileMenuItem>
      </Link>
      <Link to="/dashboard/buyerreturns">
        <MobileMenuItem>
          <FontAwesomeIcon icon={faArrowRotateLeft} />
          Purchase Returns
          {buyerReturnNotification.length > 0 && (
            <Badge>
              <span>{buyerReturnNotification.length}</span>
            </Badge>
          )}
        </MobileMenuItem>
      </Link>
      <Link to="/dashboard/wallet">
        <MobileMenuItem>
          <FontAwesomeIcon icon={faMoneyBillTransfer} />
          My Wallet
        </MobileMenuItem>
      </Link>
      <Link to="/dashboard/alltransaction">
        <MobileMenuItem>
          <FontAwesomeIcon icon={faMoneyBill} />
          All Transactions
        </MobileMenuItem>
      </Link>
      <SectionTitle mode={mode}>Quick Menu</SectionTitle>
      <Link to="/dashboard/address">
        <MobileMenuItem>
          <FontAwesomeIcon icon={faHome} />
          Address Book
        </MobileMenuItem>
      </Link>
      <Link to="/dashboard/coupon">
        <MobileMenuItem>
          <FontAwesomeIcon icon={faGift} />
          Coupon/Gift
        </MobileMenuItem>
      </Link>
      {userInfo.isAdmin && (
        <>
          <SectionTitle mode={mode}>Admin</SectionTitle>
          <Link to="/dashboard/analytics">
            <MobileMenuItem>
              <FontAwesomeIcon icon={faChartLine} />
              Analytics
            </MobileMenuItem>
          </Link>
          <Link to="/dashboard/userlist">
            <MobileMenuItem>
              <FontAwesomeIcon icon={faUser} />
              Users
            </MobileMenuItem>
          </Link>{" "}
          <Link to="/messages">
            <MobileMenuItem>
              <FontAwesomeIcon icon={faChartColumn} />
              Reports
            </MobileMenuItem>
          </Link>
          <Link to="/dashboard/categories">
            <MobileMenuItem>
              <FontAwesomeIcon icon={faListCheck} />
              Categories
            </MobileMenuItem>
          </Link>
          <Link to="/dashboard/articles">
            <MobileMenuItem>
              <FontAwesomeIcon icon={faQuestion} />
              Articles
            </MobileMenuItem>
          </Link>
          <Link to="/dashboard/messages">
            <MobileMenuItem>
              <FontAwesomeIcon icon={faEnvelope} />
              All Messages
            </MobileMenuItem>
          </Link>
          <Link to="/dashboard/allreturns">
            <MobileMenuItem>
              <FontAwesomeIcon icon={faArrowRotateLeft} />
              Return Querries
            </MobileMenuItem>
          </Link>
          <Link to="/dashboard/logreturns">
            <MobileMenuItem>
              <FontAwesomeIcon icon={faArrowRotateLeft} />
              All Logged Returns
            </MobileMenuItem>
          </Link>
          <Link to="/dashboard/payments">
            <MobileMenuItem>
              <FontAwesomeIcon icon={faMoneyBill} />
              Payments
            </MobileMenuItem>
          </Link>
          <Link to="/dashboard/transactionlist">
            <MobileMenuItem>
              <FontAwesomeIcon icon={faMoneyBill} />
              All Transactions
            </MobileMenuItem>
          </Link>
          <Link to="/dashboard/newsletter">
            <MobileMenuItem>
              <FontAwesomeIcon icon={faMailBulk} />
              Collected Email
            </MobileMenuItem>
          </Link>
          <Link to="/dashboard/otherbrand">
            <MobileMenuItem>
              <FontAwesomeIcon icon={faQuestionCircle} />
              Other Brand
            </MobileMenuItem>
          </Link>
          <Link to="/dashboard/contact">
            <MobileMenuItem>
              <FontAwesomeIcon icon={faEnvelope} />
              Contact Us
              {contactNotification.length > 0 && (
                <Badge>
                  <span>{contactNotification.length}</span>
                </Badge>
              )}
            </MobileMenuItem>
          </Link>
        </>
      )}
      <SectionTitle mode={mode}>Chat & Info</SectionTitle>
      <Link to="/messages">
        <MobileMenuItem>
          <FontAwesomeIcon icon={faMessage} />
          Messages
        </MobileMenuItem>
      </Link>
      <Link to="/articles">
        <MobileMenuItem>
          <FontAwesomeIcon icon={faComment} />
          Support Center
        </MobileMenuItem>
      </Link>
      <RedirectButton />
      <Logout onClick={() => signoutHandler()}>
        <FontAwesomeIcon icon={faRightFromBracket} />
        Logout
      </Logout>
    </Container>
  );
}
