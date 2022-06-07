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

const Sold = styled.div`
    position: absolute;
    top: 50%;
    right: 50%;
    transform: translate(50%, -50%);
    font-size: 24px;
    font-weight: bold;
    color: var(--orange-color);
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
            window.alert("Sorry. Product is out of stock");
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
            },
        });
        console.log(state);
    };

    const toggleLikes = async () => {
        if (!userInfo) {
            toast.error("login to like");
            return;
        }
        if (product.seller._id === userInfo._id) {
            alert("it is your product");
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
            } else {
                const { data } = await axios.put(
                    `/api/products/${product._id}/likes`,
                    {},
                    {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    }
                );
                setProduct(data.product);
            }
        } catch (err) {
            toast.error(getError(err));
        }
    };

    return (
        <div className="product-card1">
            {showNotification && (
                <Notification
                    text="Item added to Cart"
                    buttonText={"Checkout"}
                />
            )}
            <Model showModel={showModel} setShowModel={setShowModel}>
                <img src={product.image} alt={product.name} />
            </Model>
            <div className="product-image1">
                <Link to={`/product/${product.slug}`}>
                    <span className="discount-tag1 ">50% off</span>
                    <img
                        src={product.image}
                        className="product-thumb1"
                        alt={product.name}
                    ></img>
                </Link>
                <ul className="product_hover">
                    <li>
                        <Link to="#" onClick={() => setShowModel(!showModel)}>
                            <i className="fa fa-arrows-alt"></i>
                        </Link>
                    </li>
                    <li>
                        <Link to="#" onClick={toggleLikes}>
                            <i className="fa fa-heart"></i>
                        </Link>
                    </li>
                    <li>
                        <Link to="#" onClick={() => addToCartHandler(product)}>
                            <i className="fa fa-shopping-bag"></i>
                        </Link>
                    </li>
                </ul>
                {product.sold && (
                    <div className="overlay">
                        <Sold>SOLD</Sold>
                    </div>
                )}
            </div>
            <div className="product-info1">
                <h2 className="product-brand1">
                    <Link to={`/product/${product.slug}`}>{product.name}</Link>
                </h2>
                <p className="product-short-desc1">{product.brand}</p>
                <span className="price1">${product.price}</span>
                <span className="actual-price1">$150</span>
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
