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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsAlt,
  faHeart,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";

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

const SoldAll = styled.div`
  position: absolute;
  background: grey;
  padding: 5px;
  border-radius: 5px;
  color: white;
  right: 10px;
  top: 10px;
  text-transform: uppercase;
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
    if (parseInt(product.price) < parseInt(product.actualPrice)) return null;
    return (
      ((parseInt(product.price) - parseInt(product.actualPrice)) /
        parseInt(product.price)) *
      100
    );
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
          {product.soldAll ? (
            <SoldAll>sold</SoldAll>
          ) : discount() ? (
            <span className="discount-tag1 ">{discount().toFixed(0)}% off</span>
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
              <FontAwesomeIcon icon={faArrowsAlt} />
            </span>
          </li>
          <li>
            <span onClick={toggleLikes}>
              <FontAwesomeIcon icon={faThumbsUp} />
            </span>
          </li>
          <li>
            <span onClick={() => saveItem()}>
              <FontAwesomeIcon icon={faHeart} />
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
          {parseInt(product.actualPrice)}
        </span>
        {parseInt(product.price) &&
          (parseInt(product.price) > parseInt(product.actualPrice) ? (
            <span className="actual-price1">
              {product.currency}
              {parseInt(product.price)}
            </span>
          ) : null)}
      </div>
    </div>
  );
}
