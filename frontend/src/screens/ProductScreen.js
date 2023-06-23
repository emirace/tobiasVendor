import axios from "axios";
import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import { Link, useNavigate, useParams } from "react-router-dom";
import Rating from "../component/Rating";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../component/LoadingBox";
import MessageBox from "../component/MessageBox";
import { getError, region } from "../utils";
import { Store } from "../Store";
import OwlCarousel from "react-owl-carousel";
import { Carousel } from "react-responsive-carousel";
import "../style/product.css";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faBookmark,
  faCirclePlay,
  faCloud,
  faFaceSmile,
  faHeart,
  faLightbulb,
  faMessage,
  faQuestionCircle,
  faShareNodes,
  faTag,
  faThumbsDown,
  faThumbsUp,
  faWater,
} from "@fortawesome/free-solid-svg-icons";
import "../style/ProductScreen.css";
import styled from "styled-components";
import IconsTooltips from "../component/IconsTooltips";
import ShareButton from "../component/ShareButton";
import ReviewLists from "./ReviewLists";
import Model from "../component/Model";
import ModelLogin from "../component/ModelLogin";
import Signin from "../component/Signin";
import Comment from "../component/Comment";
import ProtectionRight from "../component/ProtectionRight";
import Report from "../component/Report";
import { format } from "timeago.js";
import Sizechart from "../component/Sizechart";
import Product from "../component/Product";
import { socket } from "../App";
import MagnifyImage from "../component/MagnifyImage";
import RebundlePoster from "../component/RebundlePoster";
import RebundleLabel from "../component/RebundleLabel";
import CustomCarousel from "../component/CustomCarousel";

const ReviewsClick = styled.div`
  cursor: pointer;
`;
const Tab = styled.div`
  display: flex;
  margin: 10px 30px 5px 30px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  justify-content: center;
`;
const TabItem = styled.div`
  display: flex;
  justify-content: center;
  cursor: pointer;
  margin: 10px;
  position: relative;
  text-transform: capitalize;
  min-width: 50px;
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
const Overview = styled.div`
  display: flex;
  padding: 0 20px 20px 20px;
`;
const LeftOverview = styled.div`
  flex: 1;
`;
const RightOverview = styled.div`
  flex: 1;
`;
const Key = styled.div`
  font-weight: 500;
`;
const Value = styled.div`
  text-transform: capitalize;
`;
const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  margin: 0 20px 20px 20px;
`;

const TableRow = styled.tr``;

const TableCell = styled.td`
  // padding: 8px;
  // border: 1px solid #ddd;
`;
const Sustain = styled.div`
  margin: 15px 0;
`;
const SustainHeader = styled.div`
  text-transform: uppercase;
`;

const reducer = (state, action) => {
  switch (action.type) {
    case "REFRESH_PRODUCT":
      return { ...state, product: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreateReview: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreateReview: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreateReview: false };
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, product: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "COMMENT_SUCCESS":
      return { ...state, comments: action.payload };
    case "COMMENT2_SUCCESS":
      const com = action.payload;
      return { ...state, comments: { ...state.comments, com } };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true };
    case "UPLOAD_SUCCESS":
      return { ...state, loadingUpload: false, errorUpload: "" };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
};

const IconContainer = styled.div`
  position: relative;
  &:hover div {
    opacity: 1;
  }
`;

const ReportButton = styled.div`
  cursor: pointer;
  color: var(--malon-color);
  text-align: right;
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
const Thumbs = styled.div`
  display: flex;
  & svg {
    font-size: 18px;
    padding-left: 10px;
    padding-right: 10px;
  }
`;

const Taglist = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 5px;
`;
const Tag = styled.div`
  border: 1px solid;
  padding: 0 10px;
  border-radius: 10px;
`;

const SustainCont = styled.div`
  display: flex;
  align-items: start;
  font-size: 14px;
  & svg {
    font-size: 16px;
  }
`;

const Sustainbold = styled.span`
  font-size: 16px;
  font-weight: bold;
`;

const Imagediv = styled.div`
  position: relative;
`;

const Badge = styled.img`
  width: 20px !important;
  height: 23px !important;
  object-fit: cover !important;
  border-radius: 0 !important;
`;

export default function ProductScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo, mode } = state;
  let reviewRef = useRef();
  const navigate = useNavigate();
  const [rating, setRAting] = useState(0);
  const [comment, setComment] = useState("");
  const [like, setLike] = useState("");
  const [comment2, setComment2] = useState("");
  const [itemDetail, setItemDetail] = useState(false);
  const [overview, setOverview] = useState(false);
  const [specification, setSpecification] = useState(false);
  const [condition, setCondition] = useState(false);
  const [shipping, setShipping] = useState(false);
  const [features, setFeatures] = useState(false);
  const [size, setSize] = useState("");
  const [share, setShare] = useState(false);
  const [displayTab, setDisplayTab] = useState("comments");
  const [reportModel, setReportModel] = useState(false);
  const [sizechartModel, setSizechartModel] = useState(false);
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product, comments, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      product: null,
      loading: true,
      error: "",
      comments: [],
    });

  useEffect(() => {
    const viewItem = async () => {
      try {
        const { data } = await axios.get(`/api/products/slug/${slug}`);
        if (data) {
          await axios.put(`/api/recentviews/${region()}/${data._id}`);
        }
        const factor = 0.9;
        var views = JSON.parse(localStorage.getItem("recentlyView") || "[]");
        const existing = views.find((x) => x.productId === data._id);

        const newView = {
          score: factor,
          numViews: 1,
          productId: data._id,
          product: data,
        };

        const newViews = existing
          ? views.map((item) =>
              item.productId === existing.productId
                ? {
                    score: existing.score + factor,
                    numViews: existing.numViews + 1,
                    productId: existing.productId,
                    product: existing.product,
                  }
                : item
            )
          : [...views, newView];
        console.log("veiws:", views, "newViews:", newViews);
        localStorage.setItem("recentlyView", JSON.stringify(newViews));
        if (newViews) {
          const newViews1 = newViews.map((v) =>
            data._id !== v.productId
              ? {
                  score: v.score * factor,
                  productId: v.productId,
                  product: v.product,
                  newViews: v.newViews,
                }
              : v
          );
          localStorage.setItem("recentlyView", JSON.stringify(newViews1));
          console.log(newViews1);
        }
      } catch (err) {
        console.log(getError(err));
      }
    };
    viewItem();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });

        console.log(result);

        window.scrollTo(0, 0);
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [slug, comment]);
  useEffect(() => {
    const fetchComment = async () => {
      try {
        if (product) {
          const { data } = await axios.get(`/api/comments/${product._id}`);
          dispatch({ type: "COMMENT_SUCCESS", payload: data });
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchComment();
  }, [product]);
  const [refresh, setRefresh] = useState(true);
  const [user, setUser] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: dataUser } = await axios.get(
          `/api/users/seller/${userInfo._id}`
        );
        setUser(dataUser);
      } catch (err) {
        console.log(getError(err));
      }
    };
    fetchData();
  }, [userInfo, refresh]);

  const [selectedImage, setSelectedImage] = useState("");
  const [sliderIndex, setSliderIndex] = useState(0);
  const [showModel, setShowModel] = useState(false);
  const [showLoginModel, setShowLoginModel] = useState(false);
  const [selectSize, setSelectSize] = useState("");
  const [image, setImage] = useState("");

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (!selectSize && product?.sizes.length > 0) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Select Size",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    if (userInfo && product.seller._id === userInfo._id) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "You can't buy Your product",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    const { data } = await axios.get(`/api/products/${product._id}`);
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
        { ...product, quantity, selectSize },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
    }
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, quantity, selectSize },
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
  const sliderHandler = (direction) => {
    if (direction === "left") {
      var slider = document.getElementById("slider");
      slider.scrollBy(350, 0);
      // setSliderIndex(sliderIndex > 0 ? sliderIndex - 1 : products.length - 5);
    } else {
      var slider = document.getElementById("slider");
      slider.scrollBy(-350, 0);
    }
  };

  const sliderstyle = `translateX(${sliderIndex * -80}vw)`;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Please enter review",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    if (!rating) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Please select rating",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    if (!like) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Give review a thumb up or thumb down",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    try {
      dispatch({ type: "CREATE_REQUEST" });
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.username, like },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "CREATE_SUCCESS" });
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Review submitted successfully",
          showStatus: true,
          state1: "visible1 success",
        },
      });
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      dispatch({ type: "REFRESH_PRODUCT", payload: product });
      window.scrollTo({
        behavior: "smooth",
        top: reviewRef.current.offsetTop,
      });

      socket.emit("post_data", {
        userId: product.seller._id,
        itemId: product._id,
        notifyType: "review",
        msg: `${userInfo.username} gave your product a review`,
        link: `/product/${product.slug}`,
        userImage: userInfo.image,
        mobile: { path: "Product", id: product.slug },
      });
      setRAting("");
      setComment("");
      setLike("");
    } catch (err) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: getError(err),
          showStatus: true,
          state1: "visible1 error",
        },
      });
      dispatch({ type: "CREATE_FAIL" });
    }
  };

  const submitCommentHandler = async (e) => {
    e.preventDefault();
    if (!comment2) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Enter a comment",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/comments/${product._id}`,
        { comment: comment2, image },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      console.log(data);
      comments.push(data);
      dispatch({ type: "COMMENT_SUCCESS", payload: comments });
      setComment2("");

      window.scrollTo({
        behavior: "smooth",
        top: reviewRef.current.offsetTop,
      });

      socket.emit("post_data", {
        userId: product.seller._id,
        itemId: product._id,
        notifyType: "comment",
        msg: `${userInfo.username} commented on your product`,
        link: `/product/${product.slug}`,
        mobile: { path: "Product", id: product.slug },
        userImage: userInfo.image,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const toggleCollapse = (type) => {
    switch (type) {
      case "itemDetail":
        setItemDetail(!itemDetail);
        break;
      case "overview":
        setOverview(!overview);
        break;
      case "condition":
        setCondition(!condition);
        break;
      case "shipping":
        setShipping(!shipping);
        break;
      case "features":
        setFeatures(!features);
        break;
      case "specification":
        setSpecification(!specification);
        break;
      default:
        break;
    }
  };
  const saveItem = async () => {
    if (!userInfo) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Sign In/ Sign Up to add an item to wishlist",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    if (product.seller._id === userInfo._id) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "You can't add your product to wishlist",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    try {
      const { data } = await axios.put(
        `/api/products/${product._id}/save`,
        {},
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: data.message,
          showStatus: true,
          state1: data.status,
        },
      });
      setRefresh(!refresh);
      // dispatch({ type: 'REFRESH_PRODUCT', payload: data.user });
    } catch (err) {
      toast.error(getError(err));
    }
  };
  const toggleLikes = async () => {
    if (!userInfo) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Sign in /  Sign Up to like",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    if (product.seller._id === userInfo._id) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "You can't like your product",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    try {
      if (product.likes.find((x) => x === userInfo._id)) {
        const { data } = await axios.put(
          `/api/products/${product._id}/unlikes`,
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "REFRESH_PRODUCT", payload: data.product });
        ctxDispatch({
          type: "SHOW_TOAST",
          payload: {
            message: "Item unLiked",
            showStatus: true,
            state1: "visible1 error",
          },
        });

        socket.emit("post_data", {
          userId: data.product.seller._id,
          itemId: data.product._id,
          notifyType: "like",
          msg: `${userInfo.username} unliked your product`,
          link: `/product/${data.product.slug}`,
          mobile: { path: "Product", id: data.product.slug },
          userImage: userInfo.image,
        });
      } else {
        const { data } = await axios.put(
          `/api/products/${product._id}/likes`,
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "REFRESH_PRODUCT", payload: data.product });
        ctxDispatch({
          type: "SHOW_TOAST",
          payload: {
            message: "Item Liked",
            showStatus: true,
            state1: "visible1 success",
          },
        });

        socket.emit("post_data", {
          userId: data.product.seller._id,
          itemId: data.product._id,
          notifyType: "like",
          msg: `${userInfo.username} liked your product`,
          link: `/product/${data.product.slug}`,
          mobile: { path: "Product", id: data.product.slug },
          userImage: userInfo.image,
        });
      }
    } catch (err) {
      console.log(getError(err));
    }
  };

  const uploadImageHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post("/api/upload", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: "UPLOAD_SUCCESS" });
      setImage(data.secure_url);
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Image Uploaded",
          showStatus: true,
          state1: "visible1 success",
        },
      });
    } catch (err) {
      dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Failed uploading image",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      console.log(getError(err));
    }
  };

  const handlereport = async (id, id2) => {
    try {
      if (!userInfo) {
        return ctxDispatch({
          type: "SHOW_TOAST",
          payload: {
            message: "SIGN IN or REGISTER to report an item",
            showStatus: true,
            state1: "visible1 error",
          },
        });
      }
      const { data } = await axios.post(
        `/api/conversations/`,
        { recieverId: id, productId: id2, type: "reportProduct" },
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

  const deleteReview = async (id) => {
    try {
      const { data } = await axios.delete(
        `/api/products/${product._id}/reviews/${id}`,
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "CREATE_SUCCESS" });
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Review deleted successfully",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      product.reviews = data.reviews;
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      dispatch({ type: "REFRESH_PRODUCT", payload: product });
    } catch (err) {
      console.log(getError(err));
    }
  };

  const conditionDetails = (item) => {
    if (item === "New with Tags") {
      return "New with Tags: A preowned secondhand product that has never been worn or used. These products reflect no sign of use and has its original purchase tags on it. This product shows no alterations, no defects and comes with Original purchase tags.";
    } else if (item === "New with No Tags") {
      return "A preowned secondhand product that has never been worn or use but doesn’t have original purchase tags. This product should show no defects or alterations.";
    } else if (item === "Excellent Condition") {
      return "A preowned secondhand Product still in an excellent condition that has only been used or worn very slightly, (perhaps 1–3 times) and carefully maintained. These Product may reflect very minimal worn or usage sign. Product do not have any damage on the fabric or material, no worn smell and no missing accessory, button or pieces. ";
    } else if (item === "Good Condition") {
      return "A preowned secondhand product in a very good condition which has been used or worn and properly maintained. No remarkable defects (Tear, Hole or Rust) expected.";
    } else if (item === "Fair Condition") {
      return "A preowned secondhand product which has been frequently used or worn. Products may show reasonable defects signs, scratches, worn corners or interior wear. Defects are shown on product photos and mentioned in description.";
    } else {
      return "No condition Selected";
    }
  };

  const switchTab = (tab) => {
    switch (tab) {
      case "comments":
        return (
          <>
            <div className="my-3 mx-4">
              <div className="my-3" ref={reviewRef}>
                {comments.length === 0 && (
                  <MessageBox>There is no comments</MessageBox>
                )}
              </div>
              {comments.length > 0 &&
                comments.map((comment) => (
                  <Comment
                    key={comment._id}
                    product={slug}
                    commentC={comment}
                  />
                ))}
              <div className="my-3">
                {userInfo ? (
                  <form onSubmit={submitCommentHandler}>
                    <h4>Write Comment</h4>
                    <FloatingLabel
                      controlId="floatingTextarea"
                      lablel="Coments"
                      className="my-3"
                    >
                      <Form.Control
                        as="textarea"
                        placeholder="Leave a comment here"
                        value={comment2}
                        className={` ${
                          mode === "pagebodydark" ? "" : "color_black"
                        }`}
                        onChange={(e) => setComment2(e.target.value)}
                      />
                      <input
                        style={{ marginTop: "5px" }}
                        type="file"
                        label="hello"
                        onChange={(e) => uploadImageHandler(e)}
                      />
                    </FloatingLabel>
                    <div className="my-3">
                      <Button disabled={loadingCreateReview} type="submit">
                        Submit
                      </Button>
                      {loadingCreateReview && <LoadingBox></LoadingBox>}
                    </div>
                  </form>
                ) : (
                  <CustomMessage>
                    Please{" "}
                    <Link to={`/signin?redirect=/product/${product.slug}`}>
                      Sign In
                    </Link>{" "}
                    to write a comment
                  </CustomMessage>
                )}
              </div>
            </div>
          </>
        );
      case "reviews":
        return (
          <>
            <div className="my-3 mx-4">
              <div className="my-3" ref={reviewRef}>
                {product.reviews.length === 0 && (
                  <MessageBox>There is no reviews</MessageBox>
                )}
              </div>
              <ListGroup>
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>{" "}
                    <FontAwesomeIcon
                      style={{ marginLeft: "10px" }}
                      icon={
                        review.like === "yes"
                          ? faThumbsUp
                          : review.like === "no"
                          ? faThumbsDown
                          : faFaceSmile
                      }
                      color={
                        review.like === "yes"
                          ? "#eb9f40"
                          : review.like === "no"
                          ? "red"
                          : "grey"
                      }
                      size={"lg"}
                    />
                    <Rating rating={review.rating} caption=" "></Rating>
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                    {userInfo && userInfo.isAdmin && (
                      <div
                        style={{ color: "red", cursor: "pointer" }}
                        onClick={() => deleteReview(review._id)}
                      >
                        delete
                      </div>
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <div className="my-3">
                {userInfo &&
                  product?.userBuy.includes(userInfo._id) &&
                  (userInfo ? (
                    <form onSubmit={submitHandler}>
                      <h2>Write a customer review</h2>
                      <Form.Group className="my-3" controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <Form.Select
                          aria-label="Rating"
                          value={rating}
                          onChange={(e) => setRAting(e.target.value)}
                        >
                          <option value="">Select...</option>
                          <option value="1">1- Poor</option>
                          <option value="2">2- Fair</option>
                          <option value="3">3- Good</option>
                          <option value="4">4- Very good</option>
                          <option value="5">5- Excelent</option>
                        </Form.Select>
                      </Form.Group>
                      <FloatingLabel
                        controlId="floatingTextarea"
                        lablel="Coments"
                        className="my-3"
                      >
                        <Form.Control
                          className={` ${
                            mode === "pagebodydark" ? "" : "color_black"
                          }`}
                          as="textarea"
                          placeholder="Leave a comment here"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                      </FloatingLabel>
                      <Thumbs>
                        <div>Like</div>
                        <FontAwesomeIcon
                          icon={faThumbsUp}
                          onClick={() => setLike("yes")}
                          color={like === "yes" ? "#eb9f40" : "grey"}
                        />{" "}
                        <div>Dislike</div>
                        <FontAwesomeIcon
                          icon={faThumbsDown}
                          onClick={() => setLike("no")}
                          color={like === "no" ? "#eb9f40" : "grey"}
                        />
                      </Thumbs>
                      <div className="my-3">
                        <button
                          className="search-btn1"
                          disabled={loadingCreateReview}
                          type="submit"
                        >
                          Submit
                        </button>
                        {loadingCreateReview && <LoadingBox></LoadingBox>}
                      </div>
                    </form>
                  ) : (
                    <CustomMessage>
                      Please{" "}
                      <Link to={`/signin?redirect=/product/${product.slug}`}>
                        Sign In
                      </Link>{" "}
                      to write a review
                    </CustomMessage>
                  ))}
              </div>
            </div>
          </>
        );

      default:
        break;
    }
  };

  const addConversation = async (id, id2) => {
    if (!userInfo) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Signin/ Sign Up to start a conversation",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/conversations/`,
        { recieverId: id, productId: id2, type: "product" },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      console.log(data);
      navigate(`/messages?conversation=${data._id}`);
    } catch (err) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message:
            "Encounter a problem starting a conversation, pls try again later",
          showStatus: true,
          state1: "visible1 error",
        },
      });
    }
  };

  const sizeHandler = (item) => {
    const current = product.sizes.filter((s) => s.size === item);
    if (current.length > 0) {
      setSize(`${item} ( ${current[0].value} left)`);
      setSelectSize(item);
    } else {
      setSize("Out of stock");
      setSelectSize("");
    }
  };

  const discount = () => {
    return ((product.price - product.actualPrice) / product.price) * 100;
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

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>{product.name}</title>
        <meta property="og:title" content={product.name} />
        <meta
          property="og:description"
          content="Check out what i found on Repeddle"
        />
        <meta property="og:image" content={product.image} />
        <meta
          property="og:url"
          content={`${window.location.href}/product/${product._id}`}
        />
      </Helmet>
      <RebundleLabel
        userId={product.seller._id}
        active={product.seller.rebundle.status}
      />
      <div className="single_product_container">
        <div className="single_product_left">
          {[product.image, ...product.images].map(
            (x, index) =>
              x && (
                <div
                  key={index}
                  className={`single_product_multi_image ${
                    selectedImage === x ? "activeImage" : ""
                  }`}
                  onClick={() => setSelectedImage(x)}
                >
                  <img
                    src={x}
                    alt=""
                    className={selectedImage === x ? "active1" : ""}
                  />
                </div>
              )
          )}
          {product.video && (
            <div
              className="single_product_multi_image"
              onClick={() => setSelectedImage("video")}
            >
              <div
                style={{
                  backgroundImage: `url('${product.image}')`,
                  width: "100%",
                  height: "60px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <FontAwesomeIcon icon={faCirclePlay} />
              </div>
            </div>
          )}
        </div>
        {/* <div className=" d-md-none">
          <div className=" " style={{ position: 'relative' }}>
            <OwlCarousel
              items={1}
              autoHeight={false}
              dots={true}
              autoplayTimeout={10000}
              autoplaySpeed={3000}
              autoplay={true}
              margin={0}
              autoplayHoverPause={true}
              className="owl-theme"
            >
              {[product.image, ...product.images].map(
                (image) =>
                  image && (
                    <div
                      key={image}
                      style={{
                        width: '100%',
                        height: '500px',
                        marginBottom: '20px',
                      }}
                    >
                      <img
                        style={{
                          width: '100%',
                          height: '100%',
                          objecFit: 'contain',
                        }}
                        src={image}
                        alt="product"
                      />
                    </div>
                  )
              )}
              {product.video && (
                <video width="100%" controls muted autoplay>
                  <source src={product.video} type="video/mp4" />
                </video>
              )}
            </OwlCarousel>
          </div>
        </div> */}
        <div className="d-md-none mb-4">
          <CustomCarousel>
            {[product.image, ...product.images]
              .filter((image) => image)
              .map(
                (image) =>
                  image && (
                    <div
                      key={image}
                      style={{
                        width: "100vw",
                        marginLeft: "-20px",
                        height: "500px",
                      }}
                    >
                      <img
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                        src={image}
                        alt="product"
                      />
                    </div>
                  )
              )}
          </CustomCarousel>
        </div>
        <div className="single_product_center">
          {selectedImage === "video" ? (
            <video width="100%" controls muted autoplay>
              <source src={product.video} type="video/mp4" />
            </video>
          ) : (
            <MagnifyImage imgsrc={selectedImage || product.image} zoom={3} />
          )}
        </div>

        <div className="single_product_right">
          <div className="single_product_seller">
            {console.log(product)}
            <Imagediv>
              <img src={product.seller.image} alt={product.seller.username} />
              {product.seller.badge && (
                <div
                  className="seller_profile_badge"
                  style={{ right: "0px", bottom: "0px" }}
                >
                  <Badge src="https://res.cloudinary.com/emirace/image/upload/v1661148671/Icons-28_hfzerc.png" />
                </div>
              )}
            </Imagediv>
            <div className="single_product_seller_detail">
              <div className="single_product_seller_name">
                <Link
                  to={`/seller/${product.seller._id}`}
                  style={{ color: "var(--malon-color)" }}
                >
                  @{product.seller.username}
                </Link>
              </div>
              <div>
                {product.seller?.address?.state},{" "}
                {product.seller.region === "NGN" ? "Nigeria" : "South Africa"}
              </div>
              <ReviewsClick onClick={() => setShowModel(!showModel)}>
                <Rating
                  rating={product.seller.rating}
                  numReviews={product.numReviews}
                />
              </ReviewsClick>
              <ModelLogin showModel={showModel} setShowModel={setShowModel}>
                <ReviewLists
                  userId={product.seller._id}
                  setShowModel={setShowModel}
                />
              </ModelLogin>
            </div>
          </div>
          <div className="single_product_sold_status">
            <div className="single_produc_sold">
              <FontAwesomeIcon icon={faTag} />
              {product.seller.sold.length < 5
                ? "< 5"
                : product.seller.sold.length}{" "}
              sold
            </div>
            {isOnlineCon(product.seller._id) ? (
              <div className="single_produc_status">online</div>
            ) : (
              <div
                className="single_produc_status"
                style={{ borderColor: "grey", color: "grey" }}
              >
                offline
              </div>
            )}
          </div>
          {product.seller.rebundle.status && (
            <RebundlePoster style={{ marginTop: "5px" }} />
          )}

          <div className="single_product_actions">
            <IconContainer>
              <FontAwesomeIcon
                className={
                  userInfo && product.likes.find((x) => x === userInfo._id)
                    ? "orange-color"
                    : ""
                }
                onClick={toggleLikes}
                icon={faThumbsUp}
              />
              <IconsTooltips tips="Like Product " />
            </IconContainer>

            <IconContainer>
              <FontAwesomeIcon
                className={
                  userInfo &&
                  user &&
                  user.saved &&
                  user.saved.find((x) => x._id === product._id)
                    ? "orange-color"
                    : ""
                }
                onClick={() => {
                  saveItem();
                }}
                icon={faHeart}
              />
              <IconsTooltips tips="Add to wishlist " />
            </IconContainer>

            <ModelLogin
              showModel={showLoginModel}
              setShowModel={setShowLoginModel}
            >
              <Signin />
            </ModelLogin>
            <IconContainer>
              <FontAwesomeIcon
                onClick={() => addConversation(product.seller._id, product._id)}
                icon={faMessage}
              />
              <IconsTooltips tips="Message Seller " />
            </IconContainer>
            <IconContainer>
              <FontAwesomeIcon
                onClick={() => {
                  setShare(!share);
                }}
                icon={faShareNodes}
              />
              <IconsTooltips className="tiptools" tips="Share " />
            </IconContainer>
            <span
              onClick={() => setShare(!share)}
              className={share ? "active2" : ""}
            >
              <ShareButton
                url={window.location.href}
                product={product}
                dispatch={dispatch}
              />
            </span>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ marginRight: "50px" }}>
              <b>{product.likes.length} </b> Likes
            </div>
            <div>
              <b>{product.shares.length} </b> Shares
            </div>
          </div>
          <div>Listed {format(product.createdAt)}</div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <div className="sp_name">{product.name}</div>
            <div
              style={{
                fontSize: 15,
                marginLeft: 20,
                fontWeight: "400",
                color: "grey",
              }}
              className="sp_name"
            >
              {product.brand}
            </div>
          </div>
          <div className="sp_price_detail">
            <div className="sp_actual_price">
              {product.currency}
              {product.actualPrice}
            </div>
            {product.actualPrice !== product.price ? (
              <div className="sp_discount_price">
                {product.currenncy}
                {product.price}
              </div>
            ) : null}
            {discount() ? (
              <div className="sp_discount">
                (-{discount().toString().substring(0, 5)}% )
              </div>
            ) : (
              ""
            )}
          </div>
          <Taglist>
            Tags:
            {product.tags.map((t) => (
              <Link to={`/search?query=${t}`}>
                <Tag>{t}</Tag>
              </Link>
            ))}
          </Taglist>
          <div className="">
            {product.sizes.length > 0 && (
              <>
                <div className="select_size_header">select size: {size} </div>
                <div className="flexSelect">
                  {product.sizes.map(
                    (size) =>
                      size.value > 0 && (
                        <span key={size.size}>
                          <label
                            className={`sp_select_size_btn ${
                              selectSize === size.size ? "sp_btn_checked" : ""
                            }  `}
                            onClick={() => sizeHandler(size.size)}
                          >
                            {size.size}
                          </label>
                        </span>
                      )
                  )}

                  <span
                    style={{ textDecoration: "underline", cursor: "pointer" }}
                    onClick={() => setSizechartModel(true)}
                  >
                    size chart{" "}
                  </span>

                  <ModelLogin
                    showModel={sizechartModel}
                    setShowModel={setSizechartModel}
                  >
                    <Sizechart />
                  </ModelLogin>
                </div>
              </>
            )}
            <div className="sp_btn">
              {product.countInStock > 0 ? (
                <button onClick={addToCartHandler} className="sp_cart_btn">
                  add to cart
                </button>
              ) : (
                <button
                  style={{ backgroundColor: "grey", cursor: "not-allowed" }}
                  className="sp_cart_btn"
                >
                  sold out
                </button>
              )}

              <button className="sp_wishlist_btn " onClick={saveItem}>
                wishlist
              </button>
            </div>
            <div className="sp_more_detail">
              <div
                className={`sp_detail_section ${
                  overview ? "active" : ""
                } sp_detail_section_f`}
              >
                <div
                  className="sp_detail_title  sp_condition_cont"
                  onClick={() => toggleCollapse("overview")}
                  style={{ textTransform: "uppercase", marginBottom: "5px" }}
                >
                  Overview
                </div>
                <div className="sp_detail_contail">
                  <Table>
                    <tbody>
                      <TableRow mode={mode}>
                        <TableCell>Price</TableCell>
                        <TableCell>
                          {product.currency}
                          {product.actualPrice}
                        </TableCell>
                      </TableRow>
                      <TableRow mode={mode}>
                        <TableCell>Brand</TableCell>
                        <TableCell>{product.brand}</TableCell>
                      </TableRow>
                      <TableRow mode={mode}>
                        <TableCell>Category</TableCell>
                        <TableCell>{product.category}</TableCell>
                      </TableRow>
                      <TableRow mode={mode}>
                        <TableCell>Subcategory</TableCell>
                        <TableCell>{product.subCategory || "nal"}</TableCell>
                      </TableRow>
                      <TableRow mode={mode}>
                        <TableCell>Color</TableCell>
                        <TableCell>{product.color || "nal"}</TableCell>
                      </TableRow>
                    </tbody>
                  </Table>
                </div>
                {/* <Overview className="sp_detail_contail">
                  <LeftOverview>
                    <Key>Price</Key>
                    <Key>Brand</Key>
                    <Key>Category</Key>
                    <Key>Subcategory</Key>
                    <Key>Color</Key>
                  </LeftOverview>
                  <RightOverview>
                    <Value>
                      {product.currency}
                      {product.actualPrice}
                    </Value>
                    <Value>{product.brand}</Value>
                    <Value>{product.category}</Value>
                    <Value>{product.subCategory || "nal"}</Value>
                    <Value>{product.color || "nal"}</Value>
                  </RightOverview>
                </Overview> */}
              </div>
              <div
                className={`sp_detail_section ${
                  itemDetail ? "active" : ""
                } sp_detail_section_f`}
              >
                <div
                  className="sp_detail_title  sp_condition_cont"
                  onClick={() => toggleCollapse("itemDetail")}
                >
                  Item Description
                </div>
                <div className="sp_detail_contail">{product.description}</div>
              </div>
              <div
                className={`sp_detail_section ${condition ? "active" : ""} `}
              >
                <div className="">
                  <div
                    className="sp_detail_title sp_condition_cont"
                    onClick={() => toggleCollapse("condition")}
                  >
                    Condition
                  </div>
                </div>

                <div className="sp_detail_contail">
                  <div
                    className="sp_condition"
                    style={{ fontWeight: "bold", padding: "10px" }}
                  >
                    {product.condition}
                  </div>
                  <div style={{ textAlign: "justify" }}>
                    {conditionDetails(product.condition)}
                  </div>
                </div>
              </div>
              <div
                className={`sp_detail_section ${
                  shipping ? "active" : ""
                } sp_detail_section_f`}
              >
                <div
                  className="sp_detail_title "
                  onClick={() => toggleCollapse("shipping")}
                >
                  Shipping Location
                </div>
                <div className="sp_detail_contail">
                  {product.shippingLocation}
                </div>
              </div>
              {product.keyFeatures !== "Other" && (
                <div
                  className={`sp_detail_section ${
                    features ? "active" : ""
                  } sp_detail_section_f`}
                >
                  <div
                    className="sp_detail_title "
                    onClick={() => toggleCollapse("features")}
                  >
                    Key Features
                  </div>
                  <div className="sp_detail_contail">{product.keyFeatures}</div>
                </div>
              )}
              {product.specification && (
                <div
                  className={`sp_detail_section ${
                    specification ? "active" : ""
                  } sp_detail_section_f`}
                >
                  <div
                    className="sp_detail_title "
                    onClick={() => toggleCollapse("specification")}
                  >
                    Specification
                  </div>
                  <div className="sp_detail_contail">
                    {product.specification}
                  </div>
                </div>
              )}
            </div>
            <ProtectionRight />
            <Sustain mode={mode}>
              <SustainHeader style={{ fontWeight: "600" }}>
                REPEDDLE SUSTAINABILITY IMPACT
              </SustainHeader>
              <div style={{ fontSize: "14px" }}>
                <p>
                  Save our environment (AFRICA) and planet from Landfill, Water
                  pollution and Carbon Emission.
                </p>{" "}
                <p>
                  We advocate for <b>clean air</b>, <b>clean water</b> and a{" "}
                  <b>clean environment</b>. These are not too much to ask; these
                  are common basic living condition!!!
                </p>
                <p>
                  {" "}
                  By buying and{" "}
                  <Link
                    style={{
                      textDecoration: "underline",
                      color: "var(--malon-color)",
                    }}
                    to="/sell"
                  >
                    selling
                  </Link>{" "}
                  secondhand item on Repeddle, you’re not only reducing carbon
                  footprint and saving the planet, but you are giving an African
                  Child a better hope for tomorrow. Learn more on our
                  sustainability take{" "}
                  <Link
                    style={{
                      textDecoration: "underline",
                      color: "var(--malon-color)",
                    }}
                    to="/sustainability"
                  >
                    here.
                  </Link>
                </p>
              </div>
              <SustainHeader style={{ fontWeight: "600" }}>
                POSITIVE IMPACT OF USING SECONDHAND CLOTHES
              </SustainHeader>
              <SustainCont>
                <div style={{ flex: "1", marginTop: "4px" }}>
                  <FontAwesomeIcon icon={faWater} />
                </div>
                <div style={{ flex: "9" }}>
                  <Sustainbold>2,700L</Sustainbold> of water saved for one
                  person to drink for 900 days.
                </div>
              </SustainCont>
              <SustainCont>
                <div style={{ flex: "1", marginTop: "4px" }}>
                  <FontAwesomeIcon icon={faCloud} />
                </div>
                <div style={{ flex: "9" }}>
                  <Sustainbold>10%</Sustainbold> co2 of global carbon emissions
                  avoided.
                </div>
              </SustainCont>
              <SustainCont>
                <div style={{ flex: "1", marginTop: "4px" }}>
                  <FontAwesomeIcon icon={faLightbulb} />
                </div>
                <div style={{ flex: "9" }}>
                  <Sustainbold>98%</Sustainbold> Chance of clothes ending up in
                  landfills avoided.
                </div>
              </SustainCont>
            </Sustain>
            <ReportButton
              onClick={() => handlereport(product.seller._id, product._id)}
            >
              Report Item
            </ReportButton>

            <ModelLogin showModel={reportModel} setShowModel={setReportModel}>
              <Report
                reportedUser={product.seller._id}
                productName={product.name}
              />
            </ModelLogin>
          </div>
        </div>
      </div>

      <section className="product1">
        <div className="product-title">
          <h2 className="product-category1">Recently Viewed</h2>
        </div>
        <button onClick={() => sliderHandler("left")} className="pre-btn1">
          <i className="fa fa-angle-left"></i>
        </button>
        <button onClick={() => sliderHandler("right")} className="next-btn1">
          <i className="fa fa-angle-right"></i>
        </button>
        <div
          id="slider"
          className="product-container1 scroll_snap"
          // style={{
          //   transform: sliderstyle,
          // }}
        >
          {JSON.parse(localStorage.getItem("recentlyView") || "[]").map(
            (product) => (
              <div key={product.productId} className="smooth1">
                <Product product={product.product} />
              </div>
            )
          )}
        </div>
      </section>

      <section>
        <Tab>
          <TabItem
            className={displayTab === "comments" && "active"}
            onClick={() => setDisplayTab("comments")}
          >
            Comments ({comments.length})
          </TabItem>
          <TabItem
            className={displayTab === "reviews" && "active"}
            onClick={() => setDisplayTab("reviews")}
          >
            Reviews ({product.reviews.length})
          </TabItem>
        </Tab>
        <div className="container">{switchTab(displayTab)}</div>
      </section>
    </div>
  );
}
