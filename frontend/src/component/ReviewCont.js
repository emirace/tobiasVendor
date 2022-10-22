import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Rating from "../component/Rating";
import LoadingBox from "./LoadingBox";
import { Store } from "../Store";
import { getError } from "../utils";
import { Link } from "react-router-dom";

const ListGroupI = styled.div`
  margin-left: 10px;
`;

const Para = styled.div``;

export const ReviewCont = ({ review }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: dataUser } = await axios.get(
          `/api/users/seller/${review.user}`
        );
        setUser(dataUser);
      } catch (err) {
        console.log(getError(err));
      }
    };
    fetchData();
  }, [review]);
  return !user ? (
    <LoadingBox />
  ) : (
    <div className="single_product_seller m-4">
      <img
        src={user.image}
        alt="review"
        id="single_product_seller_sq"
        style={{ width: "150px", height: "150px" }}
      />
      <ListGroupI>
        <strong>
          <Link to="/seller">@{review.name}</Link>
        </strong>
        <Para>
          <Rating rating={review.rating} caption=" "></Rating>
        </Para>

        <Para>{review.comment}</Para>
        <Para>
          <small>{review.createdAt.substring(0, 10)}</small>
        </Para>
      </ListGroupI>
    </div>
  );
};
