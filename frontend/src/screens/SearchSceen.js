import React, { useEffect, useReducer, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getError } from '../utils';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import LinkContainer from 'react-router-bootstrap/LinkContainer';
import Rating from '../component/Rating';
import LoadingBox from '../component/LoadingBox';
import MessageBox from '../component/MessageBox';
import Product from '../component/Product';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleDot } from '@fortawesome/free-solid-svg-icons';

import '../style/SearchScreen.css';
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
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

const prices = [
  {
    name: '$1 to $50',
    value: '1-50',
  },
  {
    name: '$51 to $200',
    value: '51-200',
  },
  {
    name: '$201 to $1000',
    value: '201-1000',
  },
];

const ratings = [
  {
    name: '4stars & up',
    rating: 4,
  },
  {
    name: '3stars & up',
    rating: 3,
  },
  {
    name: '2stars & up',
    rating: 2,
  },
  {
    name: '1star & up',
    rating: 1,
  },
];

export default function SearchSceen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const category = sp.get('category') || 'all';
  const query = sp.get('query') || 'all';
  const rating = sp.get('rating') || 'all';
  const price = sp.get('price') || 'all';
  const order = sp.get('order') || 'newest';
  const page = sp.get('page') || 1;

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/products/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [category, order, page, price, query, rating]);

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, [dispatch]);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const filterOrder = filter.order || order;
    return `/search?category=${filterCategory}&query=${filterQuery}&page=${filterPage}&price=${filterPrice}&rating=${filterRating}&order=${filterOrder}`;
  };

  const [filterSidebar, setFilterSidebar] = useState(false);

  const [cateClass, setCateClass] = useState(true);
  const [priceClass, setPriceClass] = useState(true);
  const [reviewClass, setReviewClass] = useState(true);
  const toggleCollapse = (type) => {
    switch (type) {
      case 'category':
        setCateClass(!cateClass);
        break;
      case 'price':
        setPriceClass(!priceClass);
        break;
      case 'review':
        setReviewClass(!reviewClass);
        break;

      default:
        break;
    }
  };

  const mode = localStorage.getItem('mode')
    ? localStorage.getItem('mode')
    : 'pagebodylight';

  return (
    <div>
      <Helmet>
        <title>Search Product</title>
      </Helmet>
      <div className="container">
        <Row>
          <Col md={3} className="d-none d-lg-block">
            <div
              className={`search_cate_container ${cateClass ? 'active' : ''}`}
            >
              <div
                className="seaarch_cate_heading"
                onClick={() => toggleCollapse('category')}
              >
                category
              </div>
              <ul className="search_cate_content">
                <li>
                  <FontAwesomeIcon icon={faCircleDot} />
                  <Link
                    className={'all' === category ? 'text-bold' : ''}
                    to={getFilterUrl({ category: 'all' })}
                  >
                    All
                  </Link>
                </li>
                {categories.map((c) => (
                  <li key={c}>
                    <FontAwesomeIcon icon={faCircleDot} />
                    <Link
                      className={c === category ? 'text-bold' : ''}
                      to={getFilterUrl({ category: c })}
                    >
                      {c}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className={`search_cate_container ${priceClass ? 'active' : ''}`}
            >
              <div
                className="seaarch_cate_heading"
                onClick={() => toggleCollapse('price')}
              >
                Price
              </div>
              <ul className="search_cate_content">
                <li>
                  <FontAwesomeIcon icon={faCircleDot} />
                  <Link
                    className={'all' === price ? 'text-bold' : ''}
                    to={getFilterUrl({ price: 'all' })}
                  >
                    All
                  </Link>
                </li>
                {prices.map((p) => (
                  <li key={p.value}>
                    <FontAwesomeIcon icon={faCircleDot} />
                    <Link
                      className={p.value === price ? 'text-bold' : ''}
                      to={getFilterUrl({ price: p.value })}
                    >
                      {p.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className={`search_cate_container ${reviewClass ? 'active' : ''}`}
            >
              <div
                className="seaarch_cate_heading"
                onClick={() => toggleCollapse('review')}
              >
                Avg Review
              </div>
              <ul className="search_cate_content">
                {ratings.map((r) => (
                  <li key={r.name}>
                    <FontAwesomeIcon icon={faCircleDot} />
                    <Link
                      className={
                        `${r.rating}` === `${rating}` ? 'text-bold' : ''
                      }
                      to={getFilterUrl({ rating: r.rating })}
                    >
                      <Rating caption={' & up'} rating={r.rating}></Rating>
                    </Link>
                  </li>
                ))}
                <li>
                  <FontAwesomeIcon icon={faCircleDot} />
                  <Link
                    className={rating === 'all' ? 'text-bold' : ''}
                    to={getFilterUrl({ rating: 'all' })}
                  >
                    <Rating caption={' & up'} rating={0}></Rating>
                  </Link>
                </li>
              </ul>
            </div>
          </Col>
          <Col md={12} lg={9}>
            {loading ? (
              <LoadingBox></LoadingBox>
            ) : error ? (
              <MessageBox variant="danger">{error}</MessageBox>
            ) : (
              <>
                <Row className="justify-content-between mb-3">
                  <button
                    className="filter_btn col-3 d-block d-lg-none"
                    onClick={() => setFilterSidebar(!filterSidebar)}
                  >
                    Filters
                  </button>
                  <Col className="text-end ">
                    Sort by{' '}
                    <select
                      className="search_sortBy"
                      value={order}
                      onChange={(e) => {
                        navigate(getFilterUrl({ order: e.target.value }));
                      }}
                    >
                      <option className={mode || ''} value="newest">
                        Newest Arrivals
                      </option>
                      <option className={mode || ''} value="lowest">
                        Price: Low to High
                      </option>
                      <option className={mode || ''} value="highest">
                        Price: High to Low
                      </option>
                      <option className={mode || ''} value="toprated">
                        Avg. Customer Reviews
                      </option>
                    </select>
                  </Col>
                </Row>
                <div
                  className="d-block d-lg-none"
                  onClick={() => setFilterSidebar(!filterSidebar)}
                >
                  <div
                    className={`filter_sidebar  ${
                      filterSidebar ? 'active' : ''
                    }`}
                  >
                    <div
                      className={`search_cate_container ${
                        cateClass ? 'active' : ''
                      }`}
                    >
                      <div
                        className="seaarch_cate_heading"
                        onClick={() => toggleCollapse('category')}
                      >
                        category
                      </div>
                      <ul className="search_cate_content">
                        <li>
                          <FontAwesomeIcon icon={faCircleDot} />
                          <Link
                            className={'all' === category ? 'text-bold' : ''}
                            to={getFilterUrl({ category: 'all' })}
                          >
                            All
                          </Link>
                        </li>
                        {categories.map((c) => (
                          <li key={c}>
                            <FontAwesomeIcon icon={faCircleDot} />
                            <Link
                              className={c === category ? 'text-bold' : ''}
                              to={getFilterUrl({ category: c })}
                            >
                              {c}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div
                      className={`search_cate_container ${
                        priceClass ? 'active' : ''
                      }`}
                    >
                      <div
                        className="seaarch_cate_heading"
                        onClick={() => toggleCollapse('price')}
                      >
                        Price
                      </div>
                      <ul className="search_cate_content">
                        <li>
                          <FontAwesomeIcon icon={faCircleDot} />
                          <Link
                            className={'all' === price ? 'text-bold' : ''}
                            to={getFilterUrl({ price: 'all' })}
                          >
                            All
                          </Link>
                        </li>
                        {prices.map((p) => (
                          <li key={p.value}>
                            <FontAwesomeIcon icon={faCircleDot} />
                            <Link
                              className={p.value === price ? 'text-bold' : ''}
                              to={getFilterUrl({ price: p.value })}
                            >
                              {p.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div
                      className={`search_cate_container ${
                        reviewClass ? 'active' : ''
                      }`}
                    >
                      <div
                        className="seaarch_cate_heading"
                        onClick={() => toggleCollapse('review')}
                      >
                        Avg Review
                      </div>
                      <ul className="search_cate_content">
                        {ratings.map((r) => (
                          <li key={r.name}>
                            <FontAwesomeIcon icon={faCircleDot} />
                            <Link
                              className={
                                `${r.rating}` === `${rating}` ? 'text-bold' : ''
                              }
                              to={getFilterUrl({ rating: r.rating })}
                            >
                              <Rating
                                caption={' & up'}
                                rating={r.rating}
                              ></Rating>
                            </Link>
                          </li>
                        ))}
                        <li>
                          <FontAwesomeIcon icon={faCircleDot} />
                          <Link
                            className={rating === 'all' ? 'text-bold' : ''}
                            to={getFilterUrl({ rating: 'all' })}
                          >
                            <Rating caption={' & up'} rating={0}></Rating>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <Row>
                  <Col>
                    <div className="d-flex search_result">
                      {countProducts === 0 ? 'No' : countProducts} Results
                      {query !== 'all' && ' : ' + query}
                      {category !== 'all' && ' : ' + category}
                      {price !== 'all' && ' : Price ' + price}
                      {rating !== 'all' && ' : Rating' + rating + ' & up'}
                      {query !== 'all' ||
                      category !== 'all' ||
                      rating !== 'all' ||
                      price !== 'all' ? (
                        <Button
                          variant="none"
                          onClick={() => navigate('/search')}
                        >
                          <i className="fas fa-times-circle"></i>
                        </Button>
                      ) : null}
                    </div>
                  </Col>
                </Row>
                {products.length === 0 && (
                  <MessageBox>No Product Found</MessageBox>
                )}
                <Row>
                  {products.map((product) => (
                    <Col sm={6} lg={4} className="mb-3 col-6" key={product._id}>
                      <Product product={product}></Product>
                    </Col>
                  ))}
                </Row>
                <div>
                  {[...Array(pages).keys()].map((x) => (
                    <LinkContainer
                      key={x + 1}
                      className="mx-1"
                      to={getFilterUrl({ page: x + 1 })}
                    >
                      <Button
                        className={Number(page) === x + 1 ? 'text-bold' : ''}
                        variant="none"
                      >
                        {x + 1}
                      </Button>
                    </LinkContainer>
                  ))}
                </div>
              </>
            )}
          </Col>
        </Row>
      </div>
    </div>
  );
}
