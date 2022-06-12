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
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  margin-top: 10px;
`;
const Left = styled.div`
  flex: 2;
  height: calc(100vh-168px);
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev1)' : 'var(--light-ev1)'};
  position: sticky;
  border-radius: 0.2rem;
  top: 168px;
`;
const Right = styled.div`
  flex: 6;
  margin: 0 20px;
  padding: 20px;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev1)' : 'var(--light-ev1)'};
`;

const Wrapper = styled.div`
  padding: 20px;
`;
const Menu = styled.div`
  margin-bottom: 10px;
`;
const Title = styled.h3`
  font-size: 14px;
  cursor: pointer;
  position: relative;
  &::after {
    content: ' ';
    width: 8px;
    height: 8px;
    border-bottom: 1px solid;
    border-left: 1px solid;
    transform: rotate(-45deg) translateY(-50%);
    position: absolute;
    top: 50%;
    right: 20px;
  }
  &.activate::after {
    content: '';
    transform: rotate(135deg);
  }
`;

const List = styled.ul`
  padding: 5px;
  height: 0;
  overflow: hidden;
  transition: 0.5s;
  &.activate {
    height: 100%;
  }
`;
const ListItem = styled.li`
  padding: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 0.2rem;
  &.active,
  &:hover {
    background: ${(props) =>
      props.mode === 'pagebodydark' ? 'var(--dark-ev2)' : 'var(--light-ev3)'};
  }
  & svg {
    margin-right: 5px;
    font-size: 8px;
    color: var(--malon-color);
  }
`;
const Color = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const Input = styled.input`
  background: none;
  border: 1px solid var(--malon-color);
  padding: 5px 10px;
  border-radius: 0.4rem;
  margin-top: 5px;
  color: ${(props) =>
    props.mode === 'pagebodydark'
      ? 'var(--white-color)'
      : 'var(--black-color)'};
`;

const ProductListC = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const Result = styled.div`
  display: flex;
  margin-bottom: 5px;
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
  const color = sp.get('color') || 'all';
  const brand = sp.get('brand') || 'all';

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  let brands = ['Nike', 'Gucci', 'Rolex', 'Louis Vuitto', 'Adidas', 'Dior'];

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
    const filterColor = filter.color || color;
    const filterBrand = filter.brand || brand;
    return `/search?category=${filterCategory}&query=${filterQuery}&page=${filterPage}&price=${filterPrice}&rating=${filterRating}&order=${filterOrder}&color=${filterColor}&brand=${filterBrand}`;
  };

  const [filterSidebar, setFilterSidebar] = useState(false);

  const [cateClass, setCateClass] = useState(true);
  const [priceClass, setPriceClass] = useState(true);
  const [reviewClass, setReviewClass] = useState(true);
  const [colorClass, setColorClass] = useState(true);
  const [brandClass, setBrandClass] = useState(true);
  const [brandInput, setBrandInput] = useState('');
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
      case 'color':
        setColorClass(!colorClass);
        break;
      case 'brand':
        setBrandClass(!brandClass);
        break;

      default:
        break;
    }
  };

  const mode = localStorage.getItem('mode')
    ? localStorage.getItem('mode')
    : 'pagebodylight';

  const handleInput = (e) => {
    e.preventDefault();
    setBrandInput(e.target.value);
  };
  if (brandInput.length > 0) {
    brands = brands.filter((i) => {
      return i.toLowerCase().match(brandInput);
    });
  }
  return (
    <div>
      <Helmet>
        <title>Search Product</title>
      </Helmet>
      <Container>
        <Left mode={mode}>
          <Wrapper>
            <Menu>
              <Title onClick={() => toggleCollapse('category')}>
                Categories
              </Title>
              <List className={cateClass ? 'activate' : ''}>
                <Link
                  className={'all' === category ? 'text-bold' : ''}
                  to={getFilterUrl({ category: 'all' })}
                >
                  <ListItem mode={mode}>
                    <FontAwesomeIcon icon={faCircleDot} />
                    All
                  </ListItem>
                </Link>
                <Link
                  className={'womenswear' === category ? 'text-bold' : ''}
                  to={getFilterUrl({ category: 'womenswear' })}
                >
                  <ListItem mode={mode}>
                    <FontAwesomeIcon icon={faCircleDot} />
                    Womenswear
                  </ListItem>
                </Link>
                <Link
                  className={'menswear' === category ? 'text-bold' : ''}
                  to={getFilterUrl({ category: 'menswear' })}
                >
                  <ListItem mode={mode}>
                    <FontAwesomeIcon icon={faCircleDot} />
                    Menswear
                  </ListItem>
                </Link>
                <Link
                  className={'kids' === category ? 'text-bold' : ''}
                  to={getFilterUrl({ category: 'kids' })}
                >
                  <ListItem mode={mode}>
                    <FontAwesomeIcon icon={faCircleDot} />
                    Kids
                  </ListItem>
                </Link>
                <Link
                  className={'curve+plus' === category ? 'text-bold' : ''}
                  to={getFilterUrl({ category: 'curve+plus' })}
                >
                  <ListItem mode={mode}>
                    <FontAwesomeIcon icon={faCircleDot} />
                    Curve+Plus
                  </ListItem>
                </Link>
                <Link
                  className={'tops' === category ? 'text-bold' : ''}
                  to={getFilterUrl({ category: 'tops' })}
                >
                  <ListItem mode={mode}>
                    <FontAwesomeIcon icon={faCircleDot} />
                    Tops
                  </ListItem>
                </Link>
                <Link
                  className={'outerwear' === category ? 'text-bold' : ''}
                  to={getFilterUrl({ category: 'outerwear' })}
                >
                  <ListItem mode={mode}>
                    <FontAwesomeIcon icon={faCircleDot} />
                    Outerwear
                  </ListItem>
                </Link>
              </List>
            </Menu>
            <Menu>
              <Title onClick={() => toggleCollapse('brand')}>Brands</Title>
              <List className={brandClass ? 'activate' : ''}>
                <Input
                  mode={mode}
                  type="text"
                  placeholder="Search brands"
                  onChange={handleInput}
                />
                {brands.map((p, index) => (
                  <div key={index}>
                    <Link
                      className={p === brand ? 'text-bold' : ''}
                      to={getFilterUrl({ brand: p })}
                    >
                      <ListItem mode={mode}>
                        <FontAwesomeIcon icon={faCircleDot} />
                        {p}
                      </ListItem>
                    </Link>
                  </div>
                ))}
              </List>
            </Menu>
            <Menu>
              <Title onClick={() => toggleCollapse('price')}>Prices</Title>
              <List className={priceClass ? 'activate' : ''}>
                <Link
                  className={'all' === price ? 'text-bold' : ''}
                  to={getFilterUrl({ price: 'all' })}
                >
                  <ListItem mode={mode}>
                    <FontAwesomeIcon icon={faCircleDot} />
                    All
                  </ListItem>
                </Link>
                {prices.map((p) => (
                  <div key={p.value}>
                    <Link
                      className={p.value === price ? 'text-bold' : ''}
                      to={getFilterUrl({ price: p.value })}
                    >
                      <ListItem mode={mode}>
                        <FontAwesomeIcon icon={faCircleDot} />
                        {p.name}
                      </ListItem>
                    </Link>
                  </div>
                ))}
              </List>
            </Menu>
            <Menu>
              <Title
                className={reviewClass ? 'activate' : ''}
                onClick={() => toggleCollapse('review')}
              >
                Reviews
              </Title>
              <List className={reviewClass ? 'activate' : ''}>
                {ratings.map((r) => (
                  <div key={r.name}>
                    <Link
                      className={
                        `${r.rating}` === `${rating}` ? 'text-bold' : ''
                      }
                      to={getFilterUrl({ rating: r.rating })}
                    >
                      <ListItem mode={mode}>
                        <Rating caption={' & up'} rating={r.rating}></Rating>
                      </ListItem>
                    </Link>
                  </div>
                ))}
                <Link
                  className={rating === 'all' ? 'text-bold' : ''}
                  to={getFilterUrl({ rating: 'all' })}
                >
                  <ListItem mode={mode}>
                    <Rating caption={' & up'} rating={0}></Rating>
                  </ListItem>
                </Link>
              </List>
            </Menu>
            <Menu>
              <Title onClick={() => toggleCollapse('color')}>Color</Title>
              <List className={colorClass ? 'activate' : ''}>
                <Link
                  className={'all' === color ? 'text-bold' : ''}
                  to={getFilterUrl({ color: 'all' })}
                >
                  <ListItem mode={mode}>All</ListItem>
                </Link>
                <Color>
                  <Link
                    className={'all' === color ? 'text-bold' : ''}
                    to={getFilterUrl({ color: 'black' })}
                  >
                    <ListItem mode={mode}>
                      <div
                        style={{
                          background: 'black',
                          width: '30px',
                          height: '20px',
                          borderRadius: '0.2rem',
                        }}
                      ></div>
                    </ListItem>
                  </Link>
                  <Link
                    className={'womenswear' === color ? 'text-bold' : ''}
                    to={getFilterUrl({ color: 'red' })}
                  >
                    <ListItem mode={mode}>
                      <div
                        style={{
                          background: 'red',
                          width: '30px',
                          height: '20px',
                          borderRadius: '0.2rem',
                        }}
                      ></div>
                    </ListItem>
                  </Link>
                  <Link
                    className={'menswear' === color ? 'text-bold' : ''}
                    to={getFilterUrl({ color: 'green' })}
                  >
                    <ListItem mode={mode}>
                      <div
                        style={{
                          background: 'green',
                          width: '30px',
                          height: '20px',
                          borderRadius: '0.2rem',
                        }}
                      ></div>
                    </ListItem>
                  </Link>
                  <Link
                    className={'kids' === color ? 'text-bold' : ''}
                    to={getFilterUrl({ color: 'blue' })}
                  >
                    <ListItem mode={mode}>
                      <div
                        style={{
                          background: 'blue',
                          width: '30px',
                          height: '20px',
                          borderRadius: '0.2rem',
                        }}
                      ></div>
                    </ListItem>
                  </Link>
                  <Link
                    className={'curve+plus' === color ? 'text-bold' : ''}
                    to={getFilterUrl({ color: 'pink' })}
                  >
                    <ListItem mode={mode}>
                      <div
                        style={{
                          background: 'pink',
                          width: '30px',
                          height: '20px',
                          borderRadius: '0.2rem',
                        }}
                      ></div>
                    </ListItem>
                  </Link>
                  <Link
                    className={'tops' === color ? 'text-bold' : ''}
                    to={getFilterUrl({ color: 'orange' })}
                  >
                    <ListItem mode={mode}>
                      <div
                        style={{
                          background: 'orange',
                          width: '30px',
                          height: '20px',
                          borderRadius: '0.2rem',
                        }}
                      ></div>
                    </ListItem>
                  </Link>
                  <Link
                    className={'outerwear' === color ? 'text-bold' : ''}
                    to={getFilterUrl({ color: 'purple' })}
                  >
                    <ListItem mode={mode}>
                      <div
                        style={{
                          background: 'purple',
                          width: '30px',
                          height: '20px',
                          borderRadius: '0.2rem',
                        }}
                      ></div>
                    </ListItem>
                  </Link>
                </Color>
              </List>
            </Menu>
          </Wrapper>
        </Left>
        <Right mode={mode}>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <Result>
                {countProducts === 0 ? 'No' : countProducts} Results
                {query !== 'all' && ' : ' + query}
                {category !== 'all' && ' : ' + category}
                {price !== 'all' && ' : Price ' + price}
                {rating !== 'all' && ' : Rating' + rating + ' & up'}
                {query !== 'all' ||
                category !== 'all' ||
                rating !== 'all' ||
                price !== 'all' ? (
                  <Button variant="none" onClick={() => navigate('/search')}>
                    <i className="fas fa-times-circle"></i>
                  </Button>
                ) : null}
              </Result>
              {products.length === 0 && (
                <MessageBox>No Product Found</MessageBox>
              )}
              <ProductListC>
                {products.map((product) => (
                  <Product product={product}></Product>
                ))}
              </ProductListC>
            </>
          )}
        </Right>
      </Container>
      {/* <div className="container">
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
                    className={`filter_btn col-3 d-block d-lg-none ${
                      filterSidebar ? 'active' : ''
                    }`}
                    onClick={() => setFilterSidebar(!filterSidebar)}
                  >
                    Filters
                  </button>
                  <Col className="text-end ">
                    Sort by
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
                <div className="d-block d-lg-none">
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
                      <ul
                        className="search_cate_content"
                        onClick={() => setFilterSidebar(!filterSidebar)}
                      >
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
                      <ul
                        className="search_cate_content"
                        onClick={() => setFilterSidebar(!filterSidebar)}
                      >
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
                      <ul
                        className="search_cate_content"
                        onClick={() => setFilterSidebar(!filterSidebar)}
                      >
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
      </div> */}
    </div>
  );
}
