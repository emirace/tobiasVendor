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
import Influencer from "../component/Influencer";
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

const Section = styled.div`
  margin: 10px 0;
`;
const Content = styled.div`
  display: flex;
  gap: 10px;
  margin: 5px 5vw;
`;
const LeftSide = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const Top = styled.div`
  flex: 1;
`;

const DiscountText = styled.div`
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  height: 390px;
  padding: 75px 90px 50px;
  @media (max-width: 992px) {
    padding: 30px !important;
  }
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
        const { data: topSellers } = await axios.get("/api/bestsellers");
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
      var slider = document.getElementById("slider");
      slider.scrollBy(350, 0);
      // setSliderIndex(sliderIndex > 0 ? sliderIndex - 1 : products.length - 5);
    } else {
      var slider = document.getElementById("slider");
      slider.scrollBy(-350, 0);
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
            autoplay={true}
            margin={0}
            className="banner_slider owl-theme"
          >
            <div className="banner_item">
              <div className="banner_image">
                <img
                  src="https://res.cloudinary.com/emirace/image/upload/v1660163636/t7_mykwcy.webp"
                  alt="img"
                />
              </div>
              <div className="banner_text">
                <h1>
                  AFRICA'S GEN-Z & MILLENNIALS MARKETPLACE FOR SECOND/PRE-LOVED
                  FASHION COMMUNITY
                </h1>
                <Link to="/sell">join us</Link>
              </div>
            </div>
            <div className="banner_item">
              <div className="banner_image">
                <img
                  src="https://res.cloudinary.com/emirace/image/upload/v1660106380/greg-raines-rqFBIR6vQXg-unsplash_ww9hag.jpg"
                  alt="img"
                />
              </div>
              <div className="banner_text">
                <h1>BUY-SELL-CHAT-CASH OUT-REPEAT</h1>
                <Link to="/search">shop Now</Link>
              </div>
            </div>
            <div className="banner_item">
              <div className="banner_image">
                <img
                  src="https://res.cloudinary.com/emirace/image/upload/v1660106376/chimi-davila-58FCfyUti_w-unsplash_ntlptl.jpg"
                  alt="img"
                />
              </div>
              <div className="banner_text">
                <h1>JOIN THE THRIFT TREASURE HUNT</h1>
                <Link to="/search">Discover</Link>
              </div>
            </div>
          </OwlCarousel>
        </section>

        <section className="CategoryListing_section ">
          <div className="product-title-Listing">
            <h2 className="product-categorylisting">New Collection</h2>
            <p>
              Discover new shops launching on our App and Website daily. Shop
              Hot deals, New Arrivals New style drops from your favorite shops
              and influencers
            </p>
          </div>
          <div className="CategoryListing_item scroll_snap">
            <CategoryListing
              image="https://res.cloudinary.com/emirace/image/upload/v1660106386/engin-akyurt-xbFtknoQG_Y-unsplash_wztucd.jpg"
              title="STYLE UP"
            />
            <CategoryListing
              image="https://res.cloudinary.com/emirace/image/upload/v1660106402/ruan-richard-rodrigues--MCGquf_4mU-unsplash_zqcr8q.jpg"
              title="ACCESSORIZE"
            />
            <CategoryListing
              image="https://res.cloudinary.com/emirace/image/upload/v1660106396/julian-hochgesang-sA5wcAu4CBA-unsplash_yd9qmf.jpg"
              title="SNEAKER-HEAD FAMILY"
            />
            <CategoryListing
              image="https://res.cloudinary.com/emirace/image/upload/v1660106404/stephen-audu-BkB5T-ZdK88-unsplash_zfy4et.jpg"
              title="BAG AFFAIR"
            />
            <CategoryListing
              image="https://res.cloudinary.com/emirace/image/upload/v1660106397/carmen-fu-4xb2LK36Mps-unsplash_wcrw3e.jpg"
              title="GEN-Z KIDS"
            />
            <CategoryListing
              image="https://res.cloudinary.com/emirace/image/upload/v1660106370/ahmed-carter-GP3-QpmTgPk-unsplash_mr2mfo.jpg"
              title="LET'S GO PARTY"
            />
          </div>
        </section>
        <section className="center-item">
          <div className="container-fluid">
            <Row>
              <Col md={5}>
                <Col className="">
                  <div className="main-item paddown padtop">
                    <img
                      src="https://res.cloudinary.com/emirace/image/upload/v1660106408/vonecia-carswell-D3HSYAUjVrM-unsplash_aihybs.jpg"
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
                      src="https://res.cloudinary.com/emirace/image/upload/v1660106398/Screen_Shot_2022-07-15_at_9.05.37_PM_imcbgb.png"
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
                  <img
                    src="https://res.cloudinary.com/emirace/image/upload/v1660106404/tamara-bellis-uN1m9Ca0aqo-unsplash_tnxehc.jpg"
                    alt=""
                    className="img-fluid"
                  ></img>
                  <div className="main-item-text">
                    <h1>High Taste Women Wears</h1>
                    <div>
                      <Link to="/category/Womens Wears">
                        <button className="search-btn1">Shop Now</button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </section>
        <section className="CategoryListing_section   ">
          <div className="product-title-Listing">
            <h2 className="product-categorylisting">Brands</h2>
            <p>
              Discoverbrands that tick the boxes, from names you love, price
              that does not break the bank and environmental conscious brands
              that you can pass on to generations. That is sustainability
            </p>
          </div>
          <div className="CategoryListing_item scroll_snap">
            <CategoryListing
              image="https://res.cloudinary.com/emirace/image/upload/v1660106388/Picture1_mmopbu.png"
              title="PATAGONIA"
            />
            <CategoryListing
              image="https://res.cloudinary.com/emirace/image/upload/v1660106395/lucas-hoang-O0e6Ka5vYSs-unsplash_vcee35.jpg"
              title="GUCCI"
            />
            <CategoryListing
              image="https://res.cloudinary.com/emirace/image/upload/v1660106406/tony-tran-VKVDdLGoilc-unsplash_symd1u.jpg"
              title="BALANCIAGA"
            />
            <CategoryListing
              image="https://res.cloudinary.com/emirace/image/upload/v1660106396/jakayla-toney-v0gHLhdQPCY-unsplash_uqcusm.jpg"
              title="ADIDAS"
            />
            <CategoryListing
              image="https://res.cloudinary.com/emirace/image/upload/v1660106398/Screen_Shot_2022-07-16_at_1.44.27_PM_vk5crl.png"
              title="ALEXANDER MCQUEEN"
            />
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
          <div
            id="slider"
            className="product-container1 scroll_snap"
            // style={{
            //   transform: sliderstyle,
            // }}
          >
            {products.map((product) => (
              <div key={product._id} className="smooth1">
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
                Easy with just aclick away. Never miss amazing deals and hot
                drops by getting real-time Notifications. Buy, Sell Chat,
                Cash-out and Repeat. Anywhere, Anytime.
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

        <Section>
          <div className="product-title">
            <h2 className="product-category1">influencers Block</h2>
          </div>
          <Content>
            <LeftSide>
              <Top>
                <Influencer sellerId={"62e39251f6ad8a23c2e9c55d"} />
              </Top>
              <Top>
                <Influencer sellerId={"62e39251f6ad8a23c2e9c55d"} />
              </Top>
            </LeftSide>
            <LeftSide>
              <Top>
                <Influencer sellerId={"62e39251f6ad8a23c2e9c55d"} />
              </Top>
              <Top>
                <Influencer sellerId={"62e39251f6ad8a23c2e9c55d"} />
              </Top>
            </LeftSide>
          </Content>
        </Section>

        <section className="discount spad">
          <div className="container">
            <div className="row">
              <div className=" col-md-6 p-0">
                <div className="discount_pic">
                  <img
                    src="https://res.cloudinary.com/emirace/image/upload/v1660106394/mike-von-bWUOx0SaSAk-unsplash_pgx37c.jpg"
                    alt=""
                    className="img-fluid"
                  ></img>
                </div>
              </div>
              <div className=" col-md-6 p-0">
                <DiscountText mode={mode} className="discount_text">
                  <div className="discount_text_title">
                    <span>Discount</span>
                    <h2>Season Sales </h2>
                    <h5>
                      <span>Sale Up To</span> 60% OFF
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
                </DiscountText>
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
                  {console.log(sellers)}
                  {sellers &&
                    sellers.length > 0 &&
                    sellers.map((seller, index) => (
                      <Link to={`/seller/${seller.userId._id}`} key={index}>
                        <div className="carousel_item">
                          <Imagediv>
                            <img
                              src={seller.userId.image}
                              alt={seller.userId.username}
                              className="carousel_profile_image"
                            ></img>
                            {seller.badge && (
                              <div className="seller_profile_badge">
                                <Badge src="https://res.cloudinary.com/emirace/image/upload/v1659499335/Icon_Verification--02_jkmhxc.png" />
                              </div>
                            )}
                          </Imagediv>
                          <p className="">@{seller.userId.username}</p>
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
