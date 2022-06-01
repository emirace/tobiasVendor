import { faMessage, faSearch } from '@fortawesome/free-solid-svg-icons';
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
  width: 100%;
  height: 100%;
  border-top: 1px solid rgba(99, 91, 91, 0.2);
  padding: 5vw 7vw;
`;
const Left = styled.div`
  flex: 1;
  border-right: 1px solid rgba(99, 91, 91, 0.2);
`;
const Right = styled.div`
  flex: 2;
  padding: 10px 30px;
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
  padding: 30px 0;
`;
const RecievedChat = styled.div`
  display: flex;
  margin-right: 500px;
  justify-content: start;
  padding: 20px;
  background: var(--malon-color);
  color: #fff;
  margin-bottom: 15px;
  border-radius: 10px;
`;
const SendChat = styled.div`
  display: flex;
  justify-content: end;
  padding: 20px;
  background: var(--orange-color);
  color: #fff;
  border-radius: 10px;
  margin-bottom: 15px;
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
            <RecievedChat>hello</RecievedChat>
            <SendChat>hi, how are you doing</SendChat>
          </ChatArea>
        </Right>
      </ChatCont>
    </Container>
  );
}
