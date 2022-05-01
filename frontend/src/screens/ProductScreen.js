import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import { useParams } from 'react-router-dom';
import Rating from '../component/Rating';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../component/LoadingBox';
import MessageBox from '../component/MessageBox';
import { getError } from '../utils';
import { Store } from '../Store';
import '../style/product.css';

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
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, product }, dispatch] = useReducer(reducer, {
    product: [],
    loading: true,
    error: '',
  });
  //const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const result = await axios.get(`/api/products/slug/${slug}`);
        dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }

      //setProducts(result.data);
    };
    fetchData();
  }, [slug]);
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;

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

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <section className="product-details1">
        <div className="image-slider1">
          <div className="product-images1">
            <img src="/images/p1.jpg" alt="" className="active1" />
            <img src="/images/p2.jpg" alt="" />
            <img src="/images/p3.jpg" alt="" />
            <img src="/images/p4.jpg" alt="" />
          </div>
        </div>
        <div className="details1">
          <h2 className="product-brand1">calvin klein</h2>
          <p className="product-short-desc1">
            need the element to resemble a link, use a button and change.
          </p>
          <span className="product-price1">$99</span>
          <span className="product-actual-price1">$200</span>
          <span className="product-discount1">( 50% off )</span>
          <p className="product-sub-heading1">select size</p>
          <input
            type="radio"
            name="size"
            value="s"
            checked
            hidden
            id="s-size"
          />
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
          <button className="btn1 cart-btn1">add to cart</button>
          <button className="btn1 ">wishlist</button>
        </div>
      </section>
      <section className="detail-desc1">
        <h2 className="heading">description</h2>
        <p className="desc1">
          The href attribute requires a valid value to be accessible. Provide a
          valid, navigable address as the href value. If you cannot provide a
          valid href, but still need the element to resemble a link, use a
          button and change it with appropriate styles.The href attribute
          requires a valid value to be accessible. Provide a valid, navigable
          address as the href value. If you cannot provide a valid href, but
          still need the element to resemble a link, use a button and change it
          with appropriate styles.The href attribute requires a valid value to
          be accessible. Provide a valid, navigable address as the href value.
          If you cannot provide a valid href, but still need the element to
          resemble a link, use a button and change it with appropriate
          styles.The href attribute requires a valid value to be accessible.
          Provide a valid, navigable address as the href value. If you cannot
          provide a valid href, but still need the element to resemble a link,
          use a button and change it with appropriate styles.The href attribute
          requires a valid value to be accessible. Provide a valid, navigable
          address as the href value. If you cannot provide a valid href, but
          still need the element to resemble a link, use a button and change it
          with appropriate styles.The href attribute requires a valid value to
          be accessible. Provide a valid, navigable address as the href value.
          If you cannot provide a valid href, but still need the element to
          resemble a link, use a button and change it with appropriate styles.
        </p>
      </section>
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
