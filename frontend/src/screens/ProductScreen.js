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
import Badge from "react-bootstrap/Badge";
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
import "../style/product.css";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faBookmark,
  faFaceSmile,
  faHeart,
  faMessage,
  faQuestionCircle,
  faShareNodes,
  faTag,
  faThumbsDown,
  faThumbsUp,
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
  flex: 3;
`;
const Key = styled.div`
  font-weight: 500;
`;
const Value = styled.div``;

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
  margin: 10px;
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
        console.log(views);
        const existing = views.find((x) => x.productId === data._id);

        console.log(!existing, "hello");
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
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);
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
    if (!selectSize) {
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
          message: "Signin/Register to save an item",
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
          message: "You can't save your product",
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
          message: "Sign in / Register to like",
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
          message: "Log in or Create account to send a message",
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

  const handleShare = async () => {
    if (userInfo) {
      try {
        const { data } = await axios.put(
          `/api/products/${product._id}/shares`,
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "REFRESH_PRODUCT", payload: data.product });
        if (data.product) {
          socket.emit("post_data", {
            userId: product.seller._id,
            itemId: product._id,
            notifyType: "share",
            msg: `${userInfo.username} shared your product`,
            link: `/product/${product.slug}`,
            userImage: userInfo.image,
          });
        }
      } catch (err) {
        console.log(err);
      }
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
                {userInfo ? (
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
                )}
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
          message: "Signin/Register to start a conversation",
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

  const sizeHandler = (item, item2) => {
    const current = product.sizes.filter((s) => s.size === item);
    if (current.length > 0) {
      setSize(`${item2} ( ${current[0].value} left)`);
      setSelectSize(item);
    } else {
      setSize("Out of stock");
      setSelectSize("");
    }
  };

  const discount = () => {
    return ((product.price - product.actualPrice) / product.price) * 100;
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>{product.name}</title>
      </Helmet>
      <div className="single_product_container">
        <div className="single_product_left">
          {[product.image, ...product.images].map(
            (x, index) =>
              x && (
                <div
                  key={index}
                  className="single_product_multi_image"
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
        </div>
        <div className=" col-sm-12 col-md-6 d-block d-md-none">
          <div className=" row justify-content-center">
            <div className="moblie-slider">
              <div
                onClick={() => sliderHandler("left")}
                className="mobile-image-arrow-left"
              >
                <FontAwesomeIcon icon={faAngleLeft} />
              </div>
              <div
                onClick={() => sliderHandler("right")}
                className="mobile-image-arrow-right"
              >
                <FontAwesomeIcon icon={faAngleRight} />
              </div>
              <div className="mobile-image scroll_snap">
                <img
                  style={{ transform: sliderstyle }}
                  src={product.image}
                  alt="product"
                ></img>
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    style={{ transform: sliderstyle }}
                    src={image}
                    alt="product"
                  ></img>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="single_product_center">
          <MagnifyImage imgsrc={selectedImage || product.image} zoom={3} />
        </div>

        <div className="single_product_right">
          <div className="single_product_seller">
            <img src={product.seller.image} alt={product.seller.username} />
            <div className="single_product_seller_detail">
              <div className="single_product_seller_name">
                <Link to={`/seller/${product.seller._id}`}>
                  @{product.seller.username}
                </Link>
              </div>
              {console.log(product)}
              <div>Benin City, Nigeria</div>
              <ReviewsClick onClick={() => setShowModel(!showModel)}>
                <Rating
                  rating={product.seller.rating}
                  numReviews={product.seller.numReviews}
                />
              </ReviewsClick>
              <Model showModel={showModel} setShowModel={setShowModel}>
                <ReviewLists />
              </Model>
            </div>
          </div>
          <div className="single_product_sold_status">
            <div className="single_produc_sold">
              <FontAwesomeIcon icon={faTag} />
              {product.seller.sold.length} sold
            </div>
            <div className="single_produc_status">online</div>
          </div>
          <div className="single_product_actions">
            <IconContainer>
              <FontAwesomeIcon
                className={
                  userInfo && product.likes.find((x) => x === userInfo._id)
                    ? "orange-color"
                    : ""
                }
                onClick={toggleLikes}
                icon={faHeart}
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
                icon={faBookmark}
              />
              <IconsTooltips tips="Save Product " />
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
                  handleShare();
                }}
                icon={faShareNodes}
              />
              <IconsTooltips className="tiptools" tips="Share " />
            </IconContainer>
            <span
              onClick={() => setShare(!share)}
              className={share ? "active2" : ""}
            >
              <ShareButton url={window.location.href} />
            </span>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ marginRight: "100px" }}>
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
            <div className="sp_discount_price">
              {product.currenncy}
              {product.price}
            </div>
            {discount() ? (
              <div className="sp_discount">
                ({discount().toString().substring(0, 5)}% )
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
            <div className="select_size_header">select size: {size} </div>
            <div className="flexSelect">
              {product.sizes.map((size) => (
                <span key={size.size}>
                  <label
                    className={`sp_select_size_btn ${
                      selectSize === size.size ? "sp_btn_checked" : ""
                    }  `}
                    onClick={() => sizeHandler(size.size, size.name)}
                  >
                    {console.log("k")}
                    {size.size}
                  </label>
                </span>
              ))}

              <span
                style={{ textDecoration: "underline", cursor: "pointer" }}
                onClick={() => setSizechartModel(true)}
              >
                size chart{" "}
              </span>
              {console.log("hello")}

              <ModelLogin
                showModel={sizechartModel}
                setShowModel={setSizechartModel}
              >
                <Sizechart />
              </ModelLogin>
            </div>
            <div className="sp_btn">
              {product.countInStock > 0 ? (
                <button onClick={addToCartHandler} className="sp_cart_btn">
                  add to cart
                </button>
              ) : (
                <button
                  style={{ backgroundColor: "grey" }}
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
              <div style={{ textTransform: "uppercase", marginBottom: "5px" }}>
                Overview
              </div>
              <Overview>
                <LeftOverview>
                  <Key>Price</Key>
                  <Key>Brand</Key>
                  <Key>Category</Key>
                  <Key>SubCategory</Key>
                  <Key>Color</Key>
                  <Key>Size</Key>
                </LeftOverview>
                <RightOverview>
                  <Value>{product.actualPrice}</Value>
                  <Value>{product.brand}</Value>
                  <Value>{product.category}</Value>
                  <Value>{product.subCategory || "nal"}</Value>
                  <Value>{product.color || "nal"}</Value>
                  <Value>{product.size || "nal"}</Value>
                  {console.log("hello")}
                </RightOverview>
              </Overview>
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
                  <div className="sp_condition">{product.condition}</div>
                  {conditionDetails(product.condition)}
                </div>
              </div>
              <div
                className={`sp_detail_section ${
                  shipping ? "active" : ""
                } sp_detail_section_f`}
              >
                {console.log("hello")}
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
                <div className="sp_detail_contail">{product.specification}</div>
              </div>
            </div>
            <ProtectionRight />
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
