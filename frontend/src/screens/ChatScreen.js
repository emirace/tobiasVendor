import {
  faMessage,
  faPaperPlane,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import Navbar from '../component/Navbar';
import { Store } from '../Store';

const Container = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 8;
`;
const ChatCont = styled.div`
  display: flex;
  box-shadow: 0 1px 10px rgba(225, 225, 225, 0.2);
  margin: 0 7vw;
  border-radius: 5px;
`;
const Left = styled.div`
  flex: 1;
  border-right: 1px solid rgba(99, 91, 91, 0.2);
  border-left: 1px solid rgba(99, 91, 91, 0.2);
`;
const Right = styled.div`
  flex: 2;
  padding: 10px 30px;
  border-right: 1px solid rgba(99, 91, 91, 0.2);
`;

const TopBar = styled.div`
  display: flex;
  padding: 15px 25px;
  justify-content: space-between;
  & svg {
    position: relative;
    padding-right: 10px;
  }
`;

const Search = styled.input.attrs((props) => ({
  placeholder: props.placeholder,
}))`
  background: black;
  color: white;
  border: 0;
  border-radius: 25rem;
  padding: 0 10px;
  &:focus-visible {
    outline: 0;
  }
  &::placeholder {
    padding-left: 10px;
    color: white;
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

const User = styled.div`
  padding: 15px 25px;
  display: flex;
  align-items: center;
  &.active {
    border-bottom: 2px solid var(--orange-color);
  }
`;

const RightTopbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const LeftBar = styled.div`
  display: flex;
  align-items: center;
`;
const SmallImg = styled.img.attrs((props) => ({
  src: props.src,
}))`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  object-position: top;
  margin-right: 15px;
`;
const SmallName = styled.div`
  text-transform: capitalize;
`;
const RightBar = styled.div`
  text-transform: capitalize;
`;
const ChatArea = styled.div`
  margin-top: 20px;
  height: 340px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const RecievedChat = styled.div`
  display: flex;
  justify-content: start;
  margin-bottom: 15px;
`;
const SendChat = styled.div`
  display: flex;
  justify-content: end;
  margin-bottom: 15px;
`;
const InlineR = styled.div`
  display: inline-block;
  padding: 20px;
  background: var(--malon-color);
  color: #fff;
  border-radius: 10px;
`;
const InlineS = styled.div`
  display: inline-block;
  padding: 20px;
  background: var(--orange-color);
  color: #fff;
  border-radius: 10px;
`;
const Message = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  & svg {
    font-size: 30px;
    margin-left: 20px;
    cursor: pointer;
  }
`;
const TextInput = styled.input`
  height: 100%;
  width: 100%;
  background: #000;
  border: 0;
  color: white;
  padding: 20px;
  &:focus-visible {
    outline: 0;
  }

  &::placeholder {
    padding: 20px;
    color: white;
  }
`;

export default function ChatScreen() {
  const { state } = useContext(Store);
  const { mode } = state;
  const [menu, setMymenu] = useState(false);
  const [modelRef1, setmodelRef1] = useState();
  const backMode = (mode) => {
    if (mode === 'pagebodydark') {
      mode = false;
    } else {
      mode = true;
    }
    return mode;
  };
  const backgroundMode = backMode(mode);
  const closeModel = (e) => {
    if (modelRef1 !== e.target) {
      setMymenu(false);
    } else {
      setMymenu(!menu);
    }
  };

  return (
    <Container className={mode} onClick={closeModel}>
      <Navbar menu={menu} setmodelRef1={setmodelRef1} />
      <ChatCont>
        <Left>
          <TopBar>
            <div>
              <FontAwesomeIcon icon={faSearch} />
              <Search placeholder="Search..." />
            </div>
            <div>
              <FontAwesomeIcon icon={faMessage} />
            </div>
          </TopBar>
          <User className="active">
            <ProfileImg src={'/images/pro.jpg'} />
            <ProfileDetail>
              <Name>John Doe</Name>
              <LastMsg>
                it is nice talking eith ice talking eith ice talking eith yo
                talking eith you
              </LastMsg>
            </ProfileDetail>
          </User>
          <User>
            <ProfileImg src={'/images/pro.jpg'} />
            <ProfileDetail>
              <Name>John Doe</Name>
              <LastMsg>
                it is nice talking eith ice talking eith ice talking eith yo
                talking eith you
              </LastMsg>
            </ProfileDetail>
          </User>
          <User>
            <ProfileImg src={'/images/pro.jpg'} />
            <ProfileDetail>
              <Name>John Doe</Name>
              <LastMsg>
                it is nice talking eith ice talking eith ice talking eith yo
                talking eith you
              </LastMsg>
            </ProfileDetail>
          </User>
        </Left>
        <Right>
          <RightTopbar>
            <LeftBar>
              <SmallImg src="/images/pro.jpg" />
              <SmallName>John Doe</SmallName>
            </LeftBar>
            <RightBar>Report</RightBar>
          </RightTopbar>
          <ChatArea>
            <RecievedChat>
              <InlineR>hello</InlineR>
            </RecievedChat>
            <RecievedChat>
              <InlineR>hello</InlineR>
            </RecievedChat>
            <SendChat>
              <InlineS>hi, how are you doing</InlineS>
            </SendChat>
            <RecievedChat>
              <InlineR>hello</InlineR>
            </RecievedChat>
            <SendChat>
              <InlineS>hi, how are you doing</InlineS>
            </SendChat>
          </ChatArea>
          <Message>
            <TextInput placeholder="Write a message" />
            <FontAwesomeIcon icon={faPaperPlane} />
          </Message>
        </Right>
      </ChatCont>
    </Container>
  );
}
