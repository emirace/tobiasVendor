import './App.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import ProductsScreen from './screens/ProductsScreen';
import ProductScreen from './screens/ProductScreen';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState } from 'react';
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
import ProtectedRoute from './component/ProtectedRoute';
import SearchSceen from './screens/SearchSceen';
import DashboardScreen from './screens/DashboardScreen';
import HomeScreen from './screens/HomeScreen';
import AdminRoute from './component/AdminRoute';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Footer from './component/Footer';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';
import UserListScreen from './screens/UserListScreen';
import UserEditScreen from './screens/UserEditScreen';
import SellerRoute from './component/SellerRoute';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

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
  const [mode, setMode] = useState('pagebodydark');

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
  }, []);

  return (
    <BrowserRouter>
      <ToastContainer position="top-center" limit={1} />
      <div className={mode || ''}>
        <header style={{ background: 'inherit' }}>
          <nav className="navbar1 ">
            <input type="checkbox" id="check" />
            <div className="d-none d-lg-block">
              <div className="nav0 ">
                <div className="right_top">
                  <select className="language">
                    <option>EN</option>
                    <option>FR</option>
                  </select>
                  <select className="language">
                    <option>$USD</option>
                    <option>NGN</option>
                    <option>RAN</option>
                  </select>
                  <select
                    onChange={(e) => {
                      setMode(e.target.value);
                    }}
                    className="language"
                  >
                    <option value="pagebodydark">DARK</option>
                    <option value="pagebodylight">LIGHT</option>
                  </select>
                </div>
                <div className="top_center language">
                  50% discount on Newly Registered User... You Will Love{' '}
                  <FontAwesomeIcon
                    icon={faHeart}
                    className="red_love"
                  ></FontAwesomeIcon>{' '}
                  Shopping with Us
                </div>
                {!userInfo ? (
                  <Link className="  d-none d-lg-block" to="/signin">
                    Sign In / Register
                  </Link>
                ) : (
                  <div className="d-flex">
                    {userInfo.isSeller && (
                      <NavDropdown
                        title="Seller"
                        className="d-none d-lg-block p-0 mybg-none language"
                        id="admin-nav-dropdown"
                      >
                        <LinkContainer to="/seller/product">
                          <NavDropdown.Item>Products</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/seller/order">
                          <NavDropdown.Item>Orders</NavDropdown.Item>
                        </LinkContainer>
                      </NavDropdown>
                    )}
                    {userInfo.isAdmin && (
                      <NavDropdown
                        title="Admin"
                        className="d-none d-lg-block p-0 mybg-none language"
                        id="admin-nav-dropdown"
                      >
                        <LinkContainer to="/admin/dashboard">
                          <NavDropdown.Item>Dashboard</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/admin/product">
                          <NavDropdown.Item>Products</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/admin/order">
                          <NavDropdown.Item>Orders</NavDropdown.Item>
                        </LinkContainer>
                        <LinkContainer to="/admin/user">
                          <NavDropdown.Item>Users</NavDropdown.Item>
                        </LinkContainer>
                      </NavDropdown>
                    )}

                    <NavDropdown
                      className="d-none d-lg-block p-0 mybg-none language"
                      title={
                        <>
                          <i class="fa fa-user-circle mybg-none"></i>
                          {'  '}
                          {userInfo.name}
                        </>
                      }
                      id="basic-nav-dropdown"
                    >
                      <LinkContainer to="/profile">
                        <NavDropdown.Item className="font13 bg-black">
                          User Profile
                        </NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item className="font13">
                          Order History
                        </NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item font13"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                  </div>
                )}
              </div>
            </div>
            <div className="nav1">
              <label for="check" className="checkbtn1">
                <i class="fas fa-bars"></i>
              </label>
              <LinkContainer to="/">
                <div className="brand-logo1">TOBIAS</div>
              </LinkContainer>
              <div className="navsearch">
                <SearchBox />
              </div>
              <div className="nav-items1">
                <a href="/#" className="d-block d-md-block d-lg-none">
                  <i class="fa fa-search"></i>
                </a>
                {userInfo ? (
                  <>
                    <a href="/#" alt="" className="d-none d-lg-block">
                      <i class="fa fa-envelope"></i>
                    </a>
                  </>
                ) : (
                  ''
                )}
                <Link to="/wishlists" className="nav-cart-btn1">
                  <i class="fa fa-heart"></i>
                </Link>
                <Link to="/cart" className="nav-cart-btn1">
                  <i class="fa fa-shopping-cart"></i>
                  {cart.cartItems.length > 0 && (
                    <span>{cart.cartItems.length}</span>
                  )}
                </Link>

                <button className="search-btn1">Sell</button>
              </div>
            </div>
            <ul className="links-container1">
              <div className="nav-signin ">
                <div className="sidenav-top">
                  <label for="check" className="checkbtn1">
                    <i class="fas fa-times"></i>
                  </label>
                  <div className=" sidebar_mode d-block d-lg-none">
                    <select className="language">
                      <option>EN</option>
                      <option>FR</option>
                    </select>
                    <select className="language">
                      <option>$USD</option>
                      <option>NGN</option>
                      <option>RAN</option>
                    </select>
                    <select
                      onChange={(e) => {
                        setMode(e.target.value);
                      }}
                      className="language"
                    >
                      <option value="pagebodydark">DARK</option>
                      <option value="pagebodylight">LIGHT</option>
                    </select>
                  </div>
                </div>
                {userInfo ? (
                  <>
                    <NavDropdown className="link1" title={userInfo.name}>
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                    <a href="/#" alt="" className="link1">
                      <i class="fa fa-envelope"></i>
                    </a>
                  </>
                ) : (
                  <Link className=" link1 h80" to="/signin">
                    Sign In / Register
                  </Link>
                )}
              </div>
              <li className="link1">
                <a href="/#" className="">
                  Womenswear
                </a>
                <ul className="sub-cat1">
                  <li className="">sub cat</li>
                  <li className="">sub cat</li>
                  <li className="">sub cat</li>
                  <li className="">sub cat</li>
                </ul>
              </li>
              <li className="link1">
                <a href="/#">Menswear</a>
              </li>
              <li className="link1">
                <a href="/#">Curve +plus</a>
              </li>
              <li className="link1">
                <a href="/#">Kids</a>
              </li>
              <li className="link1">
                <a href="/#">Brands</a>
              </li>
              <li className="link1">
                <a href="/#">Shop by Outfit</a>
              </li>
              <li className="link1">
                <a href="/#">Shop By Brand</a>
              </li>
            </ul>
          </nav>
          {/* <Navbar bg="white" variant="dark" expand="lg" className="mt-2">
          <Container>
            <LinkContainer to="/">
              <Navbar.Brand>TOBIAS</Navbar.Brand>
            </LinkContainer>

            <SearchBox></SearchBox>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto w-100 justify-content-end">
                <Link to="/cart" className="nav-link nav-cart-basket">
                  <i className="fa fa-shopping-cart "></i>
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cart.cartItems.length}
                    </Badge>
                  )}
                </Link>
                <div>
                  <img
                    alt="pics"
                    src="/images/profile.jpg"
                    className="rounded-circle z-depth-2 nav-user-img"
                  ></img>
                </div>
                {userInfo ? (
                  <div className="user-nav-item">
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                    <small className="small-user">Admin</small>
                  </div>
                ) : (
                  <Link className="nav-link" to="/signin">
                    Sign In
                  </Link>
                )}
                {/* {userInfo && userInfo.isAdmin && (
                  <NavDropdown title="Admin" id="admin-nav-dropdown">
                    <LinkContainer to="/admin/dashboard">
                      <NavDropdown.Item>Dashboard</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/productlist">
                      <NavDropdown.Item>Products</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/orderlist">
                      <NavDropdown.Item>Orders</NavDropdown.Item>
                    </LinkContainer>
                    <LinkContainer to="/admin/userlist">
                      <NavDropdown.Item>Users</NavDropdown.Item>
                    </LinkContainer>
                  </NavDropdown>
                )} */}
          {/*</Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar> */}
        </header>
        {/* <div
        className={
          sidebarIsOpen
            ? 'd-flex flex-column site-container active-cont'
            : 'd-flex flex-column site-container'
        }
      > */}
        {/* <div
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-black w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category}>
                <LinkContainer
                  to={`/search?category=${category}`}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div> */}
        <main>
          {/* <Button
            variant="light"
            onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
          >
            <i className="fas fa-bars"></i>
            {!sidebarIsOpen ? <strong> Category</strong> : ''}
          </Button> */}
          <div className="p-0 container-fluid">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchSceen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/shipping"
                element={
                  <ProtectedRoute>
                    <ShippingAddressScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment"
                element={
                  <ProtectedRoute>
                    <PaymentMethodScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/placeorder"
                element={
                  <ProtectedRoute>
                    <PlaceOrderScreen />
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
                path="/seller/order"
                element={
                  <SellerRoute>
                    <OrderListScreen />
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
    </BrowserRouter>
  );
}

export default App;
