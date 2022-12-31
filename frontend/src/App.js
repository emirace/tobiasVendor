import "./App.css";
import "./style/button.css";
import "./style/Cart.css";
import "./style/CategoryListing.css";
import "./style/Footer.css";
import "./style/HomeScreen.css";
import "./style/Newsletter.css";
import "./style/ProductScreen.css";
import "./style/SearchScreen.css";
import "./style/SellerScreen.css";
import "./style/StickyNav.css";

import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faCircleHalfStroke,
  faEnvelope,
  faGear,
  faHeart,
  faRightFromBracket,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import Navbar from "./component/Navbar";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import Badge from "react-bootstrap/Badge";
import Container from "react-bootstrap/Container";
import { LinkContainer } from "react-router-bootstrap";
import { lazy, Suspense, useContext, useEffect, useRef, useState } from "react";
import { Store } from "./Store";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "react-bootstrap/Button";
import { baseURL, getError, region } from "./utils";
import axios from "axios";
import SearchBox from "./component/SearchBox";
import Footer from "./component/Footer";
import DashboardScreen from "./screens/DashboardScreen";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import OrderListScreen from "./screens/OrderListScreen";
import UserListScreen from "./screens/UserListScreen";
import MyAccountScreen from "./screens/MyAccountScreen";
import UserEditScreen from "./screens/UserEditScreen";

import ProductCreateScreen from "./screens/ProductCreateScreen";
import StickyNav from "./component/StickyNav";
import styled from "styled-components";
import {
  AdminRoute,
  CartNotEmpty,
  IsActive,
  IsPaymentMethod,
  IsShippingAdd,
  IsVerifyAddress,
  IsVerifyBank,
  IsVerifyEmail,
  ProtectedRoute,
  SellerRoute,
} from "./component/ProtectedRoute";
import ScrollToTop from "./component/ScrollToTop";
import Notification from "./component/Notification";
import ToastNotification from "./component/ToastNotification";
import { io } from "socket.io-client";
import OrderListAdmin from "./component/dashboard/admin/OrderList";
import ProductListAdmin from "./component/dashboard/admin/ProductList";
import OutOfStock from "./component/dashboard/admin/OutOfStock";

import Bundle from "./component/info/Bundle";
import useGeoLocation from "./hooks/useGeoLocation";
import LoadingPage from "./component/LoadingPage";
import ForgetScreen from "./screens/ForgetScreen";
import ResetScreen from "./screens/ResetScreen";
import VerifyEmailScreen from "./screens/VerifyEmailScreen";
import EmailConfirmationScreen from "./screens/successPage/EmailConfirmationScreen";
import initFacebookSdk, { logout } from "./hooks/initFacebookSdk";
import VerifyAccountScreen from "./screens/VerifyAccountScreen";
import PaymentScreen from "./screens/PaymentScreen";
import TransactionScreen from "./screens/TransactionScreen";
import ContactUsPage from "./screens/ContactUsPage";
import Earning from "./component/dashboard/Earning";
import Support from "./component/Support";
import Returns from "./component/info/Returns";
import VipShield from "./component/info/VipShield";
import VerifyAddressScreen from "./screens/VerifyAddressScreen";
import Terms from "./component/info/Terms";
import BanScreen from "./screens/successPage/BanScreen";
import VerifyEmailConfirmScreen from "./screens/VerifyEmailConfirmScreen";
import secureLocalStorage from "react-secure-storage";
import AcceptCookies from "./component/AcceptCookies";
import MobileNotificationScreen from "./screens/MobileNotificationScreen";
import TopSellerList from "./component/dashboard/TopSellerList";

const ProductScreen = lazy(() => import("./screens/ProductScreen"));
const CategoryMobileScreen = lazy(() =>
  import("./screens/CategoryMobileScreen")
);

const SellerScreen = lazy(() => import("./screens/SellerScreen"));
const FashionImpact = lazy(() => import("./component/info/FashionImpact"));

const CartScreen = lazy(() => import("./screens/CartScreen"));

const About = lazy(() => import("./component/info/About"));
const PolicyScreen = lazy(() => import("./screens/PolicyScreen"));

const NewProduct = lazy(() => import("./component/dashboard/NewProduct"));
const SustainabilityImpact = lazy(() =>
  import("./component/info/SustainabilityImpact")
);

const BuyersPro = lazy(() => import("./component/info/BuyersPro"));

const SellScreen = lazy(() => import("./screens/SellScreen"));

const SigninScreen = lazy(() => import("./screens/SigninScreen"));
const SigninToAddressScreen = lazy(() =>
  import("./screens/SigninToAddressScreen")
);
const SignupScreen = lazy(() => import("./screens/SignupScreen"));
const InfoScreen = lazy(() => import("./screens/InfoScreen"));
const InfoScreenNonLogin = lazy(() => import("./screens/InfoScreenNonlogin"));
const CreateOutfitScreen = lazy(() => import("./screens/CreateOutfitScreen"));

const CreateOutfitPicScreen = lazy(() =>
  import("./screens/CreateOutfitPicScreen")
);
const ChatScreen = lazy(() => import("./screens/ChatScreen"));
const MobileProfileScreen = lazy(() => import("./screens/MobileProfileScreen"));
const ShippingAddressScreen = lazy(() =>
  import("./screens/ShippingAddressScreen")
);
const PaymentMethodScreen = lazy(() => import("./screens/PaymentMethodScreen"));
const PlaceOrderScreen = lazy(() => import("./screens/PlaceOrderScreen"));
const OrderScreen = lazy(() => import("./screens/OrderScreen"));
const DashboardNewScreen = lazy(() => import("./screens/DashboardNewScreen"));
const HomeScreen = lazy(() => import("./screens/HomeScreen"));
const ProductsScreen = lazy(() => import("./screens/ProductsScreen"));
const DeliveryOptionScreen = lazy(() =>
  import("./screens/DeliveryOptionScreen")
);
const CategorypageScreen = lazy(() => import("./screens/CategorypageScreen"));
const BrandScreen = lazy(() => import("./screens/BrandScreen"));
const ShopByOutfit = lazy(() => import("./screens/ShopByOutfit"));
const SearchSceen = lazy(() => import("./screens/SearchSceen"));
const ReturnPage = lazy(() => import("./component/dashboard/admin/ReturnPage"));
// import LogRockect from 'logrocket';
// LogRockect.init('mzhw6i/tobias');

const NavCont = styled.div`
  position: relation;
`;
const Switch = styled.input.attrs({
  type: "checkbox",
  id: "darkmodeSwitch",
  role: "switch",
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
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    background: var(--malon-color);
    transition: 0.5s;
  }
`;

const Label = styled.label.attrs({
  for: "darkmodeSwitch",
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

const ENDPOINT =
  window.location.host.indexOf("localhost") >= 0
    ? "ws://127.0.0.1:5000"
    : window.location.host;

export const socket = io(ENDPOINT);
initFacebookSdk().then(App);

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, mode, notifications, cookies } = state;
  const signoutHandler = () => {
    logout();
    localStorage.removeItem("userInfo");
    ctxDispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("cartItems");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
  };
  const token = new URLSearchParams(window.location.search).get(
    "redirecttoken"
  );
  // const redirect = redirectInUrl ? redirectInUrl : "/";

  // const { search } = useLocation();
  // const sp = new URLSearchParams(search);
  // const token = sp.get("redirecttoken") || "all";

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoacation = async () => {
      console.log(token, "outside");
      try {
        if (token) {
          const { data } = await axios.put("/api/redirects", { token: token });
          if (data.success) {
            console.log(token, "i am in ");
            setLoading(false);
            ctxDispatch({ type: "SET_REDIRECT_TOKEN", payload: token });
          } else {
            window.location.href = `/`;
          }
        } else {
          const { data } = await axios.get("/api/locations");
          if (data === "ZA") {
            if (region() === "ZAR") {
              setLoading(false);
            } else {
              signoutHandler();
              // alert("redirect to coza");
              window.location.replace(`https://repeddle.co.za`);
            }
          } else {
            if (region() === "ZAR") {
              // alert("redirect to com");
              signoutHandler();
              window.location.replace(`https://repeddle.com`);
            }
            setLoading(false);
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    checkLoacation();
  }, []);

  useEffect(() => {
    if (userInfo) {
      socket.emit("onlogin", userInfo);
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo) {
      socket.emit("initial_data", { userId: userInfo._id });
      socket.on("get_data", getData);
      socket.on("change_data", changeData);
      return () => {
        socket.off("get_data");
        socket.off("change_data");
      };
    }
  }, [userInfo]);
  const getData = (notification) => {
    ctxDispatch({ type: "UPDATE_NOTIFICATIONS", payload: notification });
  };
  const changeData = () => {
    if (userInfo) {
      socket.emit("initial_data", { userId: userInfo._id });
    }
  };

  useEffect(() => {
    const getCartItems = async () => {
      if (userInfo) {
        const { data } = await axios.get("/api/cartItems", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        const items = data.map((x) => x.item);

        ctxDispatch({ type: "UPDATE_CART", payload: items });
      }
    };
    getCartItems();
  }, [userInfo]);

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/products/categories");
        setCategories(data);
      } catch (err) {
        console.log(getError(err));
      }
    };
    fetchCategories();
  }, [mode]);

  const darkMode = (mode) => {
    if (mode) {
      ctxDispatch({ type: "CHANGE_MODE", payload: "pagebodydark" });
      localStorage.setItem("mode", "pagebodydark");
    } else {
      ctxDispatch({ type: "CHANGE_MODE", payload: "pagebodylight" });
      localStorage.setItem("mode", "pagebodylight");
    }
  };

  const [modelRef1, setmodelRef1] = useState();
  const [modelRef2, setmodelRef2] = useState();
  const [menu, setMymenu] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const closeModel = (e) => {
    if (modelRef1 !== e.target) {
      setMymenu(false);
    } else {
      setMymenu(!menu);
    }
    if (modelRef2 !== e.target) {
      setShowNotification(false);
    } else {
      setShowNotification(!showNotification);
    }
  };
  const changeRef = (res) => {
    setmodelRef1(res);
  };
  const changeRef2 = (res) => {
    setmodelRef2(res);
  };

  return (
    <BrowserRouter>
      <GoogleOAuthProvider clientId="359040935611-ilvv0jgq9rfqj3io9b7av1rfgukqolbu.apps.googleusercontent.com">
        <ScrollToTop>
          <ToastContainer position="top-center" limit={1} />
          {loading ? (
            <LoadingPage />
          ) : (
            <div className={mode || ""} onClick={closeModel}>
              <Notification />
              <ToastNotification />
              <StickyNav />
              <header style={{ background: "inherit" }}>
                <NavCont>
                  <Navbar
                    menu={menu}
                    setShowNotification={setShowNotification}
                    showNotification={showNotification}
                    setMymenu={setMymenu}
                    setmodelRef1={changeRef}
                    setmodelRef2={changeRef2}
                  />
                </NavCont>
              </header>
              <main>
                <div className="p-0 container-fluid">
                  <Suspense fallback={<LoadingPage />}>
                    <Routes>
                      <Route
                        path="/product/:slug"
                        element={<ProductScreen />}
                      />
                      <Route path="/seller/:id" element={<SellerScreen />} />
                      <Route path="/earning" element={<Earning />} />
                      <Route path="/returns" element={<Returns />} />
                      <Route path="/myaccount" element={<SellerScreen />} />
                      <Route path="/cart" element={<CartScreen />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/privacypolicy" element={<PolicyScreen />} />
                      <Route
                        path="/emailsent"
                        element={<EmailConfirmationScreen />}
                      />
                      <Route
                        path="/sustainability"
                        element={<SustainabilityImpact />}
                      />
                      <Route path="/vipshield" element={<VipShield />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/protections" element={<BuyersPro />} />
                      <Route path="/rebundle" element={<Bundle />} />
                      <Route
                        path="/fashionImpact"
                        element={<FashionImpact />}
                      />
                      <Route
                        path="/categories"
                        element={<CategoryMobileScreen />}
                      />
                      <Route path="/search" element={<SearchSceen />} />
                      <Route path="/sell" element={<SellScreen />} />
                      <Route path="/signin" element={<SigninScreen />} />
                      <Route path="/contactus" element={<ContactUsPage />} />
                      <Route
                        path="/forgetpassword"
                        element={<ForgetScreen />}
                      />
                      <Route
                        path="/resetpassword/:token"
                        element={<ResetScreen />}
                      />
                      <Route
                        path="/continuesignin"
                        element={<SigninToAddressScreen />}
                      />
                      <Route path="/signup" element={<SignupScreen />} />
                      <Route path="/delivery" element={<InfoScreen />} />
                      <Route
                        path="/delivery2"
                        element={<InfoScreenNonLogin />}
                      />
                      <Route path="/outfits" element={<CreateOutfitScreen />} />
                      <Route
                        path="/createoutfits"
                        element={<CreateOutfitPicScreen />}
                      />

                      <Route
                        path="/messages"
                        element={
                          <ProtectedRoute>
                            <IsActive>
                              <ChatScreen />
                            </IsActive>
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/notifications"
                        element={
                          <ProtectedRoute>
                            <IsActive>
                              <MobileNotificationScreen />
                            </IsActive>
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/verifyaccount"
                        element={
                          <ProtectedRoute>
                            <IsActive>
                              <VerifyAccountScreen />
                            </IsActive>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/verifyaddress"
                        element={
                          <ProtectedRoute>
                            <IsActive>
                              <VerifyAddressScreen />
                            </IsActive>
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/verifyemail"
                        element={
                          <ProtectedRoute>
                            <IsActive>
                              <VerifyEmailScreen />
                            </IsActive>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/verifyemail/:token"
                        element={<VerifyEmailConfirmScreen />}
                      />
                      <Route
                        path="/banned"
                        element={
                          <ProtectedRoute>
                            <BanScreen />
                          </ProtectedRoute>
                        }
                      />
                      {/* <Route
                      path="/account"
                      element={
                        <ProtectedRoute>
                          <MyAccountScreen />
                        </ProtectedRoute>
                      } 
                    />*/}
                      <Route
                        path="/profilmenu"
                        element={
                          <ProtectedRoute>
                            <IsActive>
                              <MobileProfileScreen />
                            </IsActive>
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
                          <ProtectedRoute>
                            <IsActive>
                              <CartNotEmpty>
                                <PaymentMethodScreen />
                              </CartNotEmpty>
                            </IsActive>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/placeorder"
                        element={
                          <ProtectedRoute>
                            <IsActive>
                              <CartNotEmpty>
                                <IsPaymentMethod>
                                  <PlaceOrderScreen />
                                </IsPaymentMethod>
                              </CartNotEmpty>
                            </IsActive>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/order/:id"
                        element={
                          <ProtectedRoute>
                            <OrderScreen />
                          </ProtectedRoute>
                        }
                      />
                      {/* <Route
                      path="/orderhistory"
                      element={
                        <ProtectedRoute>
                          <OrderHistoryScreen />
                        </ProtectedRoute>
                      }
                    /> */}
                      <Route
                        path="/dashboard/:tab/:id"
                        element={
                          <ProtectedRoute>
                            <IsActive>
                              <DashboardNewScreen />
                            </IsActive>
                          </ProtectedRoute>
                        }
                      />
                      <Route path="/" element={<HomeScreen />} />
                      <Route path="/home" element={<ProductsScreen />} />

                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <IsActive>
                              <DashboardNewScreen />
                            </IsActive>
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/deliveryoption"
                        element={
                          <ProtectedRoute>
                            <DeliveryOptionScreen />
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/dashboard/:tab"
                        element={
                          <ProtectedRoute>
                            <IsActive>
                              <DashboardNewScreen />
                            </IsActive>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/newproduct"
                        element={
                          <ProtectedRoute>
                            <IsActive>
                              <IsVerifyEmail>
                                <IsVerifyBank>
                                  <IsVerifyAddress>
                                    <NewProduct />
                                  </IsVerifyAddress>
                                </IsVerifyBank>
                              </IsVerifyEmail>
                            </IsActive>
                          </ProtectedRoute>
                        }
                      />

                      <Route
                        path="/category/:name"
                        element={<CategorypageScreen />}
                      />

                      <Route path="/brand" element={<BrandScreen />} />
                      <Route path="/recurated" element={<ShopByOutfit />} />

                      {/* Admin Routes */}

                      {/* <Route
                      path="/admin/dashboard"
                      element={
                        <AdminRoute>
                          <DashboardScreen />
                        </AdminRoute>
                      }
                    /> */}
                      <Route
                        path="/return/:id"
                        element={
                          <ProtectedRoute>
                            <ReturnPage />
                          </ProtectedRoute>
                        }
                      />
                      {/* <Route
                      path="/admin/product"
                      element={
                        <AdminRoute>
                          <ProductListScreen />
                        </AdminRoute>
                      }
                    /> */}
                      {/* <Route
                      path="/admin/product/:id"
                      element={
                        <AdminRoute>
                          <ProductEditScreen />
                        </AdminRoute>
                      }
                    /> */}
                      <Route
                        path="/admin/allOrderList/"
                        element={
                          <AdminRoute>
                            <OrderListAdmin />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/admin/topsellers"
                        element={
                          <AdminRoute>
                            <TopSellerList />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/payment/:id"
                        element={
                          <AdminRoute>
                            <PaymentScreen />
                          </AdminRoute>
                        }
                      />

                      <Route
                        path="/admin/allProductList/"
                        element={
                          <AdminRoute>
                            <ProductListAdmin />
                          </AdminRoute>
                        }
                      />
                      <Route
                        path="/transaction/:id"
                        element={
                          <AdminRoute>
                            <TransactionScreen />
                          </AdminRoute>
                        }
                      />

                      <Route
                        path="/admin/outofstock/"
                        element={
                          <AdminRoute>
                            <OutOfStock />
                          </AdminRoute>
                        }
                      />
                      {/*
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
                    /> */}
                    </Routes>
                  </Suspense>
                </div>
              </main>
              <Footer />
              {/* <footer>
          <div className="footer-content1">
            <div className="brand-logo1">REPEDDLE</div>
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

              <Support />
              {!cookies && <AcceptCookies />}
            </div>
          )}
        </ScrollToTop>
      </GoogleOAuthProvider>
    </BrowserRouter>
  );
}

export default App;
