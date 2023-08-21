import axios from "axios";
import React, { useEffect, useState } from "react";
import { region } from "../utils";
import styled, { keyframes } from "styled-components";

const SkeletonPulse = keyframes`
  0% {
    background-color: #f0f0f0;
  }
  50% {
    background-color: #e0e0e0;
  }
  100% {
    background-color: #f0f0f0;
  }
`;

const SkeletonProductContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const SkeletonImage = styled.div`
  width: 100px;
  height: 100px;
  background-color: #f0f0f0;
  animation: ${SkeletonPulse} 1.5s infinite;
`;

const SkeletonText = styled.div`
  flex-grow: 1;
  height: 20px;
  background-color: #f0f0f0;
  animation: ${SkeletonPulse} 1.5s infinite;
  margin-left: 10px;
`;

const ProductsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 10px;
  gap: 10px;
  @media (min-width: 768px) {
    flex-wrap: nowrap; /* Prevent wrapping of products on desktop */
    overflow-x: auto; /* Enable horizontal scrolling on desktop */
  }
`;

const ProductContainer = styled.div`
  flex: 0 0 calc(50% - 5px);
`;

const Image = styled.img`
  width: 100%;
`;

const ProductName = styled.h3`
  font-size: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 150px;
  margin: 5px 0 0 0;
`;

const ProductBrand = styled.p`
  font-size: 14px;
  margin-bottom: 0;
`;

const ProductPrice = styled.p`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const DiscountBadge = styled.span`
  color: #fff;
  background-color: #e74c3c;
  font-size: 12px;
  padding: 2px 5px;
  border-radius: 3px;
  margin-left: 5px;
`;

const SkeletonProduct = () => (
  <SkeletonProductContainer>
    <SkeletonImage />
    <SkeletonText />
  </SkeletonProductContainer>
);

const ErrorText = styled.p`
  color: red;
`;

export default function TheThrill() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/products/${region()}/all`);
        setProducts(response.data);
      } catch (err) {
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const discount = (product) => {
    const price = parseInt(product.price);
    const actualPrice = parseInt(product.actualPrice);

    if (price <= actualPrice) {
      return null; // No discount
    }

    const discountPercentage = ((price - actualPrice) / price) * 100;
    return discountPercentage.toFixed(2); // Return with 2 decimal places
  };

  return (
    <div>
      <div className="product-title">
        <h2 className="product-category1">Shop The Thrill</h2>
      </div>
      {loading ? (
        Array.from({ length: 6 }).map((_, index) => (
          <SkeletonProduct key={index} />
        ))
      ) : error ? (
        <ErrorText>{error}</ErrorText>
      ) : (
        <ProductsContainer>
          {products.map((product) => (
            <ProductContainer key={product._id}>
              <Image src={product.image} alt={product.name} />
              <ProductName>{product.name}</ProductName>
              <ProductBrand>{product.brand}</ProductBrand>
              <ProductPrice>
                {discount(product) ? (
                  <>
                    <span>
                      {console.log(discount(product))}${product.currency}
                      {product.price}
                    </span>
                    <DiscountBadge>{discount(product)}% Off</DiscountBadge>
                  </>
                ) : (
                  `${product.currency}${product.price}`
                )}
              </ProductPrice>
            </ProductContainer>
          ))}
        </ProductsContainer>
      )}
    </div>
  );
}
