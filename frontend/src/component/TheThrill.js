import axios from "axios";
import React, { useEffect, useState } from "react";
import { region } from "../utils";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsAlt, faThumbsUp } from "@fortawesome/free-solid-svg-icons";

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

const SkeletonImage = styled.div`
  flex: 1;
  /* width: 100px; */
  height: 150px;
  background-color: #f0f0f0;
  animation: ${SkeletonPulse} 1.5s infinite;
`;

const SkeletonProductContainer = styled.div`
  flex: 0 0 calc(50% - 10px);
  padding: 10px;
  background-color: #f0f0f0;
  @media (min-width: 768px) {
    max-width: 240px;
  }
`;

const SkeletonProductName = styled.div`
  width: 80%;
  height: 18px;
  background-color: #e0e0e0;
  margin-top: 10px;
  animation: ${SkeletonPulse} 1.5s infinite;
`;

const SkeletonProductPrice = styled.div`
  width: 60%;
  height: 16px;
  background-color: #e0e0e0;
  margin-top: 5px;
  animation: ${SkeletonPulse} 1.5s infinite;
`;

const SkeletonProductDiscount = styled.div`
  width: 40px;
  height: 14px;
  background-color: #e0e0e0;
  margin-top: 5px;
  animation: ${SkeletonPulse} 1.5s infinite;
`;

const ProductsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  padding: 10px 10px;
  gap: 10px;
  @media (min-width: 768px) {
    flex-wrap: nowrap; /* Prevent wrapping of products on desktop */
    overflow-x: auto; /* Enable horizontal scrolling on desktop */
    padding: 10px 5vw;
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

const ProductContainer = styled.div`
  flex: 0 0 calc(33% - 10px);
  @media (min-width: 768px) {
    max-width: 200px;
  }
`;

const Image = styled.img`
  width: 100%;
`;

const ProductName = styled.h3`
  font-size: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
  margin: 5px 0 0 0;
`;

const ProductPrice = styled.p`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 0px;
`;

const DiscountBadge = styled.span`
  color: #fff;
  background-color: #e74c3c;
  font-size: 12px;
  padding: 2px 5px;
  border-radius: 3px;
  margin-left: 5px;
`;

const ViewMoreButton = styled.button`
  display: block;
  margin: 20px auto;
  margin-top: 0;
  padding: 5px 20px;
  font-size: 16px;
  background-color: var(--orange-color);
  border-radius: 0.2rem;
  color: #fff;
  font-weight: bold;
  border: none;
  cursor: pointer;
  &:hover {
    background-color: var(--malon-color);
  }
  @media (max-width: 768px) {
    width: 95%;
  }
`;

const ErrorText = styled.p`
  color: red;
`;

const SkeletonProduct = () => (
  <SkeletonProductContainer>
    <SkeletonImage />
    <SkeletonProductName />
    <SkeletonProductPrice />
    <SkeletonProductDiscount />
  </SkeletonProductContainer>
);

export default function TheThrill() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const sliderHandler = (direction) => {
    var slider = document.getElementById("slider");
    if (direction === "left") {
      slider.scrollBy(-200, 0);
      // setSliderIndex(sliderIndex > 0 ? sliderIndex - 1 : products.length - 5);
    } else {
      slider.scrollBy(200, 0);
    }
  };

  const handleViewMore = () => {
    navigate("/search");
  };

  const handleClick = (slug) => {
    navigate(`/product/${slug}`);
  };

  return (
    <div style={{ marginTop: "20px", position: "relative" }}>
      <div className="product-title">
        <h2 className="product-category1">Shop The Thrill</h2>
      </div>

      <button onClick={() => sliderHandler("left")} className="pre-btn1">
        <i className="fa fa-angle-left"></i>
      </button>
      <button onClick={() => sliderHandler("right")} className="next-btn1">
        <i className="fa fa-angle-right"></i>
      </button>
      {loading ? (
        <ProductsContainer>
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonProduct key={index} />
          ))}
        </ProductsContainer>
      ) : error ? (
        <ErrorText>{error}</ErrorText>
      ) : (
        <ProductsContainer>
          {products.slice(0, 6).map((product) => (
            <ProductContainer
              key={product._id}
              onClick={() => handleClick(product.slug)}
            >
              <Image src={product.image} alt={product.name} />
              <ProductName>{product.name}</ProductName>
              {/* <ProductBrand>{product.brand}</ProductBrand> */}
              <ProductPrice>
                {discount(product) ? (
                  <>
                    <span>
                      {product.currency}
                      {product.actualPrice}
                    </span>
                    <DiscountBadge>{discount(product)}% Off</DiscountBadge>
                  </>
                ) : (
                  `${product.currency}${product.price}`
                )}
              </ProductPrice>
              {/* <ul className="product_hover">
                <li>
                  <span
                  // onClick={() => setShowModel(!showModel)}
                  >
                    <FontAwesomeIcon icon={faArrowsAlt} />
                  </span>
                </li>
                <li>
                <span onClick={toggleLikes}>*/}
              {/* <FontAwesomeIcon icon={faThumbsUp} /> */}
              {/*   </span>
                </li>
                <li>
                  <span onClick={() => saveItem()}>
                    <FontAwesomeIcon icon={faHeart} />
                  </span>
                </li>
              </ul> */}
            </ProductContainer>
          ))}
        </ProductsContainer>
      )}
      <ViewMoreButton onClick={handleViewMore}>View More</ViewMoreButton>
    </div>
  );
}
