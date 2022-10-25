import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Rating from "../component/Rating";
import LoadingBox from "./LoadingBox";
import { Store } from "../Store";
import { getError } from "../utils";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { socket } from "../App";

const ListGroupI = styled.div`
  margin-left: 10px;
`;

const Para = styled.div``;
const Reply = styled.div`
  margin: auto 0 0 auto;
  background: var(--orange-color);
  padding: 5px 7px;
  border-radius: 0.2rem;
`;

const Thumbs = styled.div`
  display: flex;
  & svg {
    font-size: 18px;
    padding-left: 10px;
    padding-right: 10px;
  }
`;

export const ReviewCont = ({ review, userId }) => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo } = state;
  const [user, setUser] = useState(null);
  const [rating, setRating] = useState(0);
  const [like, setLike] = useState("");
  const [comment, setComment] = useState("");
  const [loadingCreateReview, setLoadingCreateReview] = useState(false);
  const [showReply, setShowReply] = useState(false);
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

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!comment) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Please enter review",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    if (!rating) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Please select rating",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    if (!like) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Give review a thumb up or thumb down",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    try {
      setLoadingCreateReview(true);
      const { data } = await axios.post(
        `/api/users/${userId}/reviews`,
        { rating, comment, name: user.username, user, like, type: "seller" },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      setLoadingCreateReview(false);
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Review submitted successfully",
          showStatus: true,
          state1: "visible1 success",
        },
      });

      socket.emit("post_data", {
        userId: user._id,
        itemId: userId,
        notifyType: "replyreview",
        msg: `${userInfo.username} reply your review`,
        link: `/seller/${userId}`,
        userImage: userInfo.image,
      });
      setRating("");
      setComment("");
      setLike("");
      setShowReply(false);
    } catch (err) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: getError(err),
          showStatus: true,
          state1: "visible1 error",
        },
      });
      setLoadingCreateReview(false);
    }
  };

  return !user ? (
    <LoadingBox />
  ) : (
    <>
      <div className="single_product_seller m-4">
        <img
          src={user.image}
          alt="review"
          id="single_product_seller_sq"
          style={{ width: "150px", height: "150px" }}
        />
        <ListGroupI>
          <strong>
            <Link to={`/seller/${user._id}`}>@{review.name}</Link>
          </strong>
          <Para>
            <Rating rating={review.rating} caption=" "></Rating>
          </Para>

          <Para>{review.comment}</Para>
          <Para>
            <small>{review.createdAt.substring(0, 10)}</small>
          </Para>
        </ListGroupI>
        {userInfo._id === userId && (
          <Reply onClick={() => setShowReply(true)}>Reply</Reply>
        )}
      </div>
      {showReply && (
        <form onSubmit={submitHandler}>
          <Form.Group className="my-3" controlId="rating">
            <Form.Label>Rating</Form.Label>
            <Form.Select
              aria-label="Rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="1">1- Poor</option>
              <option value="2">2- Fair</option>
              <option value="3">3- Good</option>
              <option value="4">4- Very good</option>
              <option value="5">5- Excelent</option>
            </Form.Select>
          </Form.Group>
          <FloatingLabel
            controlId="floatingTextarea"
            lablel="Coments"
            className="my-3"
          >
            <Form.Control
              className={` ${mode === "pagebodydark" ? "" : "color_black"}`}
              as="textarea"
              placeholder="Leave a comment here"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </FloatingLabel>
          <Thumbs>
            <div>Like</div>
            <FontAwesomeIcon
              icon={faThumbsUp}
              onClick={() => setLike("yes")}
              color={like === "yes" ? "#eb9f40" : "grey"}
            />{" "}
            <div>Dislike</div>
            <FontAwesomeIcon
              icon={faThumbsDown}
              onClick={() => setLike("no")}
              color={like === "no" ? "#eb9f40" : "grey"}
            />
          </Thumbs>
          <div className="my-3">
            <button
              className="search-btn1"
              disabled={loadingCreateReview}
              type="submit"
            >
              Submit
            </button>
            {loadingCreateReview && <LoadingBox></LoadingBox>}
          </div>
        </form>
      )}
    </>
  );
};
