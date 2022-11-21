import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { getError, region } from "../utils";
import axios from "axios";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import Row from "react-bootstrap/Row";
import LinkContainer from "react-router-bootstrap/LinkContainer";
import Rating from "../component/Rating";
import LoadingBox from "../component/LoadingBox";
import MessageBox from "../component/MessageBox";
import Product from "../component/Product";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDot, faTimes } from "@fortawesome/free-solid-svg-icons";
import "../style/SearchScreen.css";
import styled from "styled-components";
import { Store } from "../Store";
import SearchBox from "../component/SearchBox";
import SearchFilter from "./SearchFilter";
import { BiFilter } from "react-icons/bi";

const Container = styled.div`
  display: flex;
  margin-top: 10px;
`;
const Name = styled.h1`
  font-weight: bold;
  text-transform: capitalize;
  display: flex;
  justify-content: center;
  padding-top: 20px;
`;
const Left = styled.div`
  flex: 1;
  height: calc(100vh-168px);
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  position: sticky;
  border-radius: 0.2rem;
  margin-bottom: 20px;
  top: 168px;
  @media (max-width: 992px) {
    left: ${(props) => (props.showFilter ? 0 : "-100vw")};
    display: ${(props) => (props.showFilter ? "block" : "none")};
    transition: left 2s;
    z-index: 9;
    position: absolute;
    width: 100vw;
    top: 0;
  }
`;
const Right = styled.div`
  flex: 4;
  margin: 0 10px;
  padding: 10px;
  border-radius: 0.2rem;
  margin-bottom: 20px;

  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  @media (max-width: 992px) {
    margin: 0;
    margin-bottom: 10px;
    padding: 10px;
  }
`;

const ProductListC = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  margin-top: 10px;
`;

const Result = styled.div`
  display: flex;
  margin-bottom: 5px;
  @media (max-width: 992px) {
    display: none;
  }
`;
const RowCont = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Col = styled.div``;

const Searchcont = styled.div`
  display: none;
  margin-bottom: 15px;
  @media (max-width: 992px) {
    display: block;
  }
`;
const EachCont = styled.div`
  width: 25%;
  display: flex;
  justify-content: center;
  @media (max-width: 992px) {
    width: 50%;
  }
`;

const Filters = styled.div`
  background: var(--orange-color);
  padding: 5px 7px;
  color: white;
  border-radius: 0.2rem;
  display: none;
  @media (max-width: 992px) {
    display: block;
  }
`;

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        countProducts: action.payload.countProducts,
        loading: false,
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export default function SearchSceen() {
  const params = useParams();
  const { name } = params;
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { mode, userInfo, currency } = state;

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const category = sp.get("category") || "all";
  const query = sp.get("query") || "all";
  const rating = sp.get("rating") || "all";
  const price = sp.get("price") || "all";
  const order = sp.get("order") || "newest";
  const page = sp.get("page") || 1;
  const color = sp.get("color") || "all";
  const brand = sp.get("brand") || "all";
  const size = sp.get("size") || "all";
  const deal = sp.get("deal") || "all";
  const shipping = sp.get("shipping") || "all";
  const condition = sp.get("condition") || "all";
  const availability = sp.get("availability") || "all";
  const type = sp.get("type") || "all";
  const pattern = sp.get("pattern") || "all";

  const [{ loading, error, products, pages, countProducts }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  let brands = ["Nike", "Gucci", "Rolex", "Louis Vuitto", "Adidas", "Dior"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `/api/products/${region()}/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}&color=${color}&size=${size}&brand=${brand}&deal=${deal}&shipping=${shipping}&condition=${condition}&availability=${availability}&type=${type}&pattern=${pattern}`
        );
        console.log(data);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [
    category,
    order,
    page,
    price,
    query,
    rating,
    brand,
    color,
    size,
    deal,
    shipping,
    condition,
    availability,
    type,
    pattern,
  ]);

  const [queryBrand, setQueryBrand] = useState(null);
  const [searchBrand, setSearchBrand] = useState(null);
  useEffect(() => {
    const getSearch = async () => {
      const { data } = await axios.get(`/api/brands/search?q=${queryBrand}`);
      console.log(data);
      setSearchBrand(data);
    };
    getSearch();
  }, [queryBrand]);

  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    const filterCategory = filter.category || category;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    const filterOrder = filter.order || order;
    const filterColor = filter.color || color;
    const filterBrand = filter.brand || brand;
    const filterSize = filter.size || size;
    const filterDeal = filter.deal || deal;
    const filterShipping = filter.shipping || shipping;
    const filterCondition = filter.condition || condition;
    const filterAvailability = filter.availability || availability;
    const filterType = filter.type || type;
    const filterPattern = filter.pattern || pattern;
    return `/search?category=${filterCategory}&query=${filterQuery}&page=${filterPage}&price=${filterPrice}&rating=${filterRating}&order=${filterOrder}&color=${filterColor}&brand=${filterBrand}&size=${filterSize}&deal=${filterDeal}&shipping=${filterShipping}&condition=${filterCondition}&availability=${filterAvailability}&type=${filterType}&pattern=${filterPattern}`;
  };

  const [filterSidebar, setFilterSidebar] = useState(false);

  const [brandInput, setBrandInput] = useState("");

  if (brandInput.length > 0) {
    brands = brands.filter((i) => {
      return i.toLowerCase().match(brandInput);
    });
  }

  const [showFilter, setShowFilter] = useState(false);

  return (
    <div>
      <Helmet>
        <title>Search Product</title>
      </Helmet>

      <Name>{name}</Name>
      <Container>
        <SearchFilter
          setQueryBrand={setQueryBrand}
          searchBrand={searchBrand}
          queryBrand={queryBrand}
          showFilter={showFilter}
          setShowFilter={setShowFilter}
          category={category}
          order={order}
          page={page}
          price={price}
          query={query}
          rating={rating}
          brand={brand}
          color={color}
          size={size}
          deal={deal}
          shipping={shipping}
          condition={condition}
          availability={availability}
          type={type}
          pattern={pattern}
        />
        <Right mode={mode}>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <RowCont>
                <Filters onClick={() => setShowFilter(true)}>
                  <BiFilter /> Filters
                </Filters>
                <Result>
                  {countProducts === 0 ? "No" : countProducts} Results
                  {query !== "all" && " : " + query}
                  {category !== "all" && " : " + category}
                  {price !== "all" && "  Price: " + price}
                  {brand !== "all" && "  Brand: " + brand}
                  {color !== "all" && "  Brand: " + color}
                  {condition !== "all" && "  Brand: " + condition}
                  {availability !== "all" && "  Brand: " + availability}
                  {pattern !== "all" && "  Brand: " + pattern}
                  {size !== "all" && "  Brand: " + size}
                  {shipping !== "all" && "  Brand: " + shipping}
                  {rating !== "all" && "  Rating:" + rating + " & up"}
                  {query !== "all" ||
                  category !== "all" ||
                  rating !== "all" ||
                  brand !== "all" ||
                  color !== "all" ||
                  condition !== "all" ||
                  availability !== "all" ||
                  pattern !== "all" ||
                  shipping !== "all" ||
                  size !== "all" ||
                  price !== "all" ? (
                    <Button variant="none" onClick={() => navigate("/search")}>
                      <i className="fas fa-times-circle"></i>
                    </Button>
                  ) : null}
                </Result>
                <Col>
                  Sort by{"  "}
                  <select
                    className="search_sortBy"
                    value={order}
                    onChange={(e) => {
                      navigate(getFilterUrl({ order: e.target.value }));
                    }}
                  >
                    <option className={mode || ""} value="newest">
                      Newly Arrived
                    </option>
                    <option className={mode || ""} value="shared">
                      Just Shared
                    </option>
                    <option className={mode || ""} value="likes">
                      Likes
                    </option>
                    {/* <option className={mode || ""} value="prices">
                      Recent Prices Drop
                    </option> */}
                    <option className={mode || ""} value="relevance">
                      Relevance
                    </option>
                    <option className={mode || ""} value="lowest">
                      Price: Low to High
                    </option>
                    <option className={mode || ""} value="highest">
                      Price: High to Low
                    </option>
                    <option className={mode || ""} value="toprated">
                      Avg. Customer Reviews
                    </option>
                  </select>
                </Col>
              </RowCont>
              {products.length === 0 && (
                <MessageBox>No Product Found</MessageBox>
              )}
              <ProductListC>
                {products.map((product, index) => (
                  <EachCont key={product._id}>
                    <Product product={product}></Product>
                  </EachCont>
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
