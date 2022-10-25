import styled from "styled-components";
import React, { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import { Link } from "react-router-dom";
import Rating from "../component/Rating";
import ListGroup from "react-bootstrap/ListGroup";
import { ReviewCont } from "../component/ReviewCont";
import axios from "axios";
import LoadingBox from "../component/LoadingBox";
import MessageBox from "../component/MessageBox";

const Container = styled.div`
  height: 100%;
  width: 100%;
  padding: 10px;
`;

const Tab = styled.div`
  display: flex;
  margin-bottom: 5ps;
  justify-content: center;
`;
const Content = styled.div``;
const TabItem = styled.div`
  display: flex;
  justify-content: crnter;
  cursor: pointer;
  margin: 10px;
  position: relative;
  min-width: 50px;
  &:hover {
    color: var(--orange-color);
  }
  &.active {
    color: var(--orange-color);
    font-weight: bold;
    &::after {
      content: "";
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 100%;
      height: 2px;
      background: var(--orange-color);
    }
  }
`;

const ReviewCont1 = styled.div`
  margin-top: 5px;
`;
const Scrollable = styled.div`
  height: 500px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

export default function ReviewLists({ userId }) {
  const { state } = useContext(Store);
  const { mode } = state;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getReviews = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/users/allreviews/${userId}`);
        setReviews(data);
        console.log(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    getReviews();
  }, []);

  const [displayTab, setDisplayTab] = useState("sold");

  const tabSwitch = (tab) => {
    switch (tab) {
      case "sold":
        return (
          <ReviewCont1>
            {reviews.map((review) => {
              if (review.type === "buyer") {
                return <ReviewCont review={review} userId={userId} />;
              }
            })}
          </ReviewCont1>
        );
      case "purchase":
        return (
          <ReviewCont1>
            {reviews.map((review) => {
              if (review.type === "seller") {
                return <ReviewCont review={review} userId={userId} />;
              }
            })}
          </ReviewCont1>
        );
      default:
        return <></>;
    }
  };

  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox>{error}</MessageBox>
  ) : (
    <Container>
      <Tab>
        <TabItem
          className={displayTab === "sold" && "active"}
          onClick={() => setDisplayTab("sold")}
        >
          Sold (Seller)
        </TabItem>
        <TabItem
          className={displayTab === "purchase" && "active"}
          onClick={() => setDisplayTab("purchase")}
        >
          Purchase (Buyer)
        </TabItem>
      </Tab>
      <Content>
        <Scrollable>{tabSwitch(displayTab)}</Scrollable>
      </Content>
    </Container>
  );
}
