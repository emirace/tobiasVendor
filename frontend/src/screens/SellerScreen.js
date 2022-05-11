import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
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
        loadingProduct: false,
        error: action.payload,
      };
    case 'FETCH_USER_REQUEST':
      return { ...state, loadingProduct: true, error: '' };
    case 'FETCH_USER_SUCCESS':
      return {
        ...state,
        loadingProduct: false,
        user: action.payload,
        error: '',
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

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

  const [{ loading, error, products, pages, user }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: '',
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_PRODUCT_REQUEST' });
        const { dataProduct } = await axios.get(
          `/api/products/seller/${sellerId}?page=${page}`
        );
        dispatch({ type: 'FETCH_PRODUCT_SUCCESS', payload: dataProduct });

        dispatch({ type: 'FETCH_USER_REQIEST' });
        const { dataUser } = await axios.get(`/api/users/seller/${sellerId}`);
        dispatch({ type: 'FETCH_USER_SUCCESS', payload: dataUser });
      } catch (err) {
        dispatch({ type: 'FETCH_PRODUCT_FAIL', error: getError(err) });
        toast.error(getError(err));
      }
    };
    fetchData();
  }, [page, sellerId]);
  return (
    <div className="seller_main_container">
      <div className="seller_left">{}</div>
      <div className="seller_right"></div>
    </div>
  );
}
