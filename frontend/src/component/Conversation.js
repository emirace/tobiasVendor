import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Store } from "../Store";
import { getError } from "../utils";
import LoadingBox from "./LoadingBox";
import moment from "moment";

const User = styled.div`
  position: relative;
  cursor: pointer;
  padding: 10px 25px;
  display: flex;
  align-items: center;
  margin: 10px 0;
  @media (max-width: 992px) {
    padding: 10px;
  }
  &.active {
    background: ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev3)" : "var(--light-ev3)"};
  }
`;
const ProfileImg = styled.img.attrs((props) => ({
  src: props.src,
}))`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  object-position: top;
  margin-right: 15px;
`;
const ProfileDetail = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const Name = styled.div`
  color: var(--orange-color);
  margin-bottom: 5px;
  font-weight: bold;
  text-transform: capitalize;
`;
const LastMsg = styled.div`
  font-size: 12px;
  display: flex;
  width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const Badge = styled.div`
  width: 10px;
  position: absolute;
  right: 10px;
  top: 30%;
  height: 10px;
  border-radius: 50%;
  background: green;
`;
const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
`;

export default function Conversation({ conversation, status, currentChat }) {
  const { state } = useContext(Store);
  const { userInfo, mode } = state;
  const [user, setUser] = useState([]);
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== userInfo._id);
    console.log("friend", friendId);
    const getUser = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/users/seller/${userInfo._id}`, {
          header: { Authorization: `Bearer ${userInfo.token}` },
        });
        setUser(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };
    if (friendId) {
      getUser();
    }
  }, [conversation, userInfo]);

  const [message, setMessage] = useState({});

  useEffect(() => {
    const getMessages = async () => {
      try {
        const { data } = await axios.get(`/api/messages/${conversation._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setMessage(data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [conversation, userInfo]);

  useEffect(() => {
    const getproduct = async () => {
      try {
        setLoading(true);
        if (conversation.productId) {
          const { data } = await axios.get(
            `/api/products/${conversation.productId}`
          );
          setProduct(data);
          setLoading(false);
        } else if (conversation.userId) {
          console.log(conversation.userId);
          const { data } = await axios.get(
            `/api/users/seller/${conversation.userId}`,
            {
              header: { Authorization: `Bearer ${userInfo.token}` },
            }
          );
          console.log("lll", data);
          setProduct(data);
          setLoading(false);
        }
      } catch (err) {
        setLoading(false);
        console.log(getError(err));
      }
    };
    getproduct();
  }, []);

  return loading ? (
    <LoadingBox />
  ) : (
    <>
      <User
        mode={mode}
        className={currentChat === conversation._id ? "active" : ""}
      >
        <ProfileImg
          src={
            conversation.conversationType === "reportProduct" ||
            conversation.conversationType === "reportUser"
              ? ""
              : user.image
          }
        />
        <ProfileDetail>
          <Name>
            {conversation.conversationType === "reportProduct" ||
            conversation.conversationType === "reportUser" ? (
              <div style={{ color: "red" }}>Reporting</div>
            ) : (
              user.username
            )}
          </Name>
          <LastMsg>
            {message.message && message.messages.length > 0
              ? message.messages[message.messages.length - 1].text
              : "No messages"}
          </LastMsg>
          <div style={{ color: "grey" }}>
            {moment(conversation.createdAt).fromNow()}
          </div>
        </ProfileDetail>
        {console.log(product)}
        {(conversation.productId || conversation.userId) && (
          <ProductImage src={product.image} />
        )}
        {status && <Badge />}
      </User>
    </>
  );
}
