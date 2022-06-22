import axios from 'axios';
import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import ReactImageMagnify from 'react-image-magnify';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Rating from '../component/Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../component/LoadingBox';
import MessageBox from '../component/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';
import '../style/product.css';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleLeft,
  faAngleRight,
  faBookmark,
  faHeart,
  faMessage,
  faShareNodes,
  faTag,
} from '@fortawesome/free-solid-svg-icons';
import '../style/ProductScreen.css';
import styled from 'styled-components';
import IconsTooltips from '../component/IconsTooltips';
import ShareButton from '../component/ShareButton';
import ReviewLists from './ReviewLists';
import Model from '../component/Model';
import ModelLogin from '../component/ModelLogin';
import Signin from '../component/Signin';
import Comment from '../component/Comment';

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
      content: '';
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 100%;
      height: 2px;
      background: var(--orange-color);
    }
  }
`;

const reducer = (state, action) => {
  switch (action.type) {
    case 'REFRESH_PRODUCT':
      return { ...state, product: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreateReview: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreateReview: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreateReview: false };
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'COMMENT_SUCCESS':
      return { ...state, comments: action.payload };
    case 'COMMENT2_SUCCESS':
      const com = action.payload;
      return { ...state, comments: { ...state.comments, com } };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true };
    case 'UPLOAD_SUCCESS':
      return { ...state, loadingUpload: false, errorUpload: '' };
    case 'UPLOAD_FAIL':
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

export default function ProductScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo, mode } = state;
  let reviewRef = useRef();
  const navigate = useNavigate();

  const [rating, setRAting] = useState(0);
  const [comment, setComment] = useState('');
  const [comment2, setComment2] = useState('');
  const [itemDetail, setItemDetail] = useState(false);
  const [specification, setSpecification] = useState(false);
  const [condition, setCondition] = useState(false);
  const [shipping, setShipping] = useState(false);
  const [features, setFeatures] = useState(false);
  const [size, setSize] = useState('');
  const [share, setShare] = useState(false);

  const [displayTab, setDisplayTab] = useState('comments');

  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product, comments, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: true,
      error: '',
      comments: [],
    });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const { data } = await axios.get(`/api/comments/${product._id}`);
        dispatch({ type: 'COMMENT_SUCCESS', payload: data });
      } catch (err) {
        console.log(err);
      }
    };
    fetchComment();
  }, [product]);

  const [selectedImage, setSelectedImage] = useState('');
  const [sliderIndex, setSliderIndex] = useState(0);
  const [showModel, setShowModel] = useState(false);
  const [showLoginModel, setShowLoginModel] = useState(false);
  const [selectSize, setSelectSize] = useState('');
  const [image, setImage] = useState('');

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (!selectSize) {
      ctxDispatch({
        type: 'SHOW_TOAST',
        payload: {
          message: 'Select Size',
          showStatus: true,
          state1: 'visible1 error',
        },
      });
      return;
    }
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      ctxDispatch({
        type: 'SHOW_TOAST',
        payload: {
          message: 'Sorry. Product is out of stock',
          showStatus: true,
          state1: 'visible1 error',
        },
      });
      return;
    }

    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity, selectSize },
    });
    ctxDispatch({
      type: 'SHOW_NOTIFICAATION',
      payload: {
        text: 'Item added to Cart',
        showStatus: true,
        buttonText: 'Checkout',
        link: '/cart',
      },
    });
  };

  const sliderHandler = (direction) => {
    if (direction === 'left') {
      setSliderIndex(sliderIndex > 0 ? sliderIndex - 1 : 3);
    } else {
      setSliderIndex(sliderIndex < 3 ? sliderIndex + 1 : 0);
    }
  };

  const sliderstyle = `translateX(${sliderIndex * -80}vw)`;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error('Please enter comment and rating');
      return;
    }
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'CREATE_SUCCESS' });
      toast.success('REview submitted successfully');
      product.reviews.unshift(data.review);
      product.numReviews = data.numReviews;
      product.rating = data.rating;
      dispatch({ type: 'REFRESH_PRODUCT', payload: product });
      window.scrollTo({
        behavior: 'smooth',
        top: reviewRef.current.offsetTop,
      });
    } catch (err) {
      toast.error(getError(error));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };

  const submitCommentHandler = async (e) => {
    e.preventDefault();
    if (!comment2) {
      ctxDispatch({
        type: 'SHOW_TOAST',
        payload: {
          message: 'Enter a comment',
          showStatus: true,
          state1: 'visible1 error',
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
      dispatch({ type: 'COMMENT_SUCCESS', payload: comments });
      setComment2('');

      window.scrollTo({
        behavior: 'smooth',
        top: reviewRef.current.offsetTop,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const toggleCollapse = (type) => {
    switch (type) {
      case 'itemDetail':
        setItemDetail(!itemDetail);
        break;
      case 'condition':
        setCondition(!condition);
        break;
      case 'shipping':
        setShipping(!shipping);
        break;
      case 'features':
        setFeatures(!features);
        break;
      case 'specification':
        setSpecification(!specification);
        break;
      default:
        break;
    }
  };
  const saveItem = async () => {
    if (!userInfo) {
      ctxDispatch({
        type: 'SHOW_TOAST',
        payload: {
          message: 'login to save item',
          showStatus: true,
          state1: 'visible1 error',
        },
      });
      return;
    }
    if (product.seller._id === userInfo._id) {
      ctxDispatch({
        type: 'SHOW_TOAST',
        payload: {
          message: "You can't save your product",
          showStatus: true,
          state1: 'visible1 error',
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
        type: 'SHOW_TOAST',
        payload: {
          message: data.message,
          showStatus: true,
          state1: data.status,
        },
      });
      // dispatch({ type: 'REFRESH_PRODUCT', payload: data.user });
    } catch (err) {
      toast.error(getError(err));
    }
  };
  const toggleLikes = async () => {
    if (!userInfo) {
      ctxDispatch({
        type: 'SHOW_TOAST',
        payload: {
          message: 'Login to like',
          showStatus: true,
          state1: 'visible1 error',
        },
      });
      return;
    }
    if (product.seller._id === userInfo._id) {
      ctxDispatch({
        type: 'SHOW_TOAST',
        payload: {
          message: "You can't like your product",
          showStatus: true,
          state1: 'visible1 error',
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
        dispatch({ type: 'REFRESH_PRODUCT', payload: data.product });
        ctxDispatch({
          type: 'SHOW_TOAST',
          payload: {
            message: 'Item unLiked',
            showStatus: true,
            state1: 'visible1 error',
          },
        });
      } else {
        const { data } = await axios.put(
          `/api/products/${product._id}/likes`,
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'REFRESH_PRODUCT', payload: data.product });
        ctxDispatch({
          type: 'SHOW_TOAST',
          payload: {
            message: 'Item Liked',
            showStatus: true,
            state1: 'visible1 success',
          },
        });
      }
    } catch (err) {
      console.log(getError(err));
    }
  };

  const uploadImageHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });
      setImage(data.secure_url);
      ctxDispatch({
        type: 'SHOW_TOAST',
        payload: {
          message: 'Image Uploaded',
          showStatus: true,
          state1: 'visible1 success',
        },
      });
    } catch (err) {
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
      ctxDispatch({
        type: 'SHOW_TOAST',
        payload: {
          message: 'Failed uploading image',
          showStatus: true,
          state1: 'visible1 error',
        },
      });
      console.log(getError(err));
    }
  };

  const switchTab = (tab) => {
    switch (tab) {
      case 'comments':
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
                  <Comment key={comment._id} commentC={comment} />
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
                          mode === 'pagebodydark' ? '' : 'color_black'
                        }`}
                        onChange={(e) => setComment2(e.target.value)}
                      />
                      <input
                        type="file"
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
                  <MessageBox>
                    Please{' '}
                    <Link to={`/signin?redirect=/product/${product.slug}`}>
                      Sign In
                    </Link>{' '}
                    to write a review
                  </MessageBox>
                )}
              </div>
            </div>
          </>
        );
      case 'reviews':
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
                    <strong>{review.name}</strong>
                    <Rating rating={review.rating} caption=" "></Rating>
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
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
                          mode === 'pagebodydark' ? '' : 'color_black'
                        }`}
                        as="textarea"
                        placeholder="Leave a comment here"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    </FloatingLabel>
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
                  <MessageBox>
                    Please{' '}
                    <Link to={`/signin?redirect=/product/${product.slug}`}>
                      Sign In
                    </Link>{' '}
                    to write a review
                  </MessageBox>
                )}
              </div>
            </div>
          </>
        );

      default:
        break;
    }
  };

  const addConversation = async (id) => {
    try {
      const { data } = await axios.post(
        `/api/conversations/`,
        { recieverId: id },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      navigate(`/messages?conversation=${product.seller._id}`);
    } catch (err) {
      ctxDispatch({
        type: 'SHOW_TOAST',
        payload: {
          message: getError(err),
          showStatus: true,
          state1: 'visible1 error',
        },
      });
    }
  };

  const sizeHandler = (item) => {
    switch (item) {
      case 'S':
        const current = product.sizes.filter((s) => s.size === 'S');
        if (current.length > 0) {
          setSize(`Small ( ${current[0].value} left)`);
          setSelectSize('S');
        } else {
          setSize('Out of stock');
          setSelectSize('');
        }
        break;
      case 'M':
        const current1 = product.sizes.filter((s) => s.size === 'M');
        if (current1.length > 0) {
          setSize(`Medium ( ${current1[0].value} left)`);
          setSelectSize('M');
        } else {
          setSize('Out of stock');
          setSelectSize('');
        }
        break;
      case 'L':
        const current2 = product.sizes.filter((s) => s.size === 'L');
        if (current2.length > 0) {
          setSize(`Large ( ${current2[0].value} left)`);
          setSelectSize('L');
        } else {
          setSize('Out of stock');
          setSelectSize('');
        }
        break;
      case 'XL':
        const current3 = product.sizes.filter((s) => s.size === 'XL');
        if (current3.length > 0) {
          setSize(`XL ( ${current3[0].value} left)`);
          setSelectSize('XL');
        } else {
          setSize('Out of stock');
          setSelectSize('');
        }
        break;
      case 'XXL':
        const current4 = product.sizes.filter((s) => s.size === 'XXL');
        if (current4.length > 0) {
          setSize(`XXL ( ${current4[0].value} left)`);
          setSelectSize('XXL');
        } else {
          setSize('Out of stock');
          setSelectSize('');
        }
        break;
      default:
        break;
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
      </Helmet>
      <div className="single_product_container">
        <div className="single_product_left">
          {[product.image, ...product.images].map((x, index) => (
            <div
              key={index}
              className="single_product_multi_image"
              onClick={() => setSelectedImage(x)}
            >
              <img
                src={x}
                alt=""
                className={selectedImage === x ? 'active1' : ''}
              />
            </div>
          ))}
        </div>
        <div className=" col-sm-12 col-md-6 d-block d-md-none">
          <div className=" row justify-content-center">
            <div className="moblie-slider">
              {/* <div
                onClick={() => sliderHandler('left')}
                className="mobile-image-arrow-left"
              >
                <FontAwesomeIcon icon={faAngleLeft} />
              </div>
              <div
                onClick={() => sliderHandler('right')}
                className="mobile-image-arrow-right"
              >
                <FontAwesomeIcon icon={faAngleRight} />
              </div> */}
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
          <ReactImageMagnify
            imageClassName="single_main_image"
            {...{
              smallImage: {
                alt: `${product.name}`,
                isFluidWidth: true,
                src: selectedImage || `${product.image}`,
              },
              largeImage: {
                src: selectedImage || `${product.image}`,
                width: 1018,
                height: 1244,
              },
            }}
          />
        </div>
        <div className="single_product_right">
          <div className="single_product_seller">
            <img src={product.seller.image} alt={product.seller.name} />
            <div className="single_product_seller_detail">
              <div className="single_product_seller_name">
                <Link to={`/seller/${product.seller._id}`}>
                  {product.seller.name}
                </Link>
              </div>
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
                    ? 'orange-color'
                    : ''
                }
                onClick={toggleLikes}
                icon={faHeart}
              />
              <IconsTooltips tips="Like Product " />
            </IconContainer>

            <IconContainer>
              <FontAwesomeIcon
                onClick={() => {
                  if (!userInfo) {
                    setShowLoginModel(true);
                    return;
                  }
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
                onClick={() => addConversation(product.seller._id)}
                icon={faMessage}
              />
              <IconsTooltips tips="Message Seller " />
            </IconContainer>
            <IconContainer>
              <FontAwesomeIcon
                onClick={() => setShare(!share)}
                icon={faShareNodes}
              />
              <IconsTooltips className="tiptools" tips="Share " />
            </IconContainer>
            <span className={share ? 'active2' : ''}>
              <ShareButton url={`fb.com`} />
            </span>
          </div>
          <div>
            <b>{product.likes.length} </b> Likes
          </div>
          <div className="sp_name">{product.name}</div>
          <div className="sp_price_detail">
            <div className="sp_actual_price">${product.actualPrice}</div>
            <div className="sp_discount_price">${product.price}</div>
            <div className="sp_discount">
              ({' '}
              {(((product.price - product.actualPrice) / product.price) * 100)
                .toString()
                .substring(0, 5)}
              % )
            </div>
          </div>
          <div className="">
            <div className="select_size_header">select size: {size} </div>
            <div className="flexSelect">
              <input type="radio" name="size" value="s" hidden id="s-size" />
              <label
                for="size"
                className={`sp_select_size_btn ${
                  selectSize === 'S' ? 'sp_btn_checked' : ''
                }  `}
                onClick={() => sizeHandler('S')}
              >
                S
              </label>
              <input type="radio" name="size" value="m" hidden id="m-size" />
              <label
                for="size"
                className={`sp_select_size_btn ${
                  selectSize === 'M' ? 'sp_btn_checked' : ''
                }  `}
                onClick={() => sizeHandler('M')}
              >
                M
              </label>
              <input type="radio" name="size" value="l" hidden id="l-size" />
              <label
                for="size"
                className={`sp_select_size_btn ${
                  selectSize === 'L' ? 'sp_btn_checked' : ''
                }  `}
                onClick={() => sizeHandler('L')}
              >
                L
              </label>
              <input type="radio" name="size" value="xl" hidden id="xl-size" />
              <label
                for="size"
                className={`sp_select_size_btn ${
                  selectSize === 'XL' ? 'sp_btn_checked' : ''
                }  `}
                onClick={() => sizeHandler('XL')}
              >
                XL
              </label>
              <input
                type="radio"
                name="size"
                value="xxl"
                hidden
                id="xxl-size"
              />
              <label
                for="size"
                className={`sp_select_size_btn ${
                  selectSize === 'XXL' ? 'sp_btn_checked' : ''
                }  `}
                onClick={() => sizeHandler('XXL')}
              >
                XXL
              </label>
            </div>
            <div className="sp_btn">
              <button onClick={addToCartHandler} className="sp_cart_btn">
                add to cart
              </button>

              <button className="sp_wishlist_btn " onClick={saveItem}>
                wishlist
              </button>
            </div>
            <div className="sp_more_detail">
              <div
                className={`sp_detail_section ${
                  itemDetail ? 'active' : ''
                } sp_detail_section_f`}
              >
                <div
                  className="sp_detail_title  sp_condition_cont"
                  onClick={() => toggleCollapse('itemDetail')}
                >
                  Item Description
                </div>
                <div className="sp_detail_contail">{product.description}</div>
              </div>
              <div
                className={`sp_detail_section ${condition ? 'active' : ''} `}
              >
                <div className="">
                  <div
                    className="sp_detail_title sp_condition_cont"
                    onClick={() => toggleCollapse('condition')}
                  >
                    Condition
                  </div>
                </div>

                <div className="sp_detail_contail">
                  <div className="sp_condition">{product.condition}</div>Item is
                  in good conditon
                </div>
              </div>
              <div
                className={`sp_detail_section ${
                  shipping ? 'active' : ''
                } sp_detail_section_f`}
              >
                <div
                  className="sp_detail_title "
                  onClick={() => toggleCollapse('shipping')}
                >
                  Shipping Location
                </div>
                <div className="sp_detail_contail">
                  {product.shippingLocation}
                </div>
              </div>
              <div
                className={`sp_detail_section ${
                  features ? 'active' : ''
                } sp_detail_section_f`}
              >
                <div
                  className="sp_detail_title "
                  onClick={() => toggleCollapse('features')}
                >
                  Key Features
                </div>
                <div className="sp_detail_contail">{product.keyFeatures}</div>
              </div>
              <div
                className={`sp_detail_section ${
                  specification ? 'active' : ''
                } sp_detail_section_f`}
              >
                <div
                  className="sp_detail_title "
                  onClick={() => toggleCollapse('specification')}
                >
                  Specification
                </div>
                <div className="sp_detail_contail">{product.specification}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <section className="product-details1 row">
        <div className=" col-sm-12 col-md-6 d-none d-md-block">
          <div className=" row justify-content-center">
            <ReactImageMagnify
              imageClassName="small-img"
              {...{
                smallImage: {
                  alt: `${product.name}`,
                  isFluidWidth: true,
                  src: selectedImage || `${product.image}`,
                },
                largeImage: {
                  src: selectedImage || `${product.image}`,
                  width: 679,
                  height: 829,
                },
              }}
            />
          </div>
          <div className="product-images1 row mt-3">
            {[product.image, ...product.images].map((x) => (
              <div className="col-3" onClick={() => setSelectedImage(x)}>
                <img
                  src={x}
                  alt=""
                  className={selectedImage === x ? 'active1' : ''}
                />
              </div>
            ))}
          </div>
        </div>
        <div className=" col-sm-12 col-md-6 d-block d-md-none">
          <div className=" row justify-content-center">
            <div className="moblie-slider">
              <div
                onClick={() => sliderHandler('left')}
                className="mobile-image-arrow-left"
              >
                <i class="fa fa-angle-left"></i>
              </div>
              <div
                onClick={() => sliderHandler('right')}
                className="mobile-image-arrow-right"
              >
                <i class="fa fa-angle-right"></i>
              </div>
              <div className="mobile-image">
                <img
                  style={{ transform: sliderstyle }}
                  src={product.image}
                  alt="product"
                ></img>
                <img
                  style={{ transform: sliderstyle }}
                  src="/images/p1.jpg"
                  alt="product"
                ></img>
                <img
                  style={{ transform: sliderstyle }}
                  src="/images/p1.jpg"
                  alt="product"
                ></img>
                <img
                  style={{ transform: sliderstyle }}
                  src="/images/p1.jpg"
                  alt="product"
                ></img>
              </div>
            </div>
          </div>
        </div>
        <div className="detailsm1 col-sm-12 col-md-6">
          <div className="seller_section">
            <ul className="card card-body">
              <li>
                <div className="profile_row">
                  <div>
                    <img
                      src={product.seller.seller.logo}
                      className="profile_image"
                      alt={product.seller.seller.name}
                    ></img>
                  </div>
                  <div className="profile_name">
                    <h3>{product.seller.seller.name}</h3>
                  </div>
                </div>
              </li>
              <li>
                <Rating
                  rating={product.seller.seller.rating}
                  caption={''}
                  numReviews={product.seller.seller.numReviews}
                ></Rating>
              </li>
              <li className="profile_icon_group">
                <a
                  className="profile_icon"
                  href={`mailto:${product.seller.email}`}
                >
                  <FontAwesomeIcon icon={faMessage} />
                </a>
                <div className="profile_icon">
                  <FontAwesomeIcon icon={faHeart} />
                </div>
              </li>
              <li>{product.seller.seller.description}</li>
            </ul>
          </div>
          <div className="select-size">
            <h2 className="product-brand1">{product.name} </h2>
            <i className="fa fa-heart ml-2px"></i> 147
          </div>
          <p className="product-short-desc2">Gucci</p>
          <span className="product-price1">${product.price}</span>
          <span className="product-actual-price1">${product.price * 2}</span>
          <span className="product-discount1">( 50% off )</span>

          <div className="select-size">
            <p className="product-sub-heading1">select size: </p>
            <input type="radio" name="size" value="s" hidden id="s-size" />
            <label for="size" className="size-radio-btn1 checked">
              s
            </label>
            <input type="radio" name="size" value="m" hidden id="m-size" />
            <label for="size" className="size-radio-btn1">
              m
            </label>
            <input type="radio" name="size" value="l" hidden id="l-size" />
            <label for="size" className="size-radio-btn1">
              l
            </label>
            <input type="radio" name="size" value="xl" hidden id="xl-size" />
            <label for="size" className="size-radio-btn1">
              xl
            </label>
            <input type="radio" name="size" value="xxl" hidden id="xxl-size" />
            <label for="size" className="size-radio-btn1">
              xxl
            </label>
          </div>
          <div className="row">
            <button className="btn1 col-md-6 col-12 cart-btn1 ml-1">
              add to cart
            </button>
            &nbsp;
            <button className="btn1 col-md-6 col-12 ">wishlist</button>
          </div>
          <section className="detail-desc1">
            <h2 className="heading1">description</h2>
            <p className="desc1">{product.description}</p>
          </section>
        </div>
      </section> */}
      <section className="product1">
        <div className="product-title">
          <h2 className="product-category1">Related Products</h2>
        </div>
        <button className="pre-btn1">
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>
        <button className="next-btn1">
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
        <div className="product-container1">
          <div className="product-card1">
            <div className="product-image1">
              <span className="discount-tag1">50% off</span>
              <img
                src="/images/card4.png"
                className="product-thumb1"
                alt="product"
              ></img>
              <button className="card-btn1">add to whislist</button>
            </div>
            <div className="product-info1">
              <h2 className="product-brand1">brand</h2>
              <p className="product-short-desc1">
                short line above the cloth...
              </p>
              <span className="price1">$120</span>
              <span className="actual-price1">$150</span>
            </div>
          </div>
          <div className="product-card1">
            <div className="product-image1">
              <span className="discount-tag1">50% off</span>
              <img
                src="/images/card1.png"
                className="product-thumb1"
                alt="product"
              ></img>
              <button className="card-btn1">add to whislist</button>
            </div>
            <div className="product-info1">
              <h2 className="product-brand1">brand</h2>
              <p className="product-short-desc1">
                short line above the cloth...
              </p>
              <span className="price1">$120</span>
              <span className="actual-price1">$150</span>
            </div>
          </div>
          <div className="product-card1">
            <div className="product-image1">
              <span className="discount-tag1">50% off</span>
              <img
                src="/images/card2.png"
                className="product-thumb1"
                alt="product"
              ></img>
              <button className="card-btn1">add to whislist</button>
            </div>
            <div className="product-info1">
              <h2 className="product-brand1">brand</h2>
              <p className="product-short-desc1">
                short line above the cloth...
              </p>
              <span className="price1">$120</span>
              <span className="actual-price1">$150</span>
            </div>
          </div>
          <div className="product-card1">
            <div className="product-image1">
              <span className="discount-tag1">50% off</span>
              <img
                src="/images/card4.png"
                className="product-thumb1"
                alt="product"
              ></img>
              <button className="card-btn1">add to whislist</button>
            </div>
            <div className="product-info1">
              <h2 className="product-brand1">brand</h2>
              <p className="product-short-desc1">
                short line above the cloth...
              </p>
              <span className="price1">$120</span>
              <span className="actual-price1">$150</span>
            </div>
          </div>
          <div className="product-card1">
            <div className="product-image1">
              <span className="discount-tag1">50% off</span>
              <img
                src="/images/card6.png"
                className="product-thumb1"
                alt="product"
              ></img>
              <button className="card-btn1">add to whislist</button>
            </div>
            <div className="product-info1">
              <h2 className="product-brand1">brand</h2>
              <p className="product-short-desc1">
                short line above the cloth...
              </p>
              <span className="price1">$120</span>
              <span className="actual-price1">$150</span>
            </div>
          </div>
          <div className="product-card1">
            <div className="product-image1">
              <span className="discount-tag1">50% off</span>
              <img
                src="/images/card7.png"
                className="product-thumb1"
                alt="product"
              ></img>
              <button className="card-btn1">add to whislist</button>
            </div>
            <div className="product-info1">
              <h2 className="product-brand1">brand</h2>
              <p className="product-short-desc1">
                short line above the cloth...
              </p>
              <span className="price1">$120</span>
              <span className="actual-price1">$150</span>
            </div>
          </div>
          <div className="product-card1">
            <div className="product-image1">
              <span className="discount-tag1">50% off</span>
              <img
                src="/images/card8.png"
                className="product-thumb1"
                alt="product"
              ></img>
              <button className="card-btn1">add to whislist</button>
            </div>
            <div className="product-info1">
              <h2 className="product-brand1">brand</h2>
              <p className="product-short-desc1">
                short line above the cloth...
              </p>
              <span className="price1">$120</span>
              <span className="actual-price1">$150</span>
            </div>
          </div>
        </div>
      </section>
      <section>
        <Tab>
          <TabItem
            className={displayTab === 'comments' && 'active'}
            onClick={() => setDisplayTab('comments')}
          >
            Comments
          </TabItem>
          <TabItem
            className={displayTab === 'reviews' && 'active'}
            onClick={() => setDisplayTab('reviews')}
          >
            Reviews
          </TabItem>
        </Tab>
        <div className="container">{switchTab(displayTab)}</div>
      </section>
      {/* <Row>
        <Col md={6}>
          <img className="img-large" src={product.image} alt={product.name} />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating rating={product.rating} numReviews={product.numReviews} />
            </ListGroup.Item>
            <ListGroup.Item>Price : ${product.price}</ListGroup.Item>
            <ListGroup.Item>
              Description:
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>${product.price}</Col>
                  </Row>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant="primary">
                        Add to Cart
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row> */}
    </div>
  );
}
