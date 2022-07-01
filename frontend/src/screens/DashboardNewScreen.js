import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Home from '../component/dashboard/Home';
import NewProduct from '../component/dashboard/NewProduct';
import OrderList from '../component/dashboard/OrderList';
import Product from '../component/dashboard/Product';
import ProductList from '../component/dashboard/ProductList';
import Sidebar from '../component/dashboard/Sidebar';
import Analytics from '../component/dashboard/Analytics';
import User from '../component/dashboard/User';
import UserList from '../component/dashboard/UserList';
import { Store } from '../Store';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';
import Categories from '../component/dashboard/Categories';
import Transactions from '../component/dashboard/Transactions';
import Saleslist from '../component/dashboard/Saleslist';

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
      case 'categories':
        return <Categories />;
      case 'newproduct':
        return <NewProduct />;
      case 'productlist':
        return <ProductList />;
      case 'orderlist':
        return <OrderList />;
      case 'product':
        return <Product />;
      case 'analytics':
        return <Analytics />;
      case 'wallet':
        return <Transactions />;
      case 'saleslist':
        return <Saleslist />;
      default:
        break;
    }
  };
  return (
    <Container>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <Sidebar current={tab} />
      {tabSwitch(displayTab)}
    </Container>
  );
}
