import { faMessage, faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
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
`;
const Left = styled.div`
  flex: 1;
  border-right: 1px solid rgba(99, 91, 91, 0.2);
`;
const Right = styled.div`
  flex: 2;
`;

const TopBar = styled.div`
  display: flex;
  padding: 15px 25px;
  justify-content: space-between;
  & svg {
    padding-right: 10px;
  }
`;

const User = styled.div`
  padding: 15px 25px;
`;

export default function ChatScreen() {
  const { state } = useContext(Store);
  const { mode } = state;
  const backMode = (mode) => {
    if (mode === 'pagebodydark') {
      mode = false;
    } else {
      mode = true;
    }
    return mode;
  };
  const backgroundMode = backMode(mode);

  return (
    <Container className={mode}>
      <Navbar />
      <ChatCont>
        <Left>
          <TopBar>
            <div>
              <FontAwesomeIcon icon={faSearch} />
              Search...
            </div>
            <div>
              <FontAwesomeIcon icon={faMessage} />
            </div>
          </TopBar>
          <User>User Name</User>
          <User>User Name</User>
          <User>User Name</User>
          <User>User Name</User>
        </Left>
        <Right>Right</Right>
      </ChatCont>
    </Container>
  );
}
