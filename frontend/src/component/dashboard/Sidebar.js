import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBasketShopping,
  faBell,
  faChartBar,
  faChartColumn,
  faChartLine,
  faComment,
  faHome,
  faHouse,
  faListCheck,
  faMessage,
  faMoneyBillTransfer,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { Store } from "../../Store";

const Container = styled.div`
  flex: 1;
  height: calc(100vh-168px);
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  position: sticky;
  border-radius: 0.2rem;
  top: 168px;
  @media (max-width: 992px) {
    display: none;
  }
`;
const Wrapper = styled.div`
  padding: 20px;
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
  padding: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 0.2rem;
  &.active,
  &:hover {
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
  const { mode, userInfo } = state;
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
            {userInfo.isAdmin && (
              <Link to="/dashboard/analytics">
                <ListItem
                  mode={mode}
                  className={current === "analytics" ? "active" : ""}
                >
                  <FontAwesomeIcon icon={faChartLine} /> Analytics
                </ListItem>
              </Link>
            )}
            <Link to="/dashboard/orderlist">
              <ListItem
                mode={mode}
                className={current === "sales" ? "active" : ""}
              >
                <FontAwesomeIcon icon={faChartBar} /> Orders
              </ListItem>
            </Link>
            <Link to="/dashboard/saleslist">
              <ListItem
                mode={mode}
                className={current === "sales" ? "active" : ""}
              >
                <FontAwesomeIcon icon={faChartBar} /> Sales
              </ListItem>
            </Link>
          </List>
        </Menu>
        <Menu>
          <Title>Quick Menu</Title>
          <List>
            {userInfo.isAdmin && (
              <Link to="/dashboard/userlist">
                <ListItem
                  mode={mode}
                  className={current === "userlist" ? "active" : ""}
                >
                  <FontAwesomeIcon icon={faUser} /> Users
                </ListItem>
              </Link>
            )}

            <Link to="/dashboard/productlist">
              <ListItem
                mode={mode}
                className={current === "productlist" ? "active" : ""}
              >
                <FontAwesomeIcon icon={faBasketShopping} /> Products
              </ListItem>
            </Link>
            <Link to="/dashboard/wallet">
              <ListItem
                mode={mode}
                className={current === "transactions" ? "active" : ""}
              >
                <FontAwesomeIcon icon={faMoneyBillTransfer} /> Transactions
              </ListItem>
            </Link>
            <Link to="/dashboard/address">
              <ListItem
                mode={mode}
                className={current === "address" ? "active" : ""}
              >
                <FontAwesomeIcon icon={faHome} /> Address Book
              </ListItem>
            </Link>
            {userInfo.isAdmin && (
              <ListItem
                mode={mode}
                className={current === "report" ? "active" : ""}
              >
                <FontAwesomeIcon icon={faChartColumn} /> Reports
              </ListItem>
            )}
            {userInfo.isAdmin && (
              <Link to="/dashboard/categories">
                <ListItem
                  mode={mode}
                  className={current === "categories" ? "active" : ""}
                >
                  <FontAwesomeIcon icon={faListCheck} /> Categories
                </ListItem>
              </Link>
            )}
          </List>
        </Menu>
        <Menu>
          <Title>Notification</Title>
          <List>
            <Link to="/messages">
              <ListItem
                className={current === "message" ? "active" : ""}
                mode={mode}
              >
                <FontAwesomeIcon icon={faMessage} /> Messages
              </ListItem>
            </Link>
            <ListItem
              mode={mode}
              className={current === "support" ? "active" : ""}
            >
              <FontAwesomeIcon icon={faComment} /> Support
            </ListItem>
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
