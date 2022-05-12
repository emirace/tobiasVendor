import axios from 'axios';
import React, { useEffect, useReducer } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
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

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

  const [{ loading, loadingUser, error, products, pages, user }, dispatch] =
    useReducer(reducer, {
      loading: true,
      loadingUser: true,
      error: '',
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
        dispatch({ type: 'FETCH_PRODUCT_SUCCESS', payload: dataProduct });
      } catch (err) {
        dispatch({ type: 'FETCH_PRODUCT_FAIL', error: getError(err) });
        toast.error(getError(err));
      }
    };
    fetchData();
  }, [page, sellerId]);
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
                  src={user.seller.logo}
                  className="seller_profile_image"
                  alt={user.seller.name}
                />
                <div className="seller_profile_badge">
                  <FontAwesomeIcon icon={faStar} />
                </div>
              </div>
              <FontAwesomeIcon className="seller_profile_icon" icon={faHeart} />
              <div className="seller_profile_status">online</div>
              <div className="seller_profile_name">{user.seller.name}</div>
              <div className="seller_profile_follow">
                <div className="seller_profile_follower">
                  <div className="seller_profile_follow_num">102</div>
                  <div className="">Followers</div>
                </div>
                <div className="seller_profile_follower">
                  <div className="seller_profile_follow_num">51</div>
                  <div className="">Following</div>
                </div>
                <button type="button" className="seller_follow_btn">
                  Follow
                </button>
              </div>
              <Rating
                rating={user.seller.rating}
                numReviews={user.seller.numReviews}
              />
              <button type="buton" className="profile_contact_btn">
                Contact Me
              </button>
              <div className="seller_profile_detail">
                <div className="seller_single_detail">
                  <div>
                    <FontAwesomeIcon icon={faTag} /> Sold
                  </div>
                  <div className="seller_single_right">152</div>
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
                <div className="seller_detail_title">Store description</div>
                <div className="seller_detail_content">
                  {user.seller.description}
                </div>
              </div>
              <div className="seller_profile_detail ">
                <div className="seller_detail_title">About seller</div>
                <div className="seller_detail_content">
                  The href attribute requires a valid value to be accessible.
                  Provide a valid, navigable address as the href value. If you
                  cannot provide a valid href, but still need the element to
                  resemble a link, use a button and change it with appropriate
                  styles. Learn more
                </div>
              </div>
            </div>
          </>

          //   <ul className="card card-body">
          //     <li>
          //       <div className="profile_row">
          //         <div>
          //           <img
          //             src={user.seller.logo}
          //             className="profile_image"
          //             alt={user.seller.name}
          //           ></img>
          //         </div>
          //         <div className="profile_name">
          //           <h3>{user.seller.name}</h3>
          //         </div>
          //       </div>
          //     </li>
          //     <li>
          //       <Rating
          //         rating={user.seller.rating}
          //         caption={''}
          //         numReviews={user.seller.numReviews}
          //       ></Rating>
          //     </li>
          //     <li className="profile_icon_group">
          //       <a className="profile_icon" href={`mailto:${user.email}`}>
          //         <FontAwesomeIcon icon={faMessage} />
          //       </a>
          //       <div className="profile_icon">
          //         <FontAwesomeIcon icon={faHeart} />
          //       </div>
          //     </li>
          //     <li>{user.seller.description}</li>
          //   </ul>
        )}
      </div>
      <div className="seller_right">
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
      </div>
    </div>
  );
}
