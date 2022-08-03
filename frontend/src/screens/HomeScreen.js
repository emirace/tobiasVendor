import React, { useContext, useEffect, useReducer, useState } from "react";

import axios from "axios";
import { Link } from "react-router-dom";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../component/Product";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../component/LoadingBox";
import MessageBox from "../component/MessageBox";
import Button from "react-bootstrap/Button";
import HotDeals from "../component/HotDeals";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import Newletter from "../component/Newletter";
import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "../style/HomeScreen.css";
import CategoryListing from "../component/CategoryListing";
import Notification from "../component/Notification";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Store } from "../Store";
//import data from '../data';

const Seller = styled.div`
  display: flex;
  margin: 0 5vw;
  overflow-x: auto;
  scroll-behavior: smooth;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (max-width: 992px) {
    margin: 0 5vw;
  }
`;
const Imagediv = styled.div`
  position: relative;
`;

const Badge = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
`;

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload,
        loading: false,
      };
    case "FETCH_FAIL":
      return {
        ...state,
        loading: false,
        loadingUser: false,
        error: action.payload,
      };

    case "FETCH_USERS_REQUEST":
      return { ...state, loadingUser: true };
    case "FETCH_USERS_SUCCESS":
      return {
        ...state,
        sellers: action.payload,
        loadingUser: false,
      };

    default:
      return state;
  }
};

const AppSection = styled.div`
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  border-radius: 0.2rem;
`;

export default function ProductsScreen() {
  const { state } = useContext(Store);
  const { mode } = state;
  const [{ loading, loadingUser, error, sellers, products }, dispatch] =
    useReducer(reducer, {
      products: [],
      loading: true,
      sellers: [],
      error: "",
    });
  const [sliderIndex, setSliderIndex] = useState(0);
  //const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get("/api/products");
        dispatch({
          type: "FETCH_SUCCESS",
          payload: data,
        });

        dispatch({ type: "FETCH_USERS_REQUEST" });
        const { data: topSellers } = await axios.get("/api/users/top-sellers");
        console.log(topSellers);
        dispatch({
          type: "FETCH_USERS_SUCCESS",
          payload: topSellers,
        });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: err.message,
        });
      }

      //setProducts(result.data);
    };
    fetchData();
  }, []);
  const sliderHandler = (direction) => {
    if (direction === "left") {
      setSliderIndex(sliderIndex > 0 ? sliderIndex - 1 : products.length - 5);
    } else {
      setSliderIndex(sliderIndex < products.length - 5 ? sliderIndex + 1 : 0);
    }
  };
  const sliderstyle = `translateX(${sliderIndex * -220}px)`;

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
      slidesToSlide: 1, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 2, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  return (
    <div>
      <Helmet>
        <title>Repeddle</title>
      </Helmet>
      <div>
        <section className="banner ">
          <OwlCarousel
            items={1}
            loop
            autoHeight={false}
            dots={true}
            smartSpeed={4000}
            dot
            autoplay={true}
            margin={0}
            className="banner_slider owl-theme"
          >
            <div className="banner_item">
              <div className="banner_image">
                <img src="/images/p11.jpg" alt="" />
              </div>
              <div className="banner_text">
                <span>The Big Collection</span>
                <h1>The New Product</h1>
                <a href="/#">shop Now</a>
              </div>
            </div>
            <div className="banner_item">
              <div className="banner_image">
                <img src="/images/t4.jpg" alt="" />
              </div>
              <div className="banner_text">
                <span>The Big Collection</span>
                <h1>The New Product</h1>
                <a href="/#">shop Now</a>
              </div>
            </div>
            <div className="banner_item">
              <div className="banner_image">
                <img src="/images/t7.jpg" alt="" />
              </div>
              <div className="banner_text">
                <span>The Big Collection</span>
                <h1>The New Product</h1>
                <a href="/#">shop Now</a>
              </div>
            </div>
          </OwlCarousel>
        </section>

        <section className="CategoryListing_section ">
          <div className="product-title-Listing">
            <h2 className="product-categorylisting">New Collection</h2>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum dummy text of the printing and typesetting
              industry. Lorem Ipsum
            </p>
          </div>
          <div className="CategoryListing_item scroll_snap">
            <CategoryListing image="/images/card6.png" title="Smart Shirt" />
            <CategoryListing image="/images/card11.png" title="Sport" />
            <CategoryListing image="/images/men.png" title="Colorful" />
            <CategoryListing image="/images/men.png" title="Colorful" />
          </div>
        </section>
        <section className="center-item">
          <div className="container-fluid">
            <Row>
              <Col md={5}>
                <Col className="">
                  <div className="main-item paddown padtop">
                    <img
                      src="/images/men.png"
                      alt=""
                      className="img-fluid"
                    ></img>
                    <div className="main-item-text">
                      <h4>Classic Men Wears</h4>
                      <Link to="/category/Classic Men Wears">Shop Now</Link>
                    </div>
                  </div>
                </Col>
                <Col className="">
                  <div className="main-item padtop">
                    <img
                      src="/images/t4.jpg"
                      alt=""
                      className="img-fluid"
                    ></img>
                    <div className="main-item-text">
                      <h4>Smart Kid's Wears</h4>
                      <Link to="/category/Smart Kid's Wears">Shop Now</Link>
                    </div>
                  </div>
                </Col>
              </Col>
              <Col md={7}>
                <div className="main-item main-item-1 padtop">
                  <img src="/images/t3.jpg" alt="" className="img-fluid"></img>
                  <div className="main-item-text">
                    <h1>High Taste Women Wears</h1>
                    <Link to="/category/Womens Wears">
                      <button className="search-btn1">Shop Now</button>
                    </Link>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </section>
        <section className="CategoryListing_section   ">
          <div className="product-title-Listing">
            <h2 className="product-categorylisting">Brand</h2>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum dummy text of the printing and typesetting
              industry. Lorem Ipsum
            </p>
          </div>
          <div className="CategoryListing_item scroll_snap">
            <CategoryListing image="/images/card6.png" title="Gucci" />
            <CategoryListing image="/images/card11.png" title="fendi" />
            <CategoryListing image="/images/men.png" title="bottega veneta" />
            <CategoryListing image="/images/men.png" title="valentino" />
          </div>
        </section>

        <section className="product1">
          <div className="product-title">
            <h2 className="product-category1">New deals</h2>
          </div>
          <button onClick={() => sliderHandler("left")} className="pre-btn1">
            <i className="fa fa-angle-left"></i>
          </button>
          <button onClick={() => sliderHandler("right")} className="next-btn1">
            <i className="fa fa-angle-right"></i>
          </button>
          <div className="product-container1 scroll_snap">
            {products.map((product) => (
              <div
                key={product._id}
                className="smooth1"
                // style={{
                //   transform: sliderstyle,
                // }}
              >
                <Product product={product} />
              </div>
            ))}
          </div>
        </section>
        <AppSection mode={mode}>
          <div className="downloadapp_section">
            <div className="downloadapp_left">
              <div className="downloadapp_section_text">
                <h2 className="downloadapp_title">try it on mobile</h2>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum dummy text of the printing and typesetting
                industry. Lorem Ipsum
              </div>
              <div className="downloadapp_img">
                <img src="/images/as.png" alt="playstore" />
                <img src="/images/gp.png" alt="playstore" />
              </div>
            </div>
            <div className="downloadapp_right">
              <img src="/images/phonescreen.png" alt="app" />
              <img
                className="downloadapp_small_img"
                src="/images/phonescreen.png"
                alt="app"
              />
            </div>
          </div>
        </AppSection>

        <section className="discount spad">
          <div className="container">
            <div className="row">
              <div className=" col-md-6 p-0">
                <div className="discount_pic">
                  <img src="/images/t3.jpg" alt="" className="img-fluid"></img>
                </div>
              </div>
              <div className=" col-md-6 p-0">
                <div className="discount_text">
                  <div className="discount_text_title">
                    <span>Discount</span>
                    <h2>Season Sales </h2>
                    <h5>
                      <span>Sale</span> 60% OFF
                    </h5>
                  </div>
                  <div className="discount_countdown">
                    <div className="countdown_item">
                      <span>22</span>
                      <p>Days</p>
                    </div>
                    <div className="countdown_item">
                      <span>18</span>
                      <p>Hours</p>
                    </div>
                    <div className="countdown_item">
                      <span>46</span>
                      <p>Min</p>
                    </div>
                    <div className="countdown_item">
                      <span>05</span>
                      <p>Sec</p>
                    </div>
                  </div>
                  <a href="/" className="c">
                    Buy Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="top_seller_carousel">
          <div className="product-title">
            <h2 className="product-category1">Top Sellers</h2>
          </div>
          <div>
            {loadingUser ? (
              <LoadingBox></LoadingBox>
            ) : error ? (
              <MessageBox>{error}</MessageBox>
            ) : (
              <>
                {sellers.length === 0 && (
                  <MessageBox>No Seller Found</MessageBox>
                )}
                <Seller className="scroll_snap">
                  {console.log(sellers.topSellers)}
                  {sellers.topSellers &&
                    sellers.topSellers.length > 0 &&
                    sellers.topSellers.map((seller, index) => (
                      <Link to={`/seller/${seller._id}`} key={index}>
                        <div className="carousel_item">
                          <Imagediv>
                            <img
                              src={seller.image}
                              alt={seller.username}
                              className="carousel_profile_image"
                            ></img>
                            {seller.badge && (
                              <div className="seller_profile_badge">
                                <Badge src="https://res.cloudinary.com/emirace/image/upload/v1659499335/Icon_Verification--02_jkmhxc.png" />
                              </div>
                            )}
                          </Imagediv>
                          <p className="">@{seller.username}</p>
                        </div>
                      </Link>
                    ))}
                </Seller>
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
