import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Store } from '../Store';

const User = styled.div`
  position: relative;
  cursor: pointer;
  padding: 15px 25px;
  display: flex;
  align-items: center;
  margin: 10px 0;
  &.active {
    background: ${(props) =>
      props.mode === 'pagebodydark' ? 'var(--dark-ev3)' : 'var(--light-ev3)'};
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
  font-size: 14px;
  width: 250px;
  overflow: hidden;
  display: inline-block;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const Badge = styled.div`
  width: 15px;
  position: absolute;
  right: 30px;
  top: 30%;
  height: 15px;
  border-radius: 50%;
  background: green;
`;

export default function Conversation({ conversation, status, currentChat }) {
  const { state } = useContext(Store);
  const { userInfo, mode } = state;
  const [user, setUser] = useState({});

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== userInfo._id);

    const getUser = async () => {
      try {
        const { data } = await axios.get(`/api/users/seller/${friendId}`, {
          header: { Authorization: `Bearer ${userInfo.token}` },
        });
        setUser(data);
      } catch (err) {
        console.log(err);
      }
    };
    getUser();
  }, [conversation, userInfo]);
  return (
    <>
      <User
        mode={mode}
        className={currentChat === conversation._id ? 'active' : ''}
      >
        <ProfileImg src={user.image} />
        <ProfileDetail>
          <Name>{user.name}</Name>
          <LastMsg>
            it is nice talking eith ice talking eith ice talking eith yo talking
            eith you
          </LastMsg>
        </ProfileDetail>
        {status && <Badge />}
      </User>
    </>
  );
}
