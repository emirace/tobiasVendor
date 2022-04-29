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
  return (
    <div>
      <Helmet>
        <title>Products</title>
      </Helmet>
      <Row>
        <Col md={2} className="  p-2">
          <div className="categories">
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
        </Col>
        <Col md={7} className="px-4  p-2 ">
          <section className="center-item">
            <Row>
              <Col lg={5} md={5} className="p-0">
                <Row>
                  <Col md={12}>
                    <div className="main-item">
                      <img
                        src="/images/t2.jpeg"
                        alt=""
                        className="img-fluid"
                      ></img>
                      <div className="main-item-text">
                        <h4>Kichen Tools and Gadgets</h4>
                        <a href="#">Shop Now</a>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <div className="main-item">
                      <img
                        src="/images/t4.jpg"
                        alt=""
                        className="img-fluid"
                      ></img>
                      <div className="main-item-text">
                        <h4>Kichen Tools and Gadgets</h4>
                        <a href="#">Shop Now</a>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col lg={7} md={7} className="p-0">
                <div className="main-item main-item-1">
                  <img src="/images/t3.jpg" alt="" className="img-fluid"></img>
                  <div className="main-item-text">
                    <h1>Kichen Tools and Gadgets</h1>
                    <button class="small-button">Shop Now</button>
                  </div>
                </div>
              </Col>
            </Row>
          </section>
          <section className="new-product spad">
            <div className="container">
              <div className="row">
                <div className="col-lg-12 text-center">
                  <div className="section-title">
                    <h4>New Product</h4>
                  </div>
                </div>
              </div>
              <div className="row property_gallery">
                <div className="col-lg-3 col-md-4 col-sm-6">
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
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
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
                      <div className="product_price">
                        $ 59.0<span>$ 75.0</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
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
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
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
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
                  <div className="product_item">
                    <div className="product_item_pic">
                      <img src="/images/p1.jpg" alt="" />
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
                </div>
                <div className="col-lg-3 col-md-4 col-sm-6">
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
                </div>
              </div>
            </div>
          </section>
          <section className="banner bg-img">
            <div className="container">
              <div className="row">
                <div className="col-lg-8 m-auto">
                  <OwlCarousel
                    items={1}
                    loop
                    autoHeight={false}
                    dots={true}
                    smartSpeed={2000}
                    dot
                    autoplay={true}
                    margin={0}
                    className="banner_slider owl-theme"
                  >
                    <div className="banner_item">
                      <div className="banner_text">
                        <span>The Big Collection</span>
                        <h1>The New Product</h1>
                        <a href="/#">Buy Now</a>
                      </div>
                    </div>
                    <div className="banner_item">
                      <div className="banner_text">
                        <span>The Big Collection</span>
                        <h1>The New Product</h1>
                        <a href="/#">Buy Now</a>
                      </div>
                    </div>
                    <div className="banner_item">
                      <div className="banner_text">
                        <span>The Big Collection</span>
                        <h1>The New Product</h1>
                        <a href="/#">Buy Now</a>
                      </div>
                    </div>
                  </OwlCarousel>
                </div>
              </div>
            </div>
          </section>
        </Col>
        <Col md={3} className="mr-3 p-2">
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
        </Col>
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
