import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import LoadingBox from '../component/LoadingBox';
import MessageBox from '../component/MessageBox';
import { getError } from '../utils';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

const Container = styled.div`
  width: 100%;
  margin: 0 20px;
  height: 200px;
`;

const Content = styled.div`
  display: flex;
  height: 130px;
  border: 1px solid rgba(99, 91, 91, 0.2);
  padding: 5px;
`;
const Left = styled.div`
  flex: 1;
`;
const Center = styled.div`
  flex: 7;
  display: flex;
  flex-direction: column;

  padding: 5px;
`;
const Right = styled.div`
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: capitalize;
  color: var(--orange-color);
  cursor: pointer;
  & svg {
    color: var(--orange-color);
  }
  &:hover {
    color: var(--malon-color);
  }
`;
const OrderImg = styled.img.attrs({
  src: '/images/pimage.png',
  alt: 'imag',
})`
  object-fit: cover;
  width: 120px;
  height: 120px;
`;
const Name = styled.div`
  text-transform: capitalize;
  margin: 0 5px 10px 5px;
  @media (max-width: 992px) {
    width: 180px;
    overflow: hidden;
    display: inline-block;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;
const OrderNum = styled.div`
  font-size: 13px;
  margin: 0 5px 10px 5px;
`;
const Status = styled.div`
  margin: 0 5px 10px 5px;

  background: green;
  color: #fff;
  font-size: 13px;
  padding: 2px 5px;
  width: 70px;
  text-align: center;

  border: 0;
  cursor: none;
`;
const Date = styled.div`
  margin: 0 5px 10px 5px;
`;

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
    <>
      <Helmet>
        <title>Products</title>
      </Helmet>
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
            <Container>
              <Content>
                <Left>
                  <OrderImg></OrderImg>
                </Left>
                <Center>
                  <Name>this is the dress of all hshevfwgge</Name>
                  <OrderNum>Order 123456789098765543</OrderNum>
                  <Status>Delivered</Status>
                  <Date>On 22-02-22</Date>
                </Center>
                <Right>
                  <FontAwesomeIcon icon={faPen} />
                </Right>
              </Content>
            </Container>

            {/* <table className="table">
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
                        onClick={() =>
                          navigate(`/admin/product/${product._id}`)
                        }
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
            </table> */}
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
    </>
  );
}
