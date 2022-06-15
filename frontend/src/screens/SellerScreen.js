import axios from 'axios';
import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingBox from '../component/LoadingBox';
import MessageBox from '../component/MessageBox';
import Rating from '../component/Rating';
import { getError } from '../utils';
import '../style/SellerScreen.css';
import Product from '../component/Product';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt,
  faGlobe,
  faHeart,
  faLocationDot,
  faMessage,
  faStar,
  faTag,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import styled from 'styled-components';
import { Store } from '../Store';
import Model from '../component/Model';
import ReviewLists from './ReviewLists';

const Right = styled.div`
  flex: 3;
  margin: 0 15px;
  @media (max-width: 992px) {
    margin: 0;
  }
`;
const Tab = styled.div`
  display: flex;
  margin-bottom: 5px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
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
const Content = styled.div`
  display: flex;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 5px;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  @media (max-width: 992px) {
    padding: 0;
  }
`;
const ProductCont = styled.div`
  width: 214px;
  height: 450px;
  margin: 10px;
  overflow: hidden;
  @media (max-width: 992px) {
    width: 162px;
    height: 342px;
    margin: 5px 3px;
  }
`;

const ReviewsClick = styled.div`
  cursor: pointer;
`;

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_USER_REQUEST':
      return { ...state, loadingUser: true };
    case 'FETCH_USER_SUCCESS':
      return {
        ...state,
        loadingUser: false,
        user: action.payload,
        error: '',
      };
    case 'FETCH_PRODUCT_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_PRODUCT_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_PRODUCT_FAIL':
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
  const { id: sellerId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [displayTab, setDisplayTab] = useState('all');
  const [showModel, setShowModel] = useState(false);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

  const navigate = useNavigate();

  const [{ loading, loadingUser, error, products, pages, user }, dispatch] =
    useReducer(reducer, {
      loading: true,
      loadingUser: true,
      error: '',
      user: {},
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_USER_REQUEST' });
        const { data: dataUser } = await axios.get(
          `/api/users/seller/${sellerId}`
        );
        dispatch({ type: 'FETCH_USER_SUCCESS', payload: dataUser });

        dispatch({ type: 'FETCH_PRODUCT_REQUEST' });
        const { data: dataProduct } = await axios.get(
          `/api/products/seller/${sellerId}?page=${page}`
        );
        dispatch({
          type: 'FETCH_PRODUCT_SUCCESS',
          payload: dataProduct,
        });
      } catch (err) {
        dispatch({ type: 'FETCH_PRODUCT_FAIL', error: getError(err) });
        toast.error(getError(err));
      }
    };
    fetchData();
  }, [page, sellerId]);

  const toggleFollow = async () => {
    if (user.name === userInfo.name) {
      alert('you can like your store');
      return;
    }

    if (!userInfo) {
      toast.error('login to follow');
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
        dispatch({ type: 'FETCH_USER_SUCCESS', payload: data });
      } else {
        const { data } = await axios.put(
          `/api/users/follow/${sellerId}`,
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: 'FETCH_USER_SUCCESS', payload: data });
      }
    } catch (err) {
      toast.error(getError(err));
    }
  };

  const tabSwitch = (tab) => {
    switch (tab) {
      case 'all':
        return (
          <>
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
      case 'selling':
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

      case 'sold':
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
                      <Product product={product} />
                    </ProductCont>
                  )
              )
            )}
          </>
        );
      case 'liked':
        return (
          <>
            {loading ? (
              <LoadingBox></LoadingBox>
            ) : error ? (
              <MessageBox variant="danger">{error}</MessageBox>
            ) : products.length === 0 ? (
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
      case 'saved':
        return (
          <>
            {loading ? (
              <LoadingBox></LoadingBox>
            ) : error ? (
              <MessageBox variant="danger">{error}</MessageBox>
            ) : products.length === 0 ? (
              <MessageBox>No Product Found</MessageBox>
            ) : (
              user.saved.map((product) => (
                <ProductCont key={product._id}>
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

  const addConversation = async (id) => {
    try {
      const { data } = await axios.post(
        `/api/conversations`,
        { recieverId: id },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      navigate(`/messages?conversation=${sellerId}`);
    } catch (err) {
      console.log(err, err.message);
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
            <div className="seller_profile_block">
              <div className="seller_image_group">
                <img
                  src={user.image}
                  className="seller_profile_image"
                  alt={user.name}
                />
                <div className="seller_profile_badge">
                  <FontAwesomeIcon icon={faStar} />
                </div>
              </div>
              <FontAwesomeIcon className="seller_profile_icon" icon={faHeart} />
              <div className="seller_profile_status">online</div>
              <div className="seller_profile_name">{user.name}</div>
              <div className="seller_profile_follow">
                <div className="seller_profile_follower">
                  <div className="seller_profile_follow_num">
                    {user.followers.length}
                  </div>
                  <div className="">Followers</div>
                </div>
                <div className="seller_profile_follower">
                  <div className="seller_profile_follow_num">
                    {user.following.length}
                  </div>
                  <div className="">Following</div>
                </div>
                <button
                  type="button"
                  onClick={toggleFollow}
                  className="seller_follow_btn"
                >
                  {userInfo && user.followers.find((x) => x === userInfo._id)
                    ? 'Unfollow'
                    : 'Follow'}
                </button>
              </div>
              <ReviewsClick onClick={() => setShowModel(!showModel)}>
                <Rating rating={user.rating} numReviews={user.numReviews} />
              </ReviewsClick>
              <Model showModel={showModel} setShowModel={setShowModel}>
                <ReviewLists />
              </Model>
              <button
                onClick={() => addConversation(user._id)}
                type="buton"
                className="profile_contact_btn"
              >
                Message Me
              </button>
              <div className="seller_profile_detail">
                <div className="seller_single_detail">
                  <div>
                    <FontAwesomeIcon icon={faTag} /> Sold
                  </div>
                  {console.log('user', user)}
                  <div className="seller_single_right">{user.sold.length}</div>
                </div>

                <div className="seller_single_detail">
                  <div>
                    <FontAwesomeIcon icon={faUser} /> Member since
                  </div>
                  <div className="seller_single_right">2022</div>
                </div>
                <div className="seller_single_detail">
                  <div>
                    <FontAwesomeIcon icon={faLocationDot} /> From
                  </div>
                  <div className="seller_single_right">Nigeria</div>
                </div>
                <div className="seller_single_detail">
                  <div>
                    <FontAwesomeIcon icon={faGlobe} /> Language
                  </div>
                  <div className="seller_single_right">English</div>
                </div>
              </div>
            </div>
            <div className="seller_profile_block">
              <div className="seller_profile_detail seller_detail_first">
                <div className="seller_detail_title">About Seller</div>
                <div className="seller_detail_content">{user.about}</div>
              </div>
            </div>
          </>
        )}
      </div>
      <Right>
        <Tab>
          <TabItem
            className={displayTab === 'all' && 'active'}
            onClick={() => setDisplayTab('all')}
          >
            All
          </TabItem>
          <TabItem
            className={displayTab === 'selling' && 'active'}
            onClick={() => setDisplayTab('selling')}
          >
            Selling
          </TabItem>
          <TabItem
            className={displayTab === 'sold' && 'active'}
            onClick={() => setDisplayTab('sold')}
          >
            Sold
          </TabItem>
          <TabItem
            className={displayTab === 'liked' && 'active'}
            onClick={() => setDisplayTab('liked')}
          >
            Liked
          </TabItem>
          {userInfo && userInfo._id === sellerId && (
            <TabItem
              className={displayTab === 'saved' && 'active'}
              onClick={() => setDisplayTab('saved')}
            >
              Saved
            </TabItem>
          )}
        </Tab>
        <Content>{tabSwitch(displayTab)}</Content>
      </Right>
      {/* <div className="seller_right">
        <div className="seller_right_products">
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : products.length === 0 ? (
            <MessageBox>No Product Found</MessageBox>
          ) : (
            products.map((product) => (
              <Product key={product._id} product={product}></Product>
            ))
          )}
        </div>
        <div>
          {[...Array(pages).keys()].map((x) => (
            <Link
              className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
              key={x + 1}
              to={`/seller/${sellerId}?page=${x + 1}`}
            >
              {x + 1}
            </Link>
          ))}
        </div>
      </div> */}
    </div>
  );
}
