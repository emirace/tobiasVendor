import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const AddOuutfit = styled.span`
  width: 200px !important;
  border-radius: 0.2rem !important;
  height: auto;
  cursor: pointer;
  & i {
    transform: rotate(360deg) !important;
  }
`;

export default function OutfitProduct(props) {
  const { product, addOutfit } = props;

  return (
    <div className="product-card1">
      <div className="product-image1">
        <Link to={`/product/${product.slug}`}>
          <span className="discount-tag1 ">
            (
            {(((product.price - product.actualPrice) / product.price) * 100)
              .toString()
              .substring(0, 3)}
            % off)
          </span>
          <img
            src={product.image}
            className="product-thumb1"
            alt={product.name}
          ></img>
        </Link>
        <ul className="product_hover">
          <li>
            <AddOuutfit onClick={() => addOutfit(product)}>
              <i>Add To Outfit</i>
            </AddOuutfit>
          </li>
        </ul>
      </div>
      <div className="product-info1">
        <h2 className="product-brand1">
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h2>
        <p className="product-short-desc1">{product.brand}</p>
        <span className="price1">${product.actualPrice}</span>
        <span className="actual-price1">${product.price}</span>
      </div>
    </div>
  );
}
