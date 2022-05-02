import React, { useEffect, useReducer } from 'react';

import axios from 'axios';
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
//import data from '../data';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, products: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function ProductsScreen() {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: '',
  });
  //const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get('/api/products');
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err.message });
      }

      //setProducts(result.data);
    };
    fetchData();
  }, []);
  const product1 = [1, 2, 3];
  const nextBtnScroll = () => {};
  const preBtnScroll = () => {};
  return (
    <div>
      <Helmet>
        <title>Tobias</title>
      </Helmet>
      <Row>
        {/* <Col lg={2}>
          <div className="categories d-md-none d-lg-block">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="categories-title border-0 mb-4 shadow-sm rounded-pill p-1 ">
                    <div className="hot-deals-title">
                      <i className="fas fa-bars"></i> Categories
                    </div>
                  </div>
                  <ul>
                    <li>shirt</li>
                    <li>shirt</li>
                    <li>shirt</li>
                    <li>shirt</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Col> */}
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
                        <div id="overlay"></div>
                      </div>
                      <div className="banner_text">
                        <span>The Big Collection</span>
                        <h1>The New Product</h1>
                        <a href="/#">shop Now</a>
                      </div>
                    </div>
                    <div className="banner_item">
                      <div className="banner_image">
                        <img src="/images/p10.webp" alt="" />
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
          <section className="product1">
            <div className="product-title">
              <h2 className="product-category1">New deals</h2>
            </div>
            <button onClick={preBtnScroll} className="pre-btn1">
              <i class="fa fa-angle-left"></i>
            </button>
            <button onClick={nextBtnScroll} className="next-btn1">
              <i class="fa fa-angle-right"></i>
            </button>
            <div className="product-container1">
              <div className="product-card1">
                <div className="product-image1">
                  <span className="discount-tag1">50% off</span>
                  <img
                    src="/images/card4.png"
                    className="product-thumb1"
                    alt="product"
                  ></img>
                  <button className="card-btn1">add to whislist</button>
                </div>
                <div className="product-info1">
                  <h2 className="product-brand1">brand</h2>
                  <p className="product-short-desc1">
                    short line above the cloth...
                  </p>
                  <span className="price1">$120</span>
                  <span className="actual-price1">$150</span>
                </div>
              </div>
              <div className="product-card1">
                <div className="product-image1">
                  <span className="discount-tag1">50% off</span>
                  <img
                    src="/images/card1.png"
                    className="product-thumb1"
                    alt="product"
                  ></img>
                  <button className="card-btn1">add to whislist</button>
                </div>
                <div className="product-info1">
                  <h2 className="product-brand1">brand</h2>
                  <p className="product-short-desc1">
                    short line above the cloth...
                  </p>
                  <span className="price1">$120</span>
                  <span className="actual-price1">$150</span>
                </div>
              </div>
              <div className="product-card1">
                <div className="product-image1">
                  <span className="discount-tag1">50% off</span>
                  <img
                    src="/images/card2.png"
                    className="product-thumb1"
                    alt="product"
                  ></img>
                  <button className="card-btn1">add to whislist</button>
                </div>
                <div className="product-info1">
                  <h2 className="product-brand1">brand</h2>
                  <p className="product-short-desc1">
                    short line above the cloth...
                  </p>
                  <span className="price1">$120</span>
                  <span className="actual-price1">$150</span>
                </div>
              </div>
              <div className="product-card1">
                <div className="product-image1">
                  <span className="discount-tag1">50% off</span>
                  <img
                    src="/images/card4.png"
                    className="product-thumb1"
                    alt="product"
                  ></img>
                  <button className="card-btn1">add to whislist</button>
                </div>
                <div className="product-info1">
                  <h2 className="product-brand1">brand</h2>
                  <p className="product-short-desc1">
                    short line above the cloth...
                  </p>
                  <span className="price1">$120</span>
                  <span className="actual-price1">$150</span>
                </div>
              </div>
              <div className="product-card1">
                <div className="product-image1">
                  <span className="discount-tag1">50% off</span>
                  <img
                    src="/images/card6.png"
                    className="product-thumb1"
                    alt="product"
                  ></img>
                  <button className="card-btn1">add to whislist</button>
                </div>
                <div className="product-info1">
                  <h2 className="product-brand1">brand</h2>
                  <p className="product-short-desc1">
                    short line above the cloth...
                  </p>
                  <span className="price1">$120</span>
                  <span className="actual-price1">$150</span>
                </div>
              </div>
              <div className="product-card1">
                <div className="product-image1">
                  <span className="discount-tag1">50% off</span>
                  <img
                    src="/images/card7.png"
                    className="product-thumb1"
                    alt="product"
                  ></img>
                  <button className="card-btn1">add to whislist</button>
                </div>
                <div className="product-info1">
                  <h2 className="product-brand1">brand</h2>
                  <p className="product-short-desc1">
                    short line above the cloth...
                  </p>
                  <span className="price1">$120</span>
                  <span className="actual-price1">$150</span>
                </div>
              </div>
              <div className="product-card1">
                <div className="product-image1">
                  <span className="discount-tag1">50% off</span>
                  <img
                    src="/images/card8.png"
                    className="product-thumb1"
                    alt="product"
                  ></img>
                  <button className="card-btn1">add to whislist</button>
                </div>
                <div className="product-info1">
                  <h2 className="product-brand1">brand</h2>
                  <p className="product-short-desc1">
                    short line above the cloth...
                  </p>
                  <span className="price1">$120</span>
                  <span className="actual-price1">$150</span>
                </div>
              </div>
            </div>
          </section>
          <section className="center-item">
            <div className="container-fluid">
              <Row>
                <Col lg={5} md={12}>
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
                <Col lg={7} md={12}>
                  <div className="main-item main-item-1 padtop">
                    <img
                      src="/images/t3.jpg"
                      alt=""
                      className="img-fluid"
                    ></img>
                    <div className="main-item-text">
                      <h1>High Taste Women Wears</h1>
                      <button class="small-button">Shop Now</button>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </section>

          <section className="new-product spad">
            <div className="container">
              <div className="row">
                <div className="col-lg-12 ">
                  <div className="section-title">
                    <h4>New Product</h4>
                  </div>
                </div>
              </div>

              <div className="row property_gallery">
                {product1.map(() => (
                  <div className="product_item">
                    <div className="product_item_pic">
                      <img src="/images/p5.avif" alt="" />
                      <div className="label new">New</div>
                      <ul className="product_hover">
                        <li>
                          <a href="#">
                            <i className="fa fa-arrows-alt"></i>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fa fa-heart"></i>
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fa fa-shopping-bag"></i>
                          </a>
                        </li>
                      </ul>
                    </div>
                    <div className="product_item_text">
                      <h6>
                        <a href="#">Blazer Twed Buttons</a>
                      </h6>
                      <div className="rating">
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                        <i className="fa fa-star"></i>
                      </div>
                      <div className="product_price">$ 59.0</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="discount spad">
            <div className="container">
              <div className="row">
                <div className="col-lg-6 p-0">
                  <div className="discount_pic">
                    <img src="/images/t3.jpg" alt="" class="img-fluid"></img>
                  </div>
                </div>
                <div className="col-lg-6 p-0">
                  <div className="discount_text">
                    <div className="discount_text_title">
                      <span>Discount</span>
                      <h2>Season Sales </h2>
                      <h5>
                        <span>Sale</span> 60% OFF
                      </h5>
                    </div>
                    {/* <div className="discount_countdown">
                      <div class="countdown_item">
                        <span>22</span>
                        <p>Days</p>
                      </div>
                      <div class="countdown_item">
                        <span>22</span>
                        <p>Hours</p>
                      </div>
                      <div class="countdown_item">
                        <span>22</span>
                        <p>Min</p>
                      </div>
                      <div class="countdown_item">
                        <span>22</span>
                        <p>Sec</p>
                      </div>
                    </div> */}
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
