import './App.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import ProductsScreen from './screens/ProductsScreen';
import ProductScreen from './screens/ProductScreen';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBagShopping,
  faCircleHalfStroke,
  faEnvelope,
  faGear,
  faHeart,
  faRightFromBracket,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import Navbar from './component/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useRef, useState } from 'react';
import { Store } from './Store';
import CartScreen from './screens/CartScreen';
import SigninScreen from './screens/SigninScreen';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import OrderHistoryScreen from './screens/OrderHistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import Button from 'react-bootstrap/Button';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './component/SearchBox';
import SearchSceen from './screens/SearchSceen';
import DashboardScreen from './screens/DashboardScreen';
import HomeScreen from './screens/HomeScreen';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Footer from './component/Footer';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import CategoryMobileScreen from './screens/CategoryMobileScreen';
import UserListScreen from './screens/UserListScreen';
import MyAccountScreen from './screens/MyAccountScreen';
import UserEditScreen from './screens/UserEditScreen';
import SellerScreen from './screens/SellerScreen';
import ProductCreateScreen from './screens/ProductCreateScreen';
import StickyNav from './component/StickyNav';
import styled from 'styled-components';
import {
  AdminRoute,
  CartNotEmpty,
  IsPaymentMethod,
  IsShippingAdd,
  ProtectedRoute,
  SellerRoute,
} from './component/ProtectedRoute';
import ScrollToTop from './component/ScrollToTop';
import ChatScreen from './screens/ChatScreen';
import InfoScreen from './screens/InfoScreen';
import MobileProfileScreen from './screens/MobileProfileScreen';
import Notification from './component/Notification';

const NavCont = styled.div`
  position: relation;
`;
const Switch = styled.input.attrs({
  type: 'checkbox',
  id: 'darkmodeSwitch',
  role: 'switch',
})`
  position: absolute;
  top: 10px;
  left: 20px;
  width: 40px;
  height: 15px;
  -webkit-appearance: none;
  background: #fff;
  border-radius: 20px;
  outline: none;
  transition: 0.5s;
  @media (max-width: 992px) {
    display: none;
  }

  &:checked {
    &:before {
      left: 25px;
    }
  }
  &:before {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    background: var(--malon-color);
    transition: 0.5s;
  }
`;

const Label = styled.label.attrs({
  for: 'darkmodeSwitch',
})`
  color: #fff;
  margin-left: 5px;
  position: absolute;
  top: 5px;
  left: 60px;
  @media (max-width: 992px) {
    display: none;
  }
`;

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo, mode } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/products/categories');
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, [mode]);

  const darkMode = (mode) => {
    if (mode) {
      ctxDispatch({ type: 'CHANGE_MODE', payload: 'pagebodydark' });
      localStorage.setItem('mode', 'pagebodydark');
    } else {
      ctxDispatch({ type: 'CHANGE_MODE', payload: 'pagebodylight' });
      localStorage.setItem('mode', 'pagebodylight');
    }
  };

  const [modelRef1, setmodelRef1] = useState();
  const [menu, setMymenu] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const [textNotification, setTextNotification] = useState(true);
  const [buttonNotification, setButtonNotification] = useState(true);

  const closeModel = (e) => {
    if (modelRef1 !== e.target) {
      setMymenu(false);
    } else {
      setMymenu(!menu);
    }
  };
  const changeRef = (res) => {
    setmodelRef1(res);
  };
  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId="359040935611-ilvv0jgq9rfqj3io9b7av1rfgukqolbu.apps.googleusercontent.com">
        <ScrollToTop>
          <ToastContainer position="top-center" limit={1} />
          <div className={mode || ''} onClick={closeModel}>
            <Notification
              text={textNotification}
              buttonText={buttonNotification}
              showStatus={showNotification}
            />
            <StickyNav />
            <header style={{ background: 'inherit' }}>
              <NavCont>
                <Navbar
                  menu={menu}
                  setMymenu={setMymenu}
                  setmodelRef1={changeRef}
                />
              </NavCont>
            </header>

            <main>
              <div className="p-0 container-fluid">
                <Routes>
                  <Route path="/product/:slug" element={<ProductScreen />} />
                  <Route path="/seller/:id" element={<SellerScreen />} />
                  <Route path="/myaccount" element={<SellerScreen />} />
                  <Route path="/cart" element={<CartScreen />} />
                  <Route
                    path="/categories"
                    element={<CategoryMobileScreen />}
                  />
                  <Route path="/search" element={<SearchSceen />} />
                  <Route path="/signin" element={<SigninScreen />} />
                  <Route path="/signup" element={<SignupScreen />} />
                  <Route path="/info" element={<InfoScreen />} />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfileScreen />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/messages"
                    element={
                      <ProtectedRoute>
                        <ChatScreen />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/account"
                    element={
                      <ProtectedRoute>
                        <MyAccountScreen />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profilmenu"
                    element={
                      <ProtectedRoute>
                        <MobileProfileScreen />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/shipping"
                    element={
                      <CartNotEmpty>
                        <ShippingAddressScreen />
                      </CartNotEmpty>
                    }
                  />
                  <Route
                    path="/payment"
                    element={
                      <CartNotEmpty>
                        <IsShippingAdd>
                          <PaymentMethodScreen />
                        </IsShippingAdd>
                      </CartNotEmpty>
                    }
                  />
                  <Route
                    path="/placeorder"
                    element={
                      <CartNotEmpty>
                        <IsShippingAdd>
                          <IsPaymentMethod>
                            <PlaceOrderScreen />
                          </IsPaymentMethod>
                        </IsShippingAdd>
                      </CartNotEmpty>
                    }
                  />
                  <Route path="/order/:id" element={<OrderScreen />} />
                  <Route
                    path="/orderhistory"
                    element={
                      <ProtectedRoute>
                        <OrderHistoryScreen />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/" element={<HomeScreen />} />
                  <Route path="/home" element={<ProductsScreen />} />

                  {/* Admin Routes */}
                  <Route
                    path="/admin/dashboard"
                    element={
                      <AdminRoute>
                        <DashboardScreen />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/product"
                    element={
                      <AdminRoute>
                        <ProductListScreen />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/product/:id"
                    element={
                      <AdminRoute>
                        <ProductEditScreen />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/order"
                    element={
                      <AdminRoute>
                        <OrderListScreen />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/user"
                    element={
                      <AdminRoute>
                        <UserListScreen />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/user/:id"
                    element={
                      <AdminRoute>
                        <UserEditScreen />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/seller/product"
                    element={
                      <SellerRoute>
                        <ProductListScreen />
                      </SellerRoute>
                    }
                  />
                  <Route
                    path="/seller/product/:id"
                    element={
                      <SellerRoute>
                        <ProductEditScreen />
                      </SellerRoute>
                    }
                  />
                  <Route
                    path="/seller/order"
                    element={
                      <SellerRoute>
                        <OrderListScreen />
                      </SellerRoute>
                    }
                  />
                  <Route
                    path="/createproduct"
                    element={
                      <SellerRoute>
                        <ProductCreateScreen />
                      </SellerRoute>
                    }
                  />
                </Routes>
              </div>
            </main>
            <Footer />
            {/* <footer>
          <div className="footer-content1">
            <div className="brand-logo1">TOBIAS</div>
            <div className="footer-ul-container1">
              <ul className="category1">
                <li className="category-title1">Men</li>
                <li>
                  <a href="/#" className="footer-link1">
                    t-shirt
                  </a>
                </li>
                <li>
                  <a href="/#" className="footer-link1">
                    sweatshirts
                  </a>
                </li>
                <li>
                  <a href="/#" className="footer-link1">
                    shirts
                  </a>
                </li>
                <li>
                  <a href="/#" className="footer-link1">
                    jeans
                  </a>
                </li>
                <li>
                  <a href="/#" className="footer-link1">
                    trouser
                  </a>
                </li>
                <li>
                  <a href="/#" className="footer-link1">
                    shoed
                  </a>
                </li>
                <li>
                  <a href="/#" className="footer-link1">
                    casuals
                  </a>
                </li>
                <li>
                  <a href="/#" className="footer-link1">
                    formals
                  </a>
                </li>
                <li>
                  <a href="/#" className="footer-link1">
                    sports
                  </a>
                </li>
                <li>
                  <a href="/#" className="footer-link1">
                    watches
                  </a>
                </li>
              </ul>
              <ul className="category1">
                <li className="category-title1">Women</li>
                <li>
                  <a href="/#" className="footer-link1">
                    t-shirt
                  </a>
                </li>
                <li>
                  <a href="/#" className="footer-link1">
                    sweatshirts
                  </a>
                </li>
                <li>
                  <a href="/#" className="footer-link1">
                    shirts
                  </a>
                </li>
                <li>
                  <a href="/#" className="footer-link1">
                    jeans
                  </a>
                </li>
                <li>
                  <a href="/#" className="footer-link1">
                    trouser
                  </a>
                </li>
                <li>
                  <a href="/#" className="footer-link1">
                    shoed
                  </a>
                </li>
                <li>
                  <a href="/#" className="footer-link1">
                    casuals
                  </a>
                </li>
                <li>
                  <a href="/#" className="footer-link1">
                    formals
                  </a>
                </li>
                <li>
                  <a href="/#" className="footer-link1">
                    sports
                  </a>
                </li>
                <li>
                  <a href="/#" className="footer-link1">
                    watches
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <p className="footer-title1">about company</p>
          <p className="info1">
            The href attribute requires a valid value to be accessible. Provide
            a valid, navigable address as the href value. If you cannot provide
            a valid href, but still need the element to resemble a link, use a
            button and change it with appropriate styles. Learn more The href
            attribute requires a valid value to be accessible. Provide a valid,
            navigable address as the href value. If you cannot provide a valid
            href, but still need the element to resemble a link, use a button
            and change it with appropriate styles. Learn more The href attribute
            requires a valid value to be accessible. Provide a valid, navigable
            address as the href value. If you cannot provide a valid href, but
            still need the element to resemble a link, use a button and change
            it with appropriat
          </p>
          <p className="info1">
            support emails - help@compayname.com,
            customersupport@companyname.com
          </p>
          <p className="info1">telephone - 123 456 789, 987 654 321</p>
          <div className="footer-social-container1">
            <div className="">
              <a href="/#" className="social-link1">
                terms & servises
              </a>
              <a href="/#" className="social-link1">
                Privacy page
              </a>
            </div>
            <div className="">
              <a href="/#" className="social-link1">
                facebook
              </a>
              <a href="/#" className="social-link1">
                instagram
              </a>
              <a href="/#" className="social-link1">
                tweeter
              </a>
            </div>
          </div>
          <p classname="footer-credit1">
            Conpany, Best apeal fashion market place
          </p>
        </footer> */}
            {/* </div> */}
          </div>
        </ScrollToTop>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}

export default App;
