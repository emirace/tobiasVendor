import React, { useEffect, useReducer, useState } from 'react';

import axios from 'axios';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Product from '../component/Product';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../component/LoadingBox';
import MessageBox from '../component/MessageBox';
import Button from 'react-bootstrap/Button';
import HotDeals from '../component/HotDeals';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import Newletter from '../component/Newletter';
import 'react-multi-carousel/lib/styles.css';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import '../style/HomeScreen.css';
import CategoryListing from '../component/CategoryListing';
import Navbar from '../component/Navbar';
import { faCreditCard, faTruckFast } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';
//import data from '../data';

const SmTitle = styled.div`
  text-transform: capitalize;
  position: relative;
  cursor: pointer;
`;

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return {
        ...state,
        loading: false,
        loadingUser: false,
        error: action.payload,
      };

    case 'FETCH_USERS_REQUEST':
      return { ...state, loadingUser: true };
    case 'FETCH_USERS_SUCCESS':
      return { ...state, sellers: action.payload, loadingUser: false };

    default:
      return state;
  }
};

export default function ProductsScreen() {
  const [{ loading, loadingUser, error, sellers, products }, dispatch] =
    useReducer(reducer, {
      products: [],
      loading: true,
      sellers: [],
      error: '',
    });
  const [sliderIndex, setSliderIndex] = useState(0);
  //const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });

        dispatch({ type: 'FETCH_USERS_REQUEST' });
        const { data: topSellers } = await axios.get('/api/users/top-sellers');

        dispatch({ type: 'FETCH_USERS_SUCCESS', payload: topSellers });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }

      //setProducts(result.data);
    };
    fetchData();
  }, []);
  const product1 = [1, 2, 3];
  const sliderHandler = (direction) => {
    if (direction === 'left') {
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
        <title>Tobias</title>
      </Helmet>
      <Row>
        <Col>
          <section className="banner ">
            <div className="container-fluid p-0">
              <div className="row">
                <div className="col m-auto">
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
                </div>
              </div>
            </div>
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
            <div className="CategoryListing_item">
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
                        <a href="#">Shop Now</a>
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
                        <a href="#">Shop Now</a>
                      </div>
                    </div>
                  </Col>
                </Col>
                <Col md={7}>
                  <div className="main-item main-item-1 padtop">
                    <img
                      src="/images/t3.jpg"
                      alt=""
                      className="img-fluid"
                    ></img>
                    <div className="main-item-text">
                      <h1>High Taste Women Wears</h1>
                      <button class="search-btn1">Shop Now</button>
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
            <div className="CategoryListing_item">
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
            <button onClick={() => sliderHandler('left')} className="pre-btn1">
              <i class="fa fa-angle-left"></i>
            </button>
            <button
              onClick={() => sliderHandler('right')}
              className="next-btn1"
            >
              <i class="fa fa-angle-right"></i>
            </button>
            <div className="product-container1">
              {products.map((product) => (
                <div
                  key={product.slug}
                  className="smooth1"
                  style={{ transform: sliderstyle }}
                >
                  <Product product={product} />
                </div>
              ))}
            </div>
          </section>
          <section>
            <div className="downloadapp_section">
              <div className="downloadapp_left">
                <div className="downloadapp_section_text">
                  <h2 className="downloadapp_title">try it on mobile</h2>
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum dummy text of the printing
                  and typesetting industry. Lorem Ipsum
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
          </section>

          <section className="discount spad">
            <div className="container">
              <div className="row">
                <div className=" col-md-6 p-0">
                  <div className="discount_pic">
                    <img src="/images/t3.jpg" alt="" class="img-fluid"></img>
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
                      <div class="countdown_item">
                        <span>22</span>
                        <p>Days</p>
                      </div>
                      <div class="countdown_item">
                        <span>18</span>
                        <p>Hours</p>
                      </div>
                      <div class="countdown_item">
                        <span>46</span>
                        <p>Min</p>
                      </div>
                      <div class="countdown_item">
                        <span>05</span>
                        <p>Sec</p>
                      </div>
                    </div>
                    <a href="#" className="c">
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
                  <Carousel
                    swipeable={false}
                    draggable={false}
                    showDots={true}
                    responsive={responsive}
                    ssr={true} // means to render carousel on server-side.
                    infinite={true}
                    autoPlaySpeed={3000}
                    keyBoardControl={true}
                    customTransition="all .5"
                    transitionDuration={2000}
                    containerClass="carousel-container"
                    removeArrowOnDeviceType={['tablet', 'mobile']}
                    dotListClass="custom-dot-list-style"
                    itemClass="carousel-item-padding-40-px"
                  >
                    {sellers.map((seller) => (
                      <Link to={`/seller/${seller._id}`}>
                        <div className="carousel_item">
                          <img
                            src={seller.seller.logo}
                            alt={seller.seller.name}
                            className="carousel_profile_image"
                          ></img>
                          <p className="">{seller.seller.name}</p>
                        </div>
                      </Link>
                    ))}
                  </Carousel>
                </>
              )}
            </div>
          </section>
          <section className="shop-method-area">
            <img className="wave_img " src="images/wave2.png" alt=""></img>
            <div className="bg_malon">
              <div className="container ">
                <div className="row d-flex justify-content-between">
                  <div className="col-lg-3 col-md-6 col-sm-12">
                    <div className="single-method mb-40">
                      <SmTitle>
                        <FontAwesomeIcon icon={faTruckFast} />
                        <h6 className="">Free Shipping Method</h6>
                      </SmTitle>
                      <p>
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s,
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6 col-sm-12">
                    <div className="single-method">
                      <FontAwesomeIcon icon={faTruckFast} />
                      <h6 className="">Free Shipping Method</h6>
                      <p>
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s,
                      </p>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6 col-sm-12">
                    <div className="single-method">
                      <FontAwesomeIcon icon={faCreditCard} />
                      <h6 className="">Easy Payment Method</h6>
                      <p>
                        Lorem Ipsum is simply dummy text of the printing and
                        typesetting industry. Lorem Ipsum has been the
                        industry's standard dummy text ever since the 1500s,
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* <section className="carl">
            <div className="left-side1">
              <span className="logo1">fashion</span>
              <div className="sm-product1">
                <h1 className="product-index1">01</h1>
                <div className="sm-product-imag-container1">
                  <img src="" alt="" className="sm-product-img1"></img>
                </div>
                <p className="sm-product-desc1">
                  The href attribute requires a valid value to requires a valid
                  value to
                </p>
              </div>
              <div className="social-link1">
                <i className="fa fa-instagram social-link-img1"></i>
                <i class="fa fa-facebook-square"></i>
                <i class="fa fa-twitter"></i>
              </div>
            </div>
          </section> */}
        </Col>
        {/* <Col md={3} className="mr-3 p-2">
          <div className="container">
            <div className="row">
              <div className="col">
                <h3 className="hot-deals-title">Hot Deals</h3>
                <HotDeals />
                <HotDeals />
                <HotDeals />
                <HotDeals />
                <HotDeals />
                <HotDeals />
                <HotDeals />
                <HotDeals />
                <HotDeals />
              </div>
            </div>
          </div>
        </Col> */}
      </Row>

      {/* <h1>Featured Products</h1> 
       <div className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <Row>
            {products.map((product) => (
              <Col key={product.slug} sm={4} md={4} lg={3} className="mb-3">
                <Product product={product} />
              </Col>
            ))}
          </Row>
        )}
      </div> */}
    </div>
  );
}
