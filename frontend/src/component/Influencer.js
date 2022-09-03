import axios from "axios";
import React, { useEffect, useReducer } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { baseURL, getError } from "../utils";
import LoadingBox from "./LoadingBox";
import MessageBox from "./MessageBox";

const Container = styled.div``;
const User = styled.div`
  display: flex;
  gap: 5px;
`;
const ProfileImg = styled.img`
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
`;
const Details = styled.div``;
const Names = styled.div`
  font-weight: bold;
  text-transform: capitalize;
`;
const Username = styled.div`
  color: var(--orange-color);
`;
const ProductList = styled.div`
  margin: 10px 0;
  display: flex;
  gap: 20px;
  @media (max-width: 992px) {
    overflow-x: auto;
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;
const Product = styled.div``;
const ProductImg = styled.img`
  width: 180px;
  height: 180px;
  object-fit: cover;
  @media (max-width: 992px) {
    width: 150px;
    height: 150px;
  }
`;
const PDetail = styled.div`
  display: flex;
  justify-content: space-between;
`;
const Price = styled.div`
  font-weight: bold;
`;
const Sizes = styled.div`
  display: flex;
  gap: 5px;
`;
const Size = styled.div`
  color: grey;
`;

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_USER_REQUEST":
      return { ...state, loadingUser: true };
    case "FETCH_USER_SUCCESS":
      return {
        ...state,
        loadingUser: false,
        user: action.payload,
        error: "",
      };
    case "FETCH_PRODUCT_REQUEST":
      return { ...state, loading: true };
    case "FETCH_PRODUCT_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case "FETCH_PRODUCT_FAIL":
      return {
        ...state,
        loading: false,
        loadingUser: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
export default function Influencer({ sellerId }) {
  const [{ loading, loadingUser, error, products, pages, user }, dispatch] =
    useReducer(reducer, {
      loading: true,
      loadingUser: true,
      error: "",
      user: {},
      products: [],
    });

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get("page") || 1;

  useEffect(() => {
    const getUser = async () => {
      try {
        dispatch({ type: "FETCH_USER_REQUEST" });
        const { data: dataUser } = await axios.get(
          `/api/users/seller/${sellerId}`
        );
        dispatch({ type: "FETCH_USER_SUCCESS", payload: dataUser });

        dispatch({ type: "FETCH_PRODUCT_REQUEST" });
        const { data: dataProduct } = await axios.get(
          `/api/products/seller/${sellerId}?page=${page}`
        );
        dispatch({
          type: "FETCH_PRODUCT_SUCCESS",
          payload: dataProduct,
        });
      } catch (err) {
        dispatch({ type: "FETCH_PRODUCT_FAIL", error: getError(err) });
      }
    };

    getUser();
  }, [sellerId, page]);

  return loadingUser ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <Container>
      <User>
        <ProfileImg src={user.image} alt="img" />
        <Details>
          <Names>
            {user.firstName} {user.lastName}
          </Names>
          <Username>@{user.username}</Username>
        </Details>
      </User>
      <ProductList>
        {products.length > 0 ? (
          products.slice(0, 3).map((product) => (
            <Product>
              <ProductImg src={product.image} alt="img" />
              <PDetail>
                <Price>
                  {product.current}
                  {product.actualPrice}
                </Price>
                <Sizes>
                  {product.sizes.map((size) => (
                    <Size>{size.name}</Size>
                  ))}
                </Sizes>
              </PDetail>
            </Product>
          ))
        ) : (
          <div>Loading...</div>
        )}
      </ProductList>
    </Container>
  );
}
