import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingBox from "../component/LoadingBox";
import MessageBox from "../component/MessageBox";
import Rating from "../component/Rating";
import { getError } from "../utils";
import "../style/SellerScreen.css";
import Product from "../component/Product";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faCirclePlus,
  faGlobe,
  faHeart,
  faLink,
  faLocationDot,
  faMessage,
  faPen,
  faStar,
  faTag,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { Store } from "../Store";
import Model from "../component/Model";
import ReviewLists from "./ReviewLists";
import ModelLogin from "../component/ModelLogin";
import Report from "../component/Report";
import { socket } from "../App";
import WriteReview from "../component/WriteReview";
import RebundlePoster from "../component/RebundlePoster";
import { signoutHandler } from "../component/Navbar";
import { logout } from "../hooks/initFacebookSdk";

const Right = styled.div`
  flex: 7;
  margin: 0 15px;
  @media (max-width: 992px) {
    margin: 0;
  }
`;
const Tab = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  border-radius: 0.2rem;
`;
const TabItem = styled.div`
  display: flex;
  justify-content: center;
  cursor: pointer;
  margin: 10px;
  position: relative;
  text-transform: capitalize;
  min-width: 70px;
  @media (max-width: 992px) {
    min-width: 40px;
  }
  &:hover {
    color: var(--orange-color);
  }
  &.active {
    color: var(--orange-color);
    font-weight: bold;
    &::after {
      content: "";
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 100%;
      height: 2px;
      background: var(--orange-color);
    }
  }
`;
const Content = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  padding: 10px;
  gap: 8px;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  border-radius: 0.2rem;
  @media (max-width: 992px) {
    padding: 0;
    grid-template-columns: repeat(2, 1fr);
  }
`;
const ProductCont = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  @media (max-width: 992px) {
    width: 162px;
    height: 342px;
    margin: 5px 3px;
  }
`;

const ReviewsClick = styled.div`
  cursor: pointer;
`;

const AddProduct = styled.div`
  display: flex;
  border-radius: 0.2rem;
  width: 240px;
  height: 500px;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev2)"};
  &:hover {
    background: ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev4)" : "var(--light-ev4)"};
  }
  & svg {
    color: var(--orange-color);
    font-size: 50px;
    margin-bottom: 5px;
  }
  @media (max-width: 992px) {
    width: 162px;
    height: 342px;
    margin: 5px 3px;
  }
`;

const SellerLeft = styled.div`
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  border-radius: 0.2rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 15px;
  margin-bottom: 10px;
`;

const Sold = styled.div`
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  font-size: 24px;
  font-weight: bold;
  color: var(--orange-color);
`;

const Badge = styled.img`
  width: 20px;
  object-fit: cover;
`;

const ProfileUrl = styled.div`
  color: var(--malon-color);
  cursor: pointer;
  text-decoration: underline;
`;

const Next = styled.div`
  border: 1px solid;
  padding: 4px;
  border-radius: 0.2rem;
  width: 100px;
  text-align: center;
  font-weight: 500;
  &:hover {
    background: ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev3)"};
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
      return { ...state, loading: true };
    case "FETCH_PRODUCT_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case "FETCH_PRODUCT_FAIL":
      return {
        ...state,
        loading: false,
        loadingUser: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default function SellerScreen() {
  const params = useParams();
  const { slug } = params;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, mode } = state;

  const [sellerId, setSellerId] = useState(null);
  const [displayTab, setDisplayTab] = useState("all");
  const [showLoginModel, setShowLoginModel] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [refresh, setRefresh] = useState(false);

  const [showWriteReview, setShowWriteReview] = useState(false);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;

  const navigate = useNavigate();

  const [{ loading, loadingUser, error, products, pages, user }, dispatch] =
    useReducer(reducer, {
      loading: true,
      loadingUser: true,
      error: "",
      user: {},
      products: [],
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_USER_REQUEST" });
        const { data: dataUser } = await axios.get(`/api/users/seller/${slug}`);
        setSellerId(dataUser._id);
        dispatch({ type: "FETCH_USER_SUCCESS", payload: dataUser });
      } catch (err) {
        logout();
        localStorage.removeItem("userInfo");
        localStorage.removeItem("cartItems");
        localStorage.removeItem("shippingAddress");
        localStorage.removeItem("useraddress");
        localStorage.removeItem("paymentMethod");
        window.location.href = "/deleted";
      }
    };
    fetchData();
  }, [page, slug]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!sellerId) return;
        dispatch({ type: "FETCH_PRODUCT_REQUEST" });
        const { data: dataProduct } = await axios.get(
          `/api/products/seller/${sellerId}?page=${page}`
        );
        dispatch({
          type: "FETCH_PRODUCT_SUCCESS",
          payload: dataProduct,
        });
      } catch (err) {
        dispatch({ type: "FETCH_PRODUCT_FAIL", error: getError(err) });
      }
    };
    fetchData();
  }, [page, sellerId]);

  const toggleFollow = async () => {
    if (user.username === userInfo.username) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "You can't follow yourself",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }

    if (!userInfo) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Login to follow",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    try {
      if (user.followers.find((x) => x === userInfo._id)) {
        const { data } = await axios.put(
          `/api/users/unfollow/${sellerId}`,
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "FETCH_USER_SUCCESS", payload: data });
        ctxDispatch({
          type: "SHOW_TOAST",
          payload: {
            message: `You unfollow ${data.username}`,
            showStatus: true,
            state1: "visible1 error",
          },
        });

        socket.emit("post_data", {
          userId: sellerId,
          itemId: sellerId,
          notifyType: "follow",
          msg: `${userInfo.username} unfollowed you`,
          link: `/seller/${userInfo._id}`,
          userImage: userInfo.image,
          mobile: { path: "MyAccount", id: userInfo._id },
        });
      } else {
        const { data } = await axios.put(
          `/api/users/follow/${sellerId}`,
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "FETCH_USER_SUCCESS", payload: data });
        ctxDispatch({
          type: "SHOW_TOAST",
          payload: {
            message: `you are following ${data.username}`,
            showStatus: true,
            state1: "visible1 success",
          },
        });
        socket.emit("post_data", {
          userId: sellerId,
          itemId: sellerId,
          notifyType: "follow",
          msg: `${userInfo.username} started following you`,
          link: `/seller/${userInfo._id}`,
          mobile: { path: "MyAccount", id: userInfo._id },
          userImage: userInfo.image,
        });
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const [onlineUser, setOnlineUser] = useState([]);

  useEffect(() => {
    socket.emit("initialUsers");
    socket.on("loadUsers", (users) => {
      setOnlineUser(users);
      console.log("loadUsers", users);
    });
    socket.on("getUsers", (users) => {
      setOnlineUser(users);
      console.log("onlineuser", users);
    });
    console.log("onlineuser", onlineUser);
    return () => {
      socket.off("loadUsers");
      socket.off("getUsers");
    };
  }, [userInfo]);

  const isOnlineCon = (c) => {
    if (onlineUser.length > 0) {
      let onlineUserList = [];
      onlineUser.map((o) => onlineUserList.push(o._id));
      if (onlineUserList.includes(c)) {
        return true;
      } else return false;
    }
  };

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    return `?page=${filterPage}`;
  };

  const tabSwitch = (tab) => {
    switch (tab) {
      case "all":
        return (
          <>
            {userInfo && (
              <ProductCont>
                <Link to={userInfo.isSeller ? "/newproduct" : "/sell"}>
                  <AddProduct mode={mode}>
                    <FontAwesomeIcon icon={faCirclePlus} />
                    <span>Add Product</span>
                  </AddProduct>
                </Link>
              </ProductCont>
            )}
            {loading ? (
              <LoadingBox></LoadingBox>
            ) : error ? (
              <MessageBox variant="danger">{error}</MessageBox>
            ) : products.length === 0 ? (
              <MessageBox>No Product Found</MessageBox>
            ) : (
              products.map((product) => (
                <ProductCont key={product._id}>
                  <Product product={product} />
                </ProductCont>
              ))
            )}
          </>
        );
      case "selling":
        return (
          <>
            {loading ? (
              <LoadingBox></LoadingBox>
            ) : error ? (
              <MessageBox variant="danger">{error}</MessageBox>
            ) : products.length === 0 ? (
              <MessageBox>No Product Found</MessageBox>
            ) : (
              products.map(
                (product) =>
                  product.countInStock > 0 && (
                    <ProductCont key={product._id}>
                      <Product product={product} />
                    </ProductCont>
                  )
              )
            )}
          </>
        );

      case "sold":
        return (
          <>
            {loading ? (
              <LoadingBox></LoadingBox>
            ) : error ? (
              <MessageBox variant="danger">{error}</MessageBox>
            ) : products.length === 0 ? (
              <MessageBox>No Product Found</MessageBox>
            ) : (
              products.map(
                (product) =>
                  product.sold && (
                    <ProductCont key={product._id}>
                      <div style={{ position: "absolute" }}>
                        <Product product={product} />
                        {product.sold && (
                          <Link to={`/product/${product.slug}`}>
                            <div className="overlay">
                              <Sold>SOLD</Sold>
                            </div>
                          </Link>
                        )}
                      </div>
                    </ProductCont>
                  )
              )
            )}
          </>
        );
      case "liked":
        return (
          <>
            {loading ? (
              <LoadingBox></LoadingBox>
            ) : error ? (
              <MessageBox variant="danger">{error}</MessageBox>
            ) : user.likes.length === 0 ? (
              <MessageBox>No Product Found</MessageBox>
            ) : (
              user.likes.map((product) => (
                <ProductCont key={product._id}>
                  <Product product={product} />
                </ProductCont>
              ))
            )}
          </>
        );
      case "saved":
        return (
          <>
            {loading ? (
              <LoadingBox></LoadingBox>
            ) : error ? (
              <MessageBox variant="danger">{error}</MessageBox>
            ) : user.saved.length === 0 ? (
              <MessageBox>No Product Found</MessageBox>
            ) : (
              user.saved.map((product) => (
                <ProductCont key={product._id}>
                  {console.log(products)}
                  {console.log(user)}
                  <Product product={product} />
                </ProductCont>
              ))
            )}
          </>
        );

      default:
        break;
    }
  };

  const addConversation = async (id, type) => {
    try {
      if (!userInfo) {
        ctxDispatch({
          type: "SHOW_TOAST",
          payload: {
            message: "You must be a login user to send message",
            showStatus: true,
            state1: "visible1 error",
          },
        });
      }
      if (userInfo._id.toString() === id.toString()) {
        ctxDispatch({
          type: "SHOW_TOAST",
          payload: {
            message: "You can't message yourself",
            showStatus: true,
            state1: "visible1 error",
          },
        });
        return;
      }
      const { data } = await axios.post(
        `/api/conversations`,
        { recieverId: id, type: type },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      navigate(`/messages?conversation=${data._id}`);
    } catch (err) {
      console.log(err, err.message);
    }
  };

  const handlereport = async (id) => {
    try {
      const { data } = await axios.post(
        `/api/conversations/`,
        { recieverId: id, type: "reportUser" },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      navigate(`/messages?conversation=${data._id}`);
    } catch (err) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: getError(err),
          showStatus: true,
          state1: "visible1 error",
        },
      });
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Repeddle",
        // text: ` ${window.location.protocol}//${window.location.hostname}${
        //   user.region === "NGN" ? "/ng/" : "/za/"
        // }${user.username}`,
        url: ` ${window.location.protocol}//${window.location.hostname}${
          user.region === "NGN" ? "/ng/" : "/za/"
        }${user.username}`,
      });
      console.log("Shared successfully");
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <div className="seller_main_container">
      <div className="seller_left">
        {loadingUser ? (
          <LoadingBox></LoadingBox>
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <SellerLeft mode={mode}>
              <div className="seller_image_group">
                <img
                  src={user.image}
                  className="seller_profile_image"
                  alt={user.username}
                />
                <div className="seller_profile_badge">
                  {user.badge && (
                    <Badge src="https://res.cloudinary.com/emirace/image/upload/v1661148671/Icons-28_hfzerc.png" />
                  )}
                </div>
              </div>
              <Link to="/dashboard/user">
                {userInfo && userInfo._id === sellerId && (
                  <FontAwesomeIcon
                    className="seller_profile_icon"
                    icon={faPen}
                  />
                )}
              </Link>
              {isOnlineCon(user._id) ? (
                <div className="seller_profile_status">online</div>
              ) : (
                <div
                  className="seller_profile_status"
                  style={{ borderColor: "grey", color: "grey" }}
                >
                  offline
                </div>
              )}
              <div className="seller_profile_name">@{user.username}</div>
              <div className="seller_profile_follow">
                <div className="seller_profile_follower">
                  <div className="seller_profile_follow_num">
                    {user.followers && user.followers.length}
                  </div>
                  <div className="">Followers</div>
                </div>
                <div className="seller_profile_follower">
                  <div className="seller_profile_follow_num">
                    {user.following && user.following.length}
                  </div>
                  <div className="">Following</div>
                </div>
                {userInfo && userInfo._id !== user._id && (
                  <button
                    type="button"
                    onClick={toggleFollow}
                    className="seller_follow_btn"
                  >
                    {userInfo &&
                    user.followers &&
                    user.followers.find((x) => x === userInfo._id)
                      ? "Following"
                      : "Follow"}
                  </button>
                )}
              </div>
              <ReviewsClick onClick={() => setShowModel(!showModel)}>
                <Rating rating={user.rating} numReviews={user.numReviews} />
              </ReviewsClick>
              {console.log(user)}
              {userInfo && user.buyers.includes(userInfo._id) && (
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowWriteReview(true)}
                >
                  Leave a review
                </div>
              )}

              <ModelLogin showModel={showModel} setShowModel={setShowModel}>
                <ReviewLists userId={sellerId} setShowModel={setShowModel} />
              </ModelLogin>
              <ModelLogin
                showModel={showWriteReview}
                setShowModel={setShowWriteReview}
              >
                <WriteReview
                  userId={sellerId}
                  setShowModel={setShowWriteReview}
                />
              </ModelLogin>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "10px 0",
                  border: "0",
                  background: "none",
                }}
                onClick={handleShare}
              >
                <ProfileUrl>
                  {window.location.hostname}
                  {user.region === "NGN" ? "/ng/" : "/za/"}
                  {user.username}
                </ProfileUrl>
                <FontAwesomeIcon
                  icon={faLink}
                  size="sm"
                  style={{ marginLeft: "5px", cursor: "pointer" }}
                  color="var(--malon-color)"
                />
              </button>
              <button
                onClick={() => addConversation(user._id, "user")}
                type="buton"
                className="profile_contact_btn"
              >
                Message Me
              </button>
              {user.rebundle.status && <RebundlePoster />}
              <div className="seller_profile_detail">
                <div className="seller_single_detail">
                  <div>
                    <FontAwesomeIcon icon={faTag} /> Sold
                  </div>
                  <div className="seller_single_right">
                    {console.log(user)}
                    {user.sold && user.sold.length < 5
                      ? "< 5"
                      : user?.sold?.length}
                  </div>
                </div>

                <div className="seller_single_detail">
                  <div>
                    <FontAwesomeIcon icon={faUser} /> Member since
                  </div>
                  <div className="seller_single_right">
                    {user.createdAt && user.createdAt.substring(0, 10)}
                  </div>
                </div>
                <div className="seller_single_detail">
                  <div>
                    <FontAwesomeIcon icon={faLocationDot} /> From
                  </div>
                  {console.log(user)}
                  <div className="seller_single_right">
                    {user.region === "NGN" ? "Nigeria" : "South Africa"}
                  </div>
                </div>
                <div className="seller_single_detail">
                  <div>
                    <FontAwesomeIcon icon={faGlobe} /> Language
                  </div>
                  <div className="seller_single_right">English</div>
                </div>
              </div>
            </SellerLeft>
            <SellerLeft mode={mode}>
              <div className="seller_profile_detail seller_detail_first">
                <div className="seller_detail_title">About</div>
                <div className="seller_detail_content">{user.about}</div>
              </div>
            </SellerLeft>
            <button
              onClick={() => handlereport(user._id)}
              type="buton"
              className="profile_report_btn"
            >
              Report Seller
            </button>
            <ModelLogin
              showModel={showLoginModel}
              setShowModel={setShowLoginModel}
            >
              <Report reportedUser={sellerId} />
            </ModelLogin>
          </>
        )}
      </div>
      <Right>
        <Tab mode={mode}>
          <TabItem
            className={displayTab === "all" && "active"}
            onClick={() => setDisplayTab("all")}
          >
            All
          </TabItem>
          <TabItem
            className={displayTab === "selling" && "active"}
            onClick={() => setDisplayTab("selling")}
          >
            Selling
          </TabItem>
          <TabItem
            className={displayTab === "sold" && "active"}
            onClick={() => setDisplayTab("sold")}
          >
            Sold
          </TabItem>
          <TabItem
            className={displayTab === "liked" && "active"}
            onClick={() => setDisplayTab("liked")}
          >
            Liked
          </TabItem>
          {userInfo && userInfo._id === sellerId && (
            <TabItem
              className={displayTab === "saved" && "active"}
              onClick={() => setDisplayTab("saved")}
            >
              Saved
            </TabItem>
          )}
        </Tab>
        <Content mode={mode}>{tabSwitch(displayTab)}</Content>

        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "20px",
          }}
        >
          {page > 1 && (
            <Link to={getFilterUrl({ page: parseInt(page) - 1 })}>
              <Next>Previous</Next>
            </Link>
          )}
          {pages > 1 && products.length === 40 && (
            <Link to={getFilterUrl({ page: parseInt(page) + 1 })}>
              <Next>Next</Next>
            </Link>
          )}
        </div>
      </Right>
    </div>
  );
}
