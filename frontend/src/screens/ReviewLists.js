import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { Store } from "../Store";
import Rating from "../component/Rating";
import { getError } from "../utils";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFaceSmile,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import MessageBox from "../component/MessageBox";
import moment from "moment";

const reviews1 = [
  {
    id: 1,
    reviewerName: "John Doe",
    reviewerImage:
      "https://res.cloudinary.com/emirace/image/upload/v1675795105/ndksunuy8k2xdsc6wr56.webp",
    rating: 4.5,
    review: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    time: "2 days ago",
    sellerReply: "Thank you for your review!",
  },
  {
    id: 2,
    reviewerName: "Jane Smith",
    reviewerImage:
      "https://res.cloudinary.com/emirace/image/upload/v1675795105/ndksunuy8k2xdsc6wr56.webp",
    rating: 3.8,
    review: "Nullam tempor ex vel quam consequat aliquam.",
    time: "5 days ago",
  },
  // Add more review objects as needed
];

const ReviewLists = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const getReviews = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/reviews/${userId}`);
        setReviews(data);
        console.log("jgfds", data);
        setLoading(false);
      } catch (err) {
        setError(getError(err.message));
        setLoading(false);
      }
    };
    getReviews();
  }, [userId]);

  return (
    <Container>
      <Header>Reviews</Header>
      <ReviewList>
        {reviews.length === 0 && <MessageBox>There is no reviews</MessageBox>}
        {reviews.map((item) => (
          <ReviewItem item={item} />
        ))}
      </ReviewList>
    </Container>
  );
};

const ReviewItem = ({ item }) => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo } = state;
  const [replyVisible, setReplyVisible] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentReview, setCurrentReview] = useState(item);

  const handleReply = () => {
    setReplyVisible(true);
  };

  const handleReplySubmit = async () => {
    try {
      if (!replyText) {
        ctxDispatch({
          type: "SHOW_TOAST",
          payload: {
            message: "Enter a reply",
            showStatus: true,
            state1: "visible1 error",
          },
        });
        return;
      }
      setLoading(true);
      const { data } = await axios.put(
        `/api/reviews/${item._id}`,
        { comment: replyText },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      setCurrentReview(data);
      setReplyText("");
      setReplyVisible(false);
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Reply submitted successfully",
          showStatus: true,
          state1: "visible1 success",
        },
      });
      setLoading(false);
    } catch (error) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: getError(error),
          showStatus: true,
          state1: "visible1 error",
        },
      });
    }
  };

  return (
    <ReviewContainer>
      <ReviewerInfoContainer>
        <ReviewerImage src={currentReview?.buyerId?.image} alt="Reviewer" />
        <Info>
          <Link to={`/seller/${currentReview?.buyerId?._id}`}>
            <ReviewerName>{currentReview?.buyerId?.username}</ReviewerName>
          </Link>
          <ReviewTime>{moment(currentReview.createdAt).fromNow()}</ReviewTime>
        </Info>
      </ReviewerInfoContainer>
      <ReviewContent>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Rating rating={currentReview.rating} caption=" " />
          <FontAwesomeIcon
            style={{ marginLeft: "30px" }}
            icon={currentReview.like ? faThumbsUp : faThumbsDown}
            color={currentReview.like ? "#eb9f40" : "red"}
            size={"lg"}
          />
        </div>
        <ReviewText>{currentReview.comment}</ReviewText>
        {currentReview.sellerReply && (
          <SellerReplyContainer mode={mode}>
            {currentReview.sellerReply}
          </SellerReplyContainer>
        )}
        {!replyVisible &&
          !currentReview.sellerReply &&
          userInfo._id === currentReview?.sellerId?._id && (
            <ReplyButton onClick={handleReply}>Reply</ReplyButton>
          )}
        {replyVisible && (
          <ReplyInputContainer>
            <ReplyInput
              mode={mode}
              placeholder="Type your reply"
              placeholderTextColor="grey"
              onChange={(e) => setReplyText(e.target.value)}
              value={replyText}
            />
            <SubmitButton onClick={handleReplySubmit}>Submit</SubmitButton>
          </ReplyInputContainer>
        )}
      </ReviewContent>
    </ReviewContainer>
  );
};

const Container = styled.div`
  padding: 30px;
`;
const Header = styled.div`
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 20px;
`;

const ReviewList = styled.div`
  padding-bottom: 20px;
`;

const ReviewContainer = styled.div`
  margin-bottom: 20px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
`;

const ReviewerInfoContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  margin-right: 10px;
`;

const ReviewerImage = styled.img`
  width: 50px !important;
  height: 50px !important;
  border-radius: 25px;
  margin-right: 0 !important;
`;
const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const ReviewerName = styled.div`
  font-weight: bold;
  font-size: 16px;
`;

const ReviewTime = styled.div`
  font-size: 12px;
  color: #999999;
`;

const ReviewContent = styled.div`
  flex: 1;
  margin-left: 16px;
`;

const ReviewText = styled.div`
  font-size: 14px;
  margin-bottom: 8px;
`;

const SellerReplyContainer = styled.div`
  border-radius: 5px;
  padding: 8px;
  margin-bottom: 8px;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev2)"};
`;

const ReplyButton = styled.button`
  background-color: var(--orange-color);
  padding: 8px 16px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: bold;
  border: 0;
  font-size: 14px;
`;

const ReplyInputContainer = styled.div`
  margin-top: 10px;
`;

const ReplyInput = styled.textarea`
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 10px;
  max-height: 100px;
  color: ${(props) => (props.mode === "pagebodylight" ? "black" : "white")};
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev2)"};
`;

const SubmitButton = styled.button`
  background-color: var(--orange-color);
  padding: 8px 16px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: bold;
  font-size: 14px;
  border: 0;
`;

export default ReviewLists;
