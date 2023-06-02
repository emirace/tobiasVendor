import axios from "axios";
import React, { useContext, useState } from "react";
import { socket } from "../App";
import Form from "react-bootstrap/Form";
import { Store } from "../Store";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { getError } from "../utils";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import LoadingBox from "./LoadingBox";

const Container = styled.div`
  padding: 30px;
`;
const Thumbs = styled.div`
  display: flex;
  & svg {
    font-size: 18px;
    padding-left: 10px;
    padding-right: 10px;
  }
`;

export default function WriteReview({ userId, setShowModel }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, mode } = state;
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("");
  const [like, setLike] = useState("");
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
      const { data } = await axios.post(
        `/api/reviews/${userId}`,
        { rating, comment, like },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      setLoading(false);
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Review submitted successfully",
          showStatus: true,
          state1: "visible1 success",
        },
      });

      socket.emit("post_data", {
        userId: userId,
        itemId: userId,
        notifyType: "review",
        msg: `${userInfo.username} gave you a review`,
        mobile: { path: "MyAccount", id: userId },
        link: `/seller/${userId}`,
        userImage: userInfo.image,
      });
      setRating("");
      setComment("");
      setLike("");
      setShowModel(false);
    } catch (err) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: getError(err),
          showStatus: true,
          state1: "visible1 error",
        },
      });
      setLoading(false);
    }
  };

  return (
    <Container>
      <form onSubmit={submitHandler}>
        <h2>Write a customer review</h2>
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
            onClick={() => setLike(true)}
            color={like ? "#eb9f40" : "grey"}
          />{" "}
          <div>Dislike</div>
          <FontAwesomeIcon
            icon={faThumbsDown}
            onClick={() => setLike(false)}
            color={!like ? "#eb9f40" : "grey"}
          />
        </Thumbs>
        <div className="my-3">
          <button className="search-btn1" disabled={loading} type="submit">
            Submit
          </button>
          {loading && <LoadingBox></LoadingBox>}
        </div>
      </form>
    </Container>
  );
}
