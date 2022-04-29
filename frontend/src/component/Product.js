import React, { useContext } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import axios from 'axios';
import { Store } from '../Store';

export default function Product(props) {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Sorry. Product is out of stock');
      return;
    }
    //
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };
  return (
    <div className="product_item">
      <div className="product_item_pic bg-primary">
        <Link to={`/product/${product.slug}`}>
          <img src={product.image} alt="" />
        </Link>
        {product.countInStock === 0 ? (
          <div className="label stockout">Out of Stock</div>
        ) : (
          <div className="label new">New</div>
        )}
        <ul className="product_hover">
          <li>
            <a href="/#">
              <i className="fa fa-arrows-alt"></i>
            </a>
          </li>
          <li>
            <a href="/#">
              <i className="fa fa-heart"></i>
            </a>
          </li>
          <li>
            <a onClick={() => addToCartHandler(product)} href="/#">
              <i className="fa fa-shopping-bag"></i>
            </a>
          </li>
        </ul>
      </div>
      <div className="product_item_text">
        <h6>
          <Link to={`/product/${product.slug}`}>
            <a href="/#">{product.name}</a>
            {product.countInStock}
          </Link>
        </h6>
        <div className="rating">
          <Rating rating={product.rating} numReviews={product.numReviews} />
        </div>
        <div className="product_price">$ {product.price}</div>
      </div>
    </div>
  );
}
