import axios from 'axios';
import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import ReactImageMagnify from 'react-image-magnify';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link, useParams } from 'react-router-dom';
import Rating from '../component/Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../component/LoadingBox';
import MessageBox from '../component/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';
import '../style/product.css';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { toast } from 'react-toastify';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, product: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function ProductScreen() {
  let reviewRef = useRef();

  const [rating, setRAting] = useState(0);
  const [comment, setComment] = useState('');

  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      product: [],
      loading: true,
      error: '',
    });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;
  const [selectedImage, setSelectedImage] = useState('');
  const [sliderIndex, setSliderIndex] = useState(0);

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    //
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...product, quantity },
    });
  };

  const sliderHandler = (direction) => {
    if (direction === 'left') {
      setSliderIndex(sliderIndex > 0 ? sliderIndex - 1 : 3);
    } else {
      setSliderIndex(sliderIndex < 3 ? sliderIndex + 1 : 0);
    }
  };

  const sliderstyle = `translateX(${sliderIndex * -80}vw)`;

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment || !rating) {
      toast.error('Please enter comment and rating');
      return;
    }
    try {
      dispatch({ type: 'CREATE_REQUEST' });
      const { data } = await axios.post(
        `/api/products/${product._id}/reviews`,
        { rating, comment, name: userInfo.name },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'CREATE_SUCCESS' });
      toast.success('REview submitted successfully');
      product.reviews.unshift(data.rebiew);
    } catch (err) {
      toast.error(getError(error));
      dispatch({ type: 'CREATE_FAIL' });
    }
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>{product.name}</title>
      </Helmet>
      <section className="product-details1 row">
        <div className=" col-sm-12 col-md-6 d-none d-md-block">
          <div className=" row justify-content-center">
            <ReactImageMagnify
              imageClassName="small-img"
              {...{
                smallImage: {
                  alt: `${product.name}`,
                  isFluidWidth: true,
                  src: selectedImage || `${product.image}`,
                },
                largeImage: {
                  src: selectedImage || `${product.image}`,
                  width: 679,
                  height: 829,
                },
              }}
            />
          </div>
          <div className="product-images1 row ">
            <div
              className="col-3"
              onClick={() => setSelectedImage(product.image)}
            >
              <img src={product.image} alt="" className="active1" />
            </div>
            <div
              className="col-3"
              onClick={() => setSelectedImage('/images/p2.jpg')}
            >
              <img src="/images/p2.jpg" alt="" />
            </div>
            <div
              className="col-3"
              onClick={() => setSelectedImage('/images/p3.jpg')}
            >
              <img src="/images/p3.jpg" alt="" />
            </div>
            <div
              className="col-3"
              onClick={() => setSelectedImage('/images/p9.png')}
            >
              <img src="/images/p9.png" alt="" />
            </div>
          </div>
        </div>
        <div className=" col-sm-12 col-md-6 d-block d-md-none">
          <div className=" row justify-content-center">
            <div className="moblie-slider">
              <div
                onClick={() => sliderHandler('left')}
                className="mobile-image-arrow-left"
              >
                <i class="fa fa-angle-left"></i>
              </div>
              <div
                onClick={() => sliderHandler('right')}
                className="mobile-image-arrow-right"
              >
                <i class="fa fa-angle-right"></i>
              </div>
              <div className="mobile-image">
                <img
                  style={{ transform: sliderstyle }}
                  src={product.image}
                  alt="product"
                ></img>
                <img
                  style={{ transform: sliderstyle }}
                  src="/images/p1.jpg"
                  alt="product"
                ></img>
                <img
                  style={{ transform: sliderstyle }}
                  src="/images/p1.jpg"
                  alt="product"
                ></img>
                <img
                  style={{ transform: sliderstyle }}
                  src="/images/p1.jpg"
                  alt="product"
                ></img>
              </div>
            </div>
          </div>
        </div>
        <div className="detailsm1 col-sm-12 col-md-6">
          <div className="select-size">
            <h2 className="product-brand1">{product.name} </h2>
            <i className="fa fa-heart ml-2px"></i> 147
          </div>
          <p className="product-short-desc2">Gucci</p>
          <span className="product-price1">${product.price}</span>
          <span className="product-actual-price1">${product.price * 2}</span>
          <span className="product-discount1">( 50% off )</span>

          <div className="select-size">
            <p className="product-sub-heading1">select size: </p>
            <input type="radio" name="size" value="s" hidden id="s-size" />
            <label for="size" className="size-radio-btn1 checked">
              s
            </label>
            <input type="radio" name="size" value="m" hidden id="m-size" />
            <label for="size" className="size-radio-btn1">
              m
            </label>
            <input type="radio" name="size" value="l" hidden id="l-size" />
            <label for="size" className="size-radio-btn1">
              l
            </label>
            <input type="radio" name="size" value="xl" hidden id="xl-size" />
            <label for="size" className="size-radio-btn1">
              xl
            </label>
            <input type="radio" name="size" value="xxl" hidden id="xxl-size" />
            <label for="size" className="size-radio-btn1">
              xxl
            </label>
          </div>
          <div className="row">
            <button className="btn1 col-md-6 col-12 cart-btn1 ml-1">
              add to cart
            </button>
            &nbsp;
            <button className="btn1 col-md-6 col-12 ">wishlist</button>
          </div>
          <section className="detail-desc1">
            <h2 className="heading1">description</h2>
            <p className="desc1">{product.description}</p>
          </section>
        </div>
      </section>
      <section className="product1">
        <div className="product-title">
          <h2 className="product-category1">Related Products</h2>
        </div>
        <button className="pre-btn1">
          <i class="fa fa-angle-left"></i>
        </button>
        <button className="next-btn1">
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
      <div className="my-3">
        <h2 ref={reviewRef}>Reviews</h2>
        <div className="my-3">
          {product.reviews.length === 0 && (
            <MessageBox>There is no reviews</MessageBox>
          )}
        </div>
        <ListGroup>
          {product.reviews.map((review) => {
            <ListGroup.Item key={review._id}>
              <strong>{review.name}</strong>
              <Rating rating={review.rating} caption=""></Rating>
              <p>{review.createdAt.substring(0, 10)}</p>
              <p>{review.comment}</p>
            </ListGroup.Item>;
          })}
        </ListGroup>
        <div className="my-3">
          {userInfo ? (
            <form onSubmit={submitHandler}>
              <h2>Write a customer review</h2>
              <Form.Group className="my-3" controlId="rating">
                <Form.Label>Rating</Form.Label>
                <Form.Select
                  aria-label="Rating"
                  value={rating}
                  onChange={(e) => setRAting(e.target.value)}
                >
                  <option value="">Select...</option>
                  <option value="1">1- Poor</option>
                  <option value="2">2- Fair</option>
                  <option value="3">3- Good</option>
                  <option value="4">4- Very good</option>
                  <option value="5">5- Excelent</option>
                </Form.Select>
              </Form.Group>
              <FloatingLabel
                controlId="floatingTextarea"
                lablel="Coments"
                className="my-3"
              >
                <Form.Control
                  as="textarea"
                  placeholder="Leave a comment here"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </FloatingLabel>
              <div className="my-3">
                <button
                  className="search-btn1"
                  disabled={loadingCreateReview}
                  type="submit"
                >
                  Submit
                </button>
                {loadingCreateReview && <LoadingBox></LoadingBox>}
              </div>
            </form>
          ) : (
            <MessageBox>
              Please <Link to="/insign">Sign In</Link> to write a review
            </MessageBox>
          )}
        </div>
      </div>
      {/* <Row>
        <Col md={6}>
          <img className="img-large" src={product.image} alt={product.name} />
        </Col>
        <Col md={3}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{product.name}</title>
              </Helmet>
              <h1>{product.name}</h1>
            </ListGroup.Item>
            <ListGroup.Item>
              <Rating rating={product.rating} numReviews={product.numReviews} />
            </ListGroup.Item>
            <ListGroup.Item>Price : ${product.price}</ListGroup.Item>
            <ListGroup.Item>
              Description:
              <p>{product.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Price:</Col>
                    <Col>${product.price}</Col>
                  </Row>
                  <Row>
                    <Col>Status:</Col>
                    <Col>
                      {product.countInStock > 0 ? (
                        <Badge bg="success">In Stock</Badge>
                      ) : (
                        <Badge bg="danger">Unavailable</Badge>
                      )}
                    </Col>
                  </Row>
                </ListGroup.Item>
                {product.countInStock > 0 && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={addToCartHandler} variant="primary">
                        Add to Cart
                      </Button>
                    </div>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row> */}
    </div>
  );
}
