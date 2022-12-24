import Button from "react-bootstrap/Button";
import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import Col from "react-bootstrap/Col";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import MessageBox from "../component/MessageBox";
import axios from "axios";
import "../style/Cart.css";
import { Store } from "../Store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { toast } from "react-toastify";
import { calcPrice, checkDeliverySelect, getError } from "../utils";
import ModelLogin from "../component/ModelLogin";
import DeliveryOptionScreen from "./DeliveryOptionScreen";
import LoadingBox from "../component/LoadingBox";

const Container = styled.div`
  margin: 20px;
  @media (max-width: 992px) {
    margin: 5px;
  }
`;
const CartCont = styled.div`
  display: flex;
  gap: 20px;
  @media (max-width: 992px) {
    flex-direction: column;
    gap: 5px;
  }
`;
const LeftCorner = styled.div`
  flex: 3;
  & h1 {
    font-size: 28px;
    margin-bottom: 10px;
  }
`;
const RightCorner = styled.div`
  flex: 1;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
`;

const Top = styled.div`
  margin: 0 0 20px 0;
`;
const Bottom = styled.div`
  padding: 20px;
  margin: 0 0 20px 0;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  @media (max-width: 992px) {
    padding: 10px;
  }
`;

const SumCont = styled.div`
  display: flex;
`;
const Left = styled.div`
  display: flex;
  flex: 5;
`;
const Right = styled.div`
  flex: 1;
`;
const Item = styled.div`
  margin: 0 10px 20px 10px;
  padding: 20px;
  border-radius: 0.2rem;

  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  @media (max-width: 992px) {
    margin: 10px 0;
  }
`;

const Summary = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const CustomMessage = styled.div`
  & a {
    font-weight: bold;
    color: var(--orange-color);
    font-size: 15px;
    &:hover {
      color: var(--malon-color);
    }
  }
`;
const CartItemCont = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
  }
`;

const UserCont = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;
const UserImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;
const UserName = styled.div`
  font-weight: bold;
  margin: 0 20px;
`;

const SelectDelivery = styled.div`
  margin-left: 20px;
  color: var(--orange-color);
  font-size: 15px;
  cursor: pointer;
  &:hover {
    color: var(--malon-color);
  }
`;

const SelectDeliveryButton = styled.div`
  background: var(--orange-color);
  color: white;
  cursor: pointer;
  padding: 3px 7px;
  border-radius: 0.2rem;
  &:hover {
    background: var(--malon-color);
  }
`;

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_USER_REQUEST":
      return { ...state, loadingUser: true };
    case "FETCH_USER_SUCCESS":
      return {
        ...state,
        loadingUser: false,
        user: action.payload,
        error: "",
      };
    case "FETCH_PRODUCT_REQUEST":
      return { ...state, loadingUser: true };
    default:
      return state;
  }
};

export default function CartScreen() {
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const wishlist = sp.get("wishlist") || null;

  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo, mode, currency } = state;
  const [{ loadingUser, error, user }, dispatch] = useReducer(reducer, {
    loadingUser: true,
    error: "",
    user: {},
  });

  const [deliveryOption, setDeliveryOption] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const scrollref = useRef();

  useEffect(() => {
    if (wishlist) {
      scrollref.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [wishlist]);
  const [loading, setLoading] = useState(true);
  const [currentCart, setcurrentCart] = useState(cart);
  useEffect(() => {
    const getPrice = async () => {
      const data = await calcPrice(cart, userInfo, currentItem);
      console.log("calcPrice", data);
      setcurrentCart(data);
      setLoading(false);
    };
    getPrice();
  }, [cart, currentItem, userInfo]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_USER_REQUEST" });
        const { data: dataUser } = await axios.get(
          `/api/users/seller/${userInfo._id}`
        );
        console.log("userdata", dataUser);
        dispatch({ type: "FETCH_USER_SUCCESS", payload: dataUser });
      } catch (err) {
        console.log(err);
      }
    };
    if (userInfo) {
      fetchData();
    }
  }, [userInfo]);
  const updateCartHandler = async (item, quantity) => {
    if (!item.deliverySelect) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Slect method of delivery",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Sorry. Product is out of stock",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    //
    item.deliverySelect = {
      ...item.deliverySelect,
      cost: item.deliverySelect.cost * quantity,
    };
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  const removeItemHandler = async (item) => {
    if (userInfo) {
      await axios.delete(`/api/cartItems/${item._id}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      });
    }
    ctxDispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const addToCartHandler = async (item) => {
    const existItem = cart.cartItems.find((x) => x._id === item._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Sorry. Product is out of stock",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    if (userInfo) {
      await axios.post(
        "/api/cartItems",
        { ...item, quantity },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
    ctxDispatch({
      type: "SHOW_NOTIFICAATION",
      payload: {
        text: "Item added to Cart",
        showStatus: true,
        buttonText: "Checkout",
        link: "/cart",
      },
    });
  };

  const checkoutHandler = () => {
    if (!userInfo) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Login to continue",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      navigate("/signin?redirect=cart");
      return;
    }
    if (!checkDeliverySelect(cart)) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Select delivery method",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    if (cart.cartItems.length === 0) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Cart is empty",
          showStatus: true,
          state1: "visible1 error",
        },
      });
    } else {
      if (userInfo.isVerifiedEmail) {
        navigate("../payment");
      } else {
        navigate("../verifyemail");
      }
    }
  };

  return loading ? (
    <LoadingBox />
  ) : (
    <div>
      <Helmet>
        <title>Shopping Cart</title>
      </Helmet>
      <Container>
        <h1>Shopping Cart</h1>

        <CartCont>
          <LeftCorner>
            <div style={{ textAlign: "center", width: "100%", color: "grey" }}>
              Placing an item in your shopping cart does not reserve that item
              or price. We only reserve the stock for your order once payment is
              received.
            </div>
            {console.log(cart)}
            <Top mode={mode}>
              {cart.cartItems.length === 0 ? (
                <MessageBox>
                  <CustomMessage>
                    Cart is empty. <Link to={`/`}>Go Shopping</Link>
                  </CustomMessage>
                </MessageBox>
              ) : (
                <>
                  {cart.cartItems.map((item) => (
                    <Item key={item._id} mode={mode}>
                      <UserCont>
                        <UserImg src={item.seller.image} alt="img" />
                        <UserName>
                          <Link to={`/seller/${item.seller._id}`}>
                            {item.sellerName}
                          </Link>
                        </UserName>
                      </UserCont>
                      <hr />
                      <CartItemCont>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        ></img>
                        <div
                          className="cart_item_detail "
                          style={{ justifyContent: "space-between" }}
                        >
                          <div>
                            <Link to={`/product/${item.slug}`}>
                              {item.name}
                            </Link>

                            <div>
                              {" "}
                              {item.currency}
                              {item.actualPrice}
                            </div>
                            <span>Size: {item.selectSize}</span>
                          </div>
                          <div className="col-3 d-flex align-items-center">
                            <Button
                              variant="none"
                              onClick={() =>
                                updateCartHandler(item, item.quantity - 1)
                              }
                              disabled={item.quantity === 1}
                            >
                              <FontAwesomeIcon icon={faMinus} />
                            </Button>{" "}
                            <span>{item.quantity}</span>{" "}
                            <Button
                              variant="none"
                              onClick={() =>
                                updateCartHandler(item, item.quantity + 1)
                              }
                              disabled={item.quantity === item.countInStock}
                            >
                              <FontAwesomeIcon icon={faPlus} />
                            </Button>
                            <Button
                              onClick={() => removeItemHandler(item)}
                              variant="none"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </Button>
                          </div>
                        </div>
                      </CartItemCont>
                      <Row className="align-items-center d-none d-md-flex justify-content-between">
                        <div className="col-5 d-flex  align-items-center">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="img-fluid rounded img-thumbnail"
                          ></img>{" "}
                          <div className="cart_item_detail">
                            <Link to={`/product/${item.slug}`}>
                              {item.name}
                            </Link>

                            <div>
                              {" "}
                              {item.currency}
                              {item.actualPrice}
                            </div>
                            <span>Size: {item.selectSize}</span>
                          </div>
                        </div>
                        <div className="col-3 d-flex align-items-center">
                          <Button
                            variant="none"
                            onClick={() =>
                              updateCartHandler(item, item.quantity - 1)
                            }
                            disabled={item.quantity === 1}
                          >
                            <FontAwesomeIcon icon={faMinus} />
                          </Button>{" "}
                          <span>{item.quantity}</span>{" "}
                          <Button
                            variant="none"
                            onClick={() =>
                              updateCartHandler(item, item.quantity + 1)
                            }
                            disabled={item.quantity === item.countInStock}
                          >
                            <FontAwesomeIcon icon={faPlus} />
                          </Button>
                        </div>
                        <div className="col-2">
                          <Button
                            onClick={() => removeItemHandler(item)}
                            variant="none"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </div>
                      </Row>
                      <div style={{ marginTop: "20px", display: "flex" }}>
                        <div>
                          Delivery:{" "}
                          {item.deliverySelect ? (
                            <span style={{ marginLeft: "20px" }}>
                              {item.deliverySelect["delivery Option"]} +{" "}
                              {currency}
                              {item.deliverySelect.cost}
                            </span>
                          ) : (
                            ""
                          )}
                        </div>
                        <SelectDelivery
                          onClick={() => {
                            setCurrentItem(item);
                            setShowModel(true);
                          }}
                        >
                          {!item.deliverySelect ? (
                            <SelectDeliveryButton>
                              Select delivery option
                            </SelectDeliveryButton>
                          ) : (
                            "Change"
                          )}
                        </SelectDelivery>
                      </div>
                    </Item>
                  ))}
                  <MessageBox>
                    <CustomMessage>
                      <Link to={`/search`}>Continue Shopping</Link>
                    </CustomMessage>
                  </MessageBox>
                </>
              )}

              <ModelLogin setShowModel={setShowModel} showModel={showModel}>
                <DeliveryOptionScreen
                  setShowModel={setShowModel}
                  item={currentItem}
                />
              </ModelLogin>
            </Top>
            {userInfo && (
              <Bottom ref={scrollref} mode={mode}>
                <h1>Wishlist</h1>
                {user.saved && user.saved.length === 0 ? (
                  <MessageBox>No save item</MessageBox>
                ) : (
                  <>
                    {console.log("user", user)}
                    {user.saved &&
                      user.saved.map((product, index) => {
                        const existItem = cart.cartItems.find(
                          (x) => x._id === product._id
                        );
                        return (
                          !existItem && (
                            <Item key={index} mode={mode}>
                              <Row className="align-items-center justify-content-between">
                                <div className="col-7 d-flex  align-items-center">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="img-fluid rounded img-thumbnail"
                                  ></img>{" "}
                                  <div className="cart_item_detail">
                                    <Link to={`/product/${product.slug}`}>
                                      {product.name}
                                    </Link>

                                    <div>
                                      {" "}
                                      {product.currency}
                                      {product.price}
                                    </div>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <Button
                                    onClick={() => addToCartHandler(product)}
                                    variant="none"
                                  >
                                    Add to Cart
                                  </Button>
                                </div>
                              </Row>
                            </Item>
                          )
                        );
                      })}
                  </>
                )}
              </Bottom>
            )}
          </LeftCorner>
          <RightCorner mode={mode}>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <div className="col-3">Items</div>
                    <div className="col-9">
                      {cart.cartItems.map((c) => (
                        <>
                          <SumCont>
                            <Left>
                              <Right>{c.quantity} </Right>
                              <Right>x </Right>
                              <Right style={{ flex: "2" }}>
                                {currency}
                                {c.actualPrice}
                              </Right>
                            </Left>
                            <Right style={{ flex: "3" }}>
                              {` =  ${currency}` + c.quantity * c.actualPrice}
                            </Right>
                          </SumCont>
                        </>
                      ))}
                    </div>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>SubTotal</Col>
                    <Col>
                      {currency}
                      {cart.cartItems.reduce(
                        (a, c) => a + c.actualPrice * c.quantity,
                        0
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>
                      {console.log("check cart", currentCart)}
                      {currency}
                      {currentCart.shippingPrice.toFixed(2)}
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <b>Total</b>
                    </Col>
                    <Col>
                      <b>
                        {currency}
                        {currentCart.totalPrice.toFixed(2)}
                      </b>
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <div className="d-grid" style={{ marginTop: "30px" }}>
                    <button
                      type="button"
                      className="search-btn1"
                      onClick={checkoutHandler}
                      variant="primary"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
            <Summary>
              {/* <div>
              <h4 style={{ marginTop: "30px" }}>
                Subtotal ({cart.cartItems.reduce((a, c) => a + c.quantity, 0)}{" "}
                items) : {currency}
                {cart.cartItems.reduce((a, c) => a + c.price * c.quantity, 0)}
              </h4>
            </div> */}
              {/* <div>
              <div className="d-grid" style={{ marginTop: "30px" }}>
                <button
                  type="button"
                  className="search-btn1"
                  onClick={checkoutHandler}
                  variant="primary"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div> */}
            </Summary>
          </RightCorner>
        </CartCont>
      </Container>
    </div>
  );
}
