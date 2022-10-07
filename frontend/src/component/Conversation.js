import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Store } from "../Store";
import { getError } from "../utils";
import LoadingBox from "./LoadingBox";
import moment from "moment";
import { Badge } from "./Navbar";

const User = styled.div`
  position: relative;
  cursor: pointer;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  margin: 10px 5px;
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
const Badge1 = styled.div`
  width: 10px;
  margin-left: 10px;
  height: 10px;
  border-radius: 50%;
  background: green;
`;
const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
`;

export default function Conversation({
  conversation,
  status,
  currentChat,
  report,
}) {
  const { state } = useContext(Store);
  const { userInfo, mode, notifications } = state;
  const [user, setUser] = useState([]);
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  const count = notifications.filter(
    (x) => x.itemId === conversation._id && x.read === false
  );

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== userInfo._id);
    console.log("friend", friendId);
    const getUser = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/users/seller/${friendId}`, {
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
          const { data } = await axios.get(
            `/api/users/seller/${conversation.userId}`,
            {
              header: { Authorization: `Bearer ${userInfo.token}` },
            }
          );
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
        {report ? (
          <ProfileImg src={user.image} />
        ) : (
          <ProfileImg
            src={
              conversation.conversationType === "reportProduct" ||
              conversation.conversationType === "reportUser"
                ? "https://res.cloudinary.com/emirace/image/upload/v1659695040/images_imx0wy.png"
                : user.image
            }
          />
        )}
        <ProfileDetail>
          <Name>
            {conversation.conversationType === "reportProduct" ||
            conversation.conversationType === "reportUser" ? (
              <div style={{ color: "red" }}>Report</div>
            ) : (
              <div style={{ display: "flex", alignItems: "center" }}>
                <>{user.username}</>
                {status && <Badge1 />}
              </div>
            )}
          </Name>
          <LastMsg>
            {message.message && message.messages.length > 0
              ? message.messages[message.messages.length - 1].text
              : "No messages"}{" "}
            {count.length > 0 && <Badge>{count.length}</Badge>}
          </LastMsg>

          <div style={{ color: "grey" }}>
            {moment(conversation.updatedAt).fromNow()}
          </div>
        </ProfileDetail>
        {(conversation.productId || conversation.userId) && (
          <ProductImage src={product.image} />
        )}
      </User>
    </>
  );
}
