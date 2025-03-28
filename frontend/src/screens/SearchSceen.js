import React, { useContext, useEffect, useReducer, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
import ScrollToTop from "../component/ScrollToTop";

const Container = styled.div`
  display: flex;
  margin-top: 10px;
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
    padding: 10px;
    margin-bottom: 10px;
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

const Next = styled.div`
  border: 1px solid;
  padding: 4px;
  border-radius: 0.2rem;
  width: 100px;
  text-align: center;
  font-weight: 500;
  &:hover {
    background: ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev3)"};
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
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { mode, userInfo, currency } = state;

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  console.log(sp.get("color"));
  const category = sp.get("category") || "all";
  const query = sp.get("query") || "all";
  const rating = sp.get("rating") || "all";
  const maxPrice = sp.get("maxPrice") || currency === "R " ? 100000 : 500000;
  const minPrice = sp.get("minPrice") || 0;
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
          `/api/products/${region()}/search?page=${page}&query=${query}&category=${category}&maxPrice=${maxPrice}&minPrice=${minPrice}&rating=${rating}&order=${order}&color=${color}&size=${size}&brand=${brand}&deal=${deal}&shipping=${shipping}&condition=${condition}&availability=${availability}&type=${type}&pattern=${pattern}`
        );
        console.log(data);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
        window.scrollTo(0, 0);
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
    maxPrice,
    minPrice,
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

  const [rLoading, setRLoading] = useState(true);
  const [rProducts, setRProducts] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setRLoading(true);
      try {
        const { data } = await axios.get(`/api/products/${region()}/all`);
        setRProducts(data);
        setRLoading(false);
      } catch (err) {
        console.log(getError(err));
        setRLoading(false);
      }
    };
    fetchData();
  }, []);

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
    const filterMaxPrice = filter.maxPrice || maxPrice;
    const filterMinPrice = filter.minPrice || minPrice;
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
    return `/search?category=${filterCategory}&query=${filterQuery}&page=${filterPage}&maxPrice=${filterMaxPrice}&minPrice=${filterMinPrice}&rating=${filterRating}&order=${filterOrder}&color=${filterColor}&brand=${filterBrand}&size=${filterSize}&deal=${filterDeal}&shipping=${filterShipping}&condition=${filterCondition}&availability=${filterAvailability}&type=${filterType}&pattern=${filterPattern}`;
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
          maxPrice={maxPrice}
          minPrice={minPrice}
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
          countProducts={countProducts}
        />
        <Right mode={mode}>
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (
            <>
              <Searchcont>
                <SearchBox />
              </Searchcont>
              <RowCont>
                <Filters onClick={() => setShowFilter(true)}>
                  <BiFilter /> Filters
                </Filters>
                <Result>
                  {countProducts === 0 ? "No" : countProducts} Results
                  {query !== "all" && " : " + query}
                  {category !== "all" && " : " + category}
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
                  size !== "all" ? (
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
                <>
                  <MessageBox>
                    <div
                      style={{
                        marginBottom: "15px",
                      }}
                    >
                      🔎Cant't find what you're looking for? Try related
                      products!
                    </div>
                  </MessageBox>
                  {rLoading ? (
                    <LoadingBox />
                  ) : (
                    <ProductListC>
                      {rProducts.map((product, index) => (
                        <EachCont key={product._id}>
                          <Product product={product}></Product>
                        </EachCont>
                      ))}
                    </ProductListC>
                  )}
                </>
              )}
              <ProductListC>
                {products.map((product, index) => (
                  <EachCont key={product._id}>
                    <Product product={product}></Product>
                  </EachCont>
                ))}
              </ProductListC>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                {page > 1 && (
                  <Link
                    to={getFilterUrl({ page: parseInt(page) - 1 })}
                    onClick={() => setQueryBrand("")}
                  >
                    <Next>Previous</Next>
                  </Link>
                )}
                {pages > 1 && products.length === 40 && (
                  <Link
                    to={getFilterUrl({ page: parseInt(page) + 1 })}
                    onClick={() => setQueryBrand("")}
                  >
                    <Next>Next</Next>
                  </Link>
                )}
              </div>
            </>
          )}
        </Right>
      </Container>
    </div>
  );
}
