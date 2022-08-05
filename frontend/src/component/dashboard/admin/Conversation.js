import { faRightLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Store } from "../../../Store";
import { getError } from "../../../utils";
import LoadingBox from "../../LoadingBox";

const User = styled.div`
  position: relative;
  cursor: pointer;
  padding: 10px 25px;
  display: flex;
  align-items: center;
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
  margin: 0 10px;
`;
const ProfileDetail = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const Name = styled.div`
  color: var(--orange-color);
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
  margin-left: 10px;
  object-fit: cover;
`;

const ProfileCont = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function Conversation({ conversation, status, currentChat }) {
  const { state } = useContext(Store);
  const { userInfo, mode } = state;
  const [user, setUser] = useState([]);
  const [user2, setUser2] = useState([]);
  const [product, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/api/users/seller/${conversation.members[0]}`,
          {
            header: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        setUser(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };
    getUser();
  }, [conversation, userInfo]);
  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/api/users/seller/${conversation.members[1]}`,
          {
            header: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        setUser2(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.log(err);
      }
    };
    getUser();
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
        <ProfileCont>
          <ProfileImg src={user.image} />
          <Name>{user.username}</Name>
        </ProfileCont>
        <FontAwesomeIcon icon={faRightLeft} />
        <ProfileCont>
          <ProfileImg src={user2.image} />
          <Name>{user2.username}</Name>
        </ProfileCont>

        {(conversation.productId || conversation.userId) && (
          <>
            On <ProductImage src={product.image} />
          </>
        )}
      </User>
    </>
  );
}
