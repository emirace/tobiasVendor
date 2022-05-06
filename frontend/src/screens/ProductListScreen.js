import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { Store } from '../Store';
import LoadingBox from '../component/LoadingBox';
import MessageBox from '../component/MessageBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};
export default function ProductListScreen() {
  const [{ loading, error, products, pages }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const { search, pathname } = useLocation(Store);
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

  const { state } = useContext;
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });

        const { data } = await axios.get(`api/products/admin?page=${page}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err });
      }
    };
    fetchData();
  }, [page, userInfo]);
  return (
    <div className="container">
      <h1>Products</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>PRICE</th>
                <th>CATEGORY</th>
                <th>BRAND</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                <tr key={product._Id}>
                  <td>{product._Id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.caregory}</td>
                  <td>{product.brand}</td>
                </tr>;
              })}
            </tbody>
          </table>
          <div>
            {[...Array(pages).keys()].map((x) => {
              <Link
                className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                key={x + 1}
                to={`/productlist?page=${x + 1}`}
              >
                {x + 1}
              </Link>;
            })}
          </div>
        </>
      )}
    </div>
  );
}
