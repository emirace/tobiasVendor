import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Home from '../component/dashboard/Home';
import NewProduct from '../component/dashboard/NewProduct';
import Newuser from '../component/dashboard/Newuser';
import OrderList from '../component/dashboard/OrderList';
import Product from '../component/dashboard/Product';
import ProductList from '../component/dashboard/ProductList';
import Sidebar from '../component/dashboard/Sidebar';
import User from '../component/dashboard/User';
import UserList from '../component/dashboard/UserList';
import { Store } from '../Store';
import { getError } from '../utils';

const Container = styled.div`
  display: flex;
  margin-top: 10px;
`;

export default function DashboardNewScreen() {
  const params = useParams();
  const { tab } = params;
  const [displayTab, setDisplayTab] = useState('home');

  useEffect(() => {
    if (tab) {
      setDisplayTab(tab);
    }
  }, [tab]);

  const tabSwitch = (tab) => {
    switch (tab) {
      case 'home':
        return <Home />;
      case 'userlist':
        return <UserList />;
      case 'user':
        return <User />;
      case 'newuser':
        return <Newuser />;
      case 'newproduct':
        return <NewProduct />;
      case 'productlist':
        return <ProductList />;
      case 'orderlist':
        return <OrderList />;
      case 'product':
        return <Product />;
      default:
        break;
    }
  };
  return (
    <Container>
      <Sidebar current={tab} />
      {tabSwitch(displayTab)}
    </Container>
  );
}
