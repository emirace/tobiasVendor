import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateLeft,
  faArrowRotateRight,
  faBasketShopping,
  faBell,
  faChartBar,
  faChartColumn,
  faChartLine,
  faComment,
  faEnvelope,
  faGift,
  faHome,
  faHouse,
  faListCheck,
  faMessage,
  faMoneyBill,
  faMoneyBillTransfer,
  faQuestionCircle,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Store } from "../../Store";
import { Badge } from "../Navbar";

const Container = styled.div`
  flex: 1;
  height: calc(100vh-168px);
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  position: sticky;
  border-radius: 0.2rem;
  top: 168px;
  margin-bottom: 20px;
  @media (max-width: 992px) {
    display: none;
  }
`;
const Wrapper = styled.div`
  padding: 20px;
  border-radius: 0.2rem;
`;
const Menu = styled.div`
  margin-bottom: 10px;
`;
const Title = styled.h3`
  font-size: 14px;
`;
const List = styled.ul`
  padding: 5px;
`;
const ListItem = styled.li`
  position: relative;
  padding: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-top-right-radius: 0.2rem;
  border-bottom-right-radius: 0.2rem;
  &.active,
  &:hover {
    border-left: 2px solid var(--orange-color);
    background: ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev3)"};
  }
  & svg {
    margin-right: 5px;
    max-width: 14px;
  }
`;

export default function Sidebar({ current }) {
  const { state } = useContext(Store);
  const { mode, userInfo, notifications } = state;

  const messageNotification = notifications.filter(
    (x) => x.notifyType === "message"
  );
  const purchaseNotification = notifications.filter(
    (x) => x.notifyType === "purchase"
  );
  const soldNotification = notifications.filter((x) => x.notifyType === "sold");
  const sellerReturnNotification = notifications.filter(
    (x) => x.notifyType === "sellerreturn"
  );
  const buyerReturnNotification = notifications.filter(
    (x) => x.notifyType === "buyerreturn"
  );
  const productNotification = notifications.filter(
    (x) => x.notifyType === "product"
  );
  return (
    <Container mode={mode}>
      <Wrapper>
        <Menu>
          <Title>Dashboard</Title>
          <List>
            <Link to="/dashboard/home">
              <ListItem
                mode={mode}
                className={current === "home" ? "active" : ""}
              >
                <FontAwesomeIcon icon={faHouse} /> Home
              </ListItem>
            </Link>

            <Link to="/dashboard/productlist">
              <ListItem
                mode={mode}
                className={current === "productlist" ? "active" : ""}
              >
                <FontAwesomeIcon icon={faBasketShopping} /> My Products
                {productNotification.length > 0 && (
                  <Badge style={{ top: "50%", transform: "translateY(-50%)" }}>
                    <span>{productNotification.length}</span>
                  </Badge>
                )}
              </ListItem>
            </Link>
            <Link to="/dashboard/orderlist">
              <ListItem
                mode={mode}
                className={current === "sales" ? "active" : ""}
              >
                <FontAwesomeIcon icon={faChartBar} /> Purchase Orders
                {purchaseNotification.length > 0 && (
                  <Badge style={{ top: "50%", transform: "translateY(-50%)" }}>
                    <span>{purchaseNotification.length}</span>
                  </Badge>
                )}
              </ListItem>
            </Link>
            <Link to="/dashboard/saleslist">
              <ListItem
                mode={mode}
                className={current === "sales" ? "active" : ""}
              >
                <FontAwesomeIcon icon={faChartBar} /> Sold Orders
                {soldNotification.length > 0 && (
                  <Badge style={{ top: "50%", transform: "translateY(-50%)" }}>
                    <span>{soldNotification.length}</span>
                  </Badge>
                )}
              </ListItem>
            </Link>

            <Link to="/dashboard/sellerreturns">
              <ListItem
                mode={mode}
                className={current === "returns" ? "active" : ""}
              >
                <FontAwesomeIcon icon={faArrowRotateLeft} />
                Sold Returns
                {sellerReturnNotification.length > 0 && (
                  <Badge style={{ top: "50%", transform: "translateY(-50%)" }}>
                    <span>{sellerReturnNotification.length}</span>
                  </Badge>
                )}
              </ListItem>
            </Link>
            <Link to="/dashboard/buyerreturns">
              <ListItem
                mode={mode}
                className={current === "returns" ? "active" : ""}
              >
                <FontAwesomeIcon icon={faArrowRotateRight} />
                Purchase Returns
                {buyerReturnNotification.length > 0 && (
                  <Badge style={{ top: "50%", transform: "translateY(-50%)" }}>
                    <span>{buyerReturnNotification.length}</span>
                  </Badge>
                )}
              </ListItem>
            </Link>
            <Link to="/dashboard/wallet">
              <ListItem
                mode={mode}
                className={current === "transactions" ? "active" : ""}
              >
                <FontAwesomeIcon icon={faMoneyBillTransfer} />
                My Wallet
              </ListItem>
            </Link>

            <Link to="/dashboard/alltransaction">
              <ListItem
                mode={mode}
                className={current === "transactionlist" ? "active" : ""}
              >
                <FontAwesomeIcon icon={faMoneyBill} />
                All Transactions
              </ListItem>
            </Link>
          </List>
        </Menu>
        <Menu>
          <Title>Quick Menu</Title>
          <List>
            <Link to="/dashboard/address">
              <ListItem
                mode={mode}
                className={current === "address" ? "active" : ""}
              >
                <FontAwesomeIcon icon={faHome} /> Address Book
              </ListItem>
            </Link>
            <Link to="/dashboard/coupon">
              <ListItem
                mode={mode}
                className={current === "coupon" ? "active" : ""}
              >
                <FontAwesomeIcon icon={faGift} /> Coupon/Gift
              </ListItem>
            </Link>
          </List>
        </Menu>
        {userInfo.isAdmin && (
          <Menu>
            <Title>Admin</Title>
            <List>
              <Link to="/dashboard/analytics">
                <ListItem
                  mode={mode}
                  className={current === "analytics" ? "active" : ""}
                >
                  <FontAwesomeIcon icon={faChartLine} /> Analytics
                </ListItem>
              </Link>
              <Link to="/dashboard/userlist">
                <ListItem
                  mode={mode}
                  className={current === "userlist" ? "active" : ""}
                >
                  <FontAwesomeIcon icon={faUser} /> Users
                </ListItem>
              </Link>
              <ListItem
                mode={mode}
                className={current === "report" ? "active" : ""}
              >
                <FontAwesomeIcon icon={faChartColumn} /> Reports
              </ListItem>

              <Link to="/dashboard/categories">
                <ListItem
                  mode={mode}
                  className={current === "categories" ? "active" : ""}
                >
                  <FontAwesomeIcon icon={faListCheck} /> Categories
                </ListItem>
              </Link>

              <Link to="/dashboard/articles">
                <ListItem
                  mode={mode}
                  className={current === "articles" ? "active" : ""}
                >
                  <FontAwesomeIcon icon={faQuestionCircle} /> Articles
                </ListItem>
              </Link>

              <Link to="/dashboard/messages">
                <ListItem
                  mode={mode}
                  className={current === "messages" ? "active" : ""}
                >
                  <FontAwesomeIcon icon={faEnvelope} /> All Messages
                </ListItem>
              </Link>
              <Link to="/dashboard/allreturns">
                <ListItem
                  mode={mode}
                  className={current === "allreturns" ? "active" : ""}
                >
                  <FontAwesomeIcon icon={faArrowRotateLeft} />
                  Return Querries
                </ListItem>
              </Link>
              <Link to="/dashboard/logreturns">
                <ListItem
                  mode={mode}
                  className={current === "logreturns" ? "active" : ""}
                >
                  <FontAwesomeIcon icon={faArrowRotateLeft} />
                  All Logged Returns
                </ListItem>
              </Link>

              <Link to="/dashboard/payments">
                <ListItem
                  mode={mode}
                  className={current === "payments" ? "active" : ""}
                >
                  <FontAwesomeIcon icon={faMoneyBill} />
                  Payments
                </ListItem>
              </Link>
              <Link to="/dashboard/transactionlist">
                <ListItem
                  mode={mode}
                  className={current === "transactionlist" ? "active" : ""}
                >
                  <FontAwesomeIcon icon={faMoneyBill} />
                  All Transactions
                </ListItem>
              </Link>
              <Link to="/dashboard/newsletter">
                <ListItem
                  mode={mode}
                  className={current === "newsletter" ? "active" : ""}
                >
                  <FontAwesomeIcon icon={faMoneyBill} />
                  Collected Email
                </ListItem>
              </Link>
              <Link to="/dashboard/otherbrand">
                <ListItem
                  mode={mode}
                  className={current === "otherbrand" ? "active" : ""}
                >
                  <FontAwesomeIcon icon={faQuestionCircle} />
                  Other brands
                </ListItem>
              </Link>
              <Link to="/dashboard/contact">
                <ListItem
                  mode={mode}
                  className={current === "contact" ? "active" : ""}
                >
                  <FontAwesomeIcon icon={faEnvelope} />
                  Contact Us
                </ListItem>
              </Link>
            </List>
          </Menu>
        )}
        <Menu>
          <Title>Notification</Title>
          <List>
            <Link to="/messages">
              <ListItem
                className={current === "message" ? "active" : ""}
                mode={mode}
              >
                <FontAwesomeIcon icon={faMessage} /> Messages
                {messageNotification.length > 0 && (
                  <Badge style={{ top: "50%", transform: "translateY(-50%)" }}>
                    <span>{messageNotification.length}</span>
                  </Badge>
                )}
              </ListItem>
            </Link>
            <Link to="/articles">
              <ListItem
                mode={mode}
                className={current === "support" ? "active" : ""}
              >
                <FontAwesomeIcon icon={faComment} /> Support Center
              </ListItem>
            </Link>
            {/* <ListItem
              mode={mode}
              className={current === 'notification' ? 'active' : ''}
            >
              <FontAwesomeIcon icon={faBell} /> Notification
            </ListItem> */}
          </List>
        </Menu>
      </Wrapper>
    </Container>
  );
}
