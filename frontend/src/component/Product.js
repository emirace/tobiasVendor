import React, { useContext, useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import axios from "axios";
import { Store } from "../Store";
import styled from "styled-components";
import Notification from "./Notification";
import Model from "../component/Model";
import { toast } from "react-toastify";
import { getError } from "../utils";

const ModelImg = styled.img.attrs((props) => ({
  src: props.src,
  alt: props.alt,
}))`
  width: auto;
  height: 100%;
`;

const ConImg = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
`;

export default function Product(props) {
  const { product: p1 } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
    userInfo,
  } = state;
  const [showModel, setShowModel] = useState(false);
  const [product, setProduct] = useState(p1);
  const [showNotification, setShowNotification] = useState(false);

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Sorry. Product is out of stock",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }

    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
    ctxDispatch({
      type: "SHOW_NOTIFICAATION",
      payload: {
        text: "Item added to Cart",
        showStatus: true,
        buttonText: "Checkout",
        link: "/cart",
      },
    });
  };

  const toggleLikes = async () => {
    if (!userInfo) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Login to like a product",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    if (product.seller._id === userInfo._id) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "You can't like your product",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    try {
      if (product.likes.find((x) => x === userInfo._id)) {
        const { data } = await axios.put(
          `/api/products/${product._id}/unlikes`,
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        setProduct(data.product);
        ctxDispatch({
          type: "SHOW_TOAST",
          payload: {
            message: "Item unLiked",
            showStatus: true,
            state1: "visible1 error",
          },
        });
      } else {
        const { data } = await axios.put(
          `/api/products/${product._id}/likes`,
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        setProduct(data.product);
        ctxDispatch({
          type: "SHOW_TOAST",
          payload: {
            message: "Item Liked",
            showStatus: true,
            state1: "visible1 success",
          },
        });
      }
    } catch (err) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: getError(err),
          showStatus: true,
          state1: "visible1 error",
        },
      });
    }
  };

  const saveItem = async () => {
    if (!userInfo) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "login to add item to wishlist",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    if (product.seller._id === userInfo._id) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "You can't add your product to wishlist",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    try {
      const { data } = await axios.put(
        `/api/products/${product._id}/save`,
        {},
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: data.message,
          showStatus: true,
          state1: data.status,
        },
      });
      // dispatch({ type: 'REFRESH_PRODUCT', payload: data.user });
    } catch (err) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: getError(err),
          showStatus: true,
          state1: "visible1 error",
        },
      });
    }
  };

  const discount = () => {
    return ((product.price - product.actualPrice) / product.price) * 100;
  };

  return (
    <div className="product-card1">
      {showNotification && (
        <Notification text="Item added to Cart" buttonText={"Checkout"} />
      )}
      <Model showModel={showModel} setShowModel={setShowModel}>
        <ConImg>
          <ModelImg src={product.image} alt={product.name} />
        </ConImg>
      </Model>
      <div className="product-image1">
        <Link to={`/product/${product.slug}`}>
          {discount() ? (
            <span className="discount-tag1 ">{discount().toFixed(2)}% off</span>
          ) : (
            ""
          )}
          <img
            src={product.image}
            className="product-thumb1"
            alt={product.name}
          ></img>
        </Link>
        <ul className="product_hover">
          <li>
            <span onClick={() => setShowModel(!showModel)}>
              <i className="fa fa-arrows-alt"></i>
            </span>
          </li>
          <li>
            <span onClick={toggleLikes}>
              <i className="fa fa-heart"></i>
            </span>
          </li>
          <li>
            <span onClick={() => saveItem()}>
              <i className="fa fa-bookmark"></i>
            </span>
          </li>
        </ul>
      </div>
      <div className="product-info1">
        <h2 className="product-brand1">
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h2>
        <p className="product-short-desc1">{product.brand}</p>
        <span className="price1">
          {product.currency}
          {product.price}
        </span>
        <span className="actual-price1">
          {product.currency}
          {product.actualPrice}
        </span>
      </div>
    </div>
    // <div className="product_item">
    //   <div className="product_item_pic bg-primary">
    //     <Link to={`/product/${product.slug}`}>
    //       <img src={product.image} alt="" />
    //     </Link>
    //     {product.countInStock === 0 ? (
    //       <div className="label stockout">Out of Stock</div>
    //     ) : (
    //       <div className="label new">New</div>
    //     )}
    //     <ul className="product_hover">
    //       <li>
    //         <a href="/#">
    //           <i className="fa fa-arrows-alt"></i>
    //         </a>
    //       </li>
    //       <li>
    //         <a href="/#">
    //           <i className="fa fa-heart"></i>
    //         </a>
    //       </li>
    //       <li>
    //         <a onClick={() => addToCartHandler(product)} href="/#">
    //           <i className="fa fa-shopping-bag"></i>
    //         </a>
    //       </li>
    //     </ul>
    //   </div>
    //   <div className="product_item_text">
    //     <h6>
    //       <Link to={`/product/${product.slug}`}>
    //         <a href="/#">{product.name}</a>
    //         {product.countInStock}
    //       </Link>
    //     </h6>
    //     <div className="rating">
    //       <Rating rating={product.rating} numReviews={product.numReviews} />
    //     </div>
    //     <div className="product_price">$ {product.price}</div>
    //   </div>
    // </div>
  );
}
