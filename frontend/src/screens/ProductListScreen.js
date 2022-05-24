import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import LoadingBox from '../component/LoadingBox';
import MessageBox from '../component/MessageBox';
import { getError } from '../utils';
import { toast } from 'react-toastify';

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
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return { ...state, loadingCreate: false };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };
    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return { ...state, loadingDelete: false, successDelete: true };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };
    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};
export default function ProductListScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const sellerMode = () => {
    return userInfo.isSeller && !userInfo.isAdmin ? true : false;
  };
  const isSellerMode = sellerMode();

  const [
    {
      loading,
      error,
      products,
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });

        // const { data } = await axios.get(`/api/products/admin?page=${page}`, {
        //   headers: { Authorization: `Bearer ${userInfo.token}` },
        // });

        const { data } = await axios.get(
          `/api/products/${isSellerMode ? 'seller/' : 'admin'}${
            isSellerMode ? userInfo._id : ''
          }?page=${page}`,
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );

        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete, isSellerMode]);

  const deleteHandler = async (product) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        dispatch({ type: 'DELETE_REQUEST' });
        await axios.delete(`/api/products/${product._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('product delected successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(err));
        dispatch({ type: 'DELETE_FAIL' });
      }
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <h1>Products</h1>
        </div>
        <div className="col text-end">
          <Link to="/createproduct">
            <button className="search-btn1">Create Product</button>
          </Link>
        </div>
      </div>
      {loadingCreate && <LoadingBox></LoadingBox>}
      {loadingDelete && <LoadingBox></LoadingBox>}

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
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product._id}</td>
                  <td>{product.name}</td>
                  <td>{product.price}</td>
                  <td>{product.category}</td>
                  <td>{product.brand}</td>
                  <td>
                    <button
                      className="search-btn1"
                      type="button"
                      onClick={() => navigate(`/admin/product/${product._id}`)}
                    >
                      Edit
                    </button>
                    &nbsp;
                    <button
                      className="search-btn1"
                      type="button"
                      onClick={() => deleteHandler(product)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                key={x + 1}
                to={`/${isSellerMode ? 'seller' : 'admin'}/product?page=${
                  x + 1
                }`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
