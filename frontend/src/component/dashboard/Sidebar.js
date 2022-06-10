import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBasketShopping,
  faBell,
  faChartBar,
  faChartColumn,
  faChartLine,
  faComment,
  faHouse,
  faMessage,
  faMoneyBillTransfer,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Container = styled.div`
  flex: 1;
  height: calc(100vh-168px);
  background: var(--dark-ev1);
  position: sticky;
  border-radius: 0.2rem;
  top: 168px;
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
    background: var(--dark-ev2);
  }
  & svg {
    margin-right: 5px;
    max-width: 14px;
  }
`;

export default function Sidebar({ setDisplayTab }) {
  return (
    <Container>
      <Wrapper>
        <Menu>
          <Title>Dashboard</Title>
          <List>
            <Link to="/dashboard/home">
              <ListItem
                className="active"
                onClick={() => setDisplayTab('home')}
              >
                <FontAwesomeIcon icon={faHouse} /> Home
              </ListItem>
            </Link>
            <ListItem>
              <FontAwesomeIcon icon={faChartLine} /> Analytics
            </ListItem>
            <ListItem>
              <FontAwesomeIcon icon={faChartBar} /> Sales
            </ListItem>
          </List>
        </Menu>
        <Menu>
          <Title>Quick Menu</Title>
          <List>
            <Link to="/dashboard/userlist">
              <ListItem className="">
                <FontAwesomeIcon icon={faUser} /> Users
              </ListItem>
            </Link>
            <Link to="/dashboard/productlist">
              <ListItem>
                <FontAwesomeIcon icon={faBasketShopping} /> Products
              </ListItem>
            </Link>
            <ListItem>
              <FontAwesomeIcon icon={faMoneyBillTransfer} /> Transactions
            </ListItem>
            <ListItem>
              <FontAwesomeIcon icon={faChartColumn} /> Reports
            </ListItem>
          </List>
        </Menu>
        <Menu>
          <Title>Notification</Title>
          <List>
            <ListItem className="">
              <FontAwesomeIcon icon={faMessage} /> Messages
            </ListItem>
            <ListItem>
              <FontAwesomeIcon icon={faComment} /> Support
            </ListItem>
            <ListItem>
              <FontAwesomeIcon icon={faBell} /> Notification
            </ListItem>
          </List>
        </Menu>
      </Wrapper>
    </Container>
  );
}
