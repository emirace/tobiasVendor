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
import User from '../component/dashboard/User';
import UserList from '../component/dashboard/UserList';
import { Store } from '../Store';
import { getError } from '../utils';
import { Helmet } from 'react-helmet-async';
import Categories from '../component/dashboard/Categories';
import Transactions from '../component/dashboard/Transactions';
import Saleslist from '../component/dashboard/Saleslist';
import AddressBook from '../component/dashboard/AddressBook';
import Analytics from '../component/dashboard/admin/Analytics';
import Coupon from '../component/dashboard/Coupon';
import Earning from '../component/dashboard/admin/Earning';
import AllMessages from '../component/dashboard/admin/AllMessages';
import AllReturns from '../component/dashboard/AllReturns';
import SoldReturn from '../component/dashboard/SoldReturn';
import AllReturnsLogs from '../component/dashboard/AllReturnsLogs';
import Payments from '../component/dashboard/Payments';
import TransactionList from '../component/dashboard/TransactionList';
import NewsletterList from '../component/dashboard/NewsletterList';
import TransactionListUser from '../component/dashboard/TransactionListUser';
import OtherBrand from '../component/dashboard/OtherBrand';
import PurchaseReturn from '../component/dashboard/PurchaseReturn';
import Articles from '../component/dashboard/Articles';
import ContactUs from '../component/dashboard/ContactUs';

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
      case 'articles':
        return <Articles />;
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
      case 'address':
        return <AddressBook />;
      case 'earning':
        return <Earning />;
      case 'coupon':
        return <Coupon />;
      case 'messages':
        return <AllMessages />;
      case 'allreturns':
        return <AllReturns />;
      case 'sellerreturns':
        return <SoldReturn />;
      case 'buyerreturns':
        return <PurchaseReturn />;
      case 'logreturns':
        return <AllReturnsLogs />;
      case 'payments':
        return <Payments />;
      case 'transactionlist':
        return <TransactionList />;
      case 'alltransaction':
        return <TransactionListUser />;
      case 'newsletter':
        return <NewsletterList />;
      case 'otherbrand':
        return <OtherBrand />;
      case 'contact':
        return <ContactUs />;
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
