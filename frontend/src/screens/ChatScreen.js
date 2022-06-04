import {
  faMessage,
  faPaperPlane,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useEffect, useContext, useState, useReducer } from 'react';
import styled from 'styled-components';
import Navbar from '../component/Navbar';
import { Store } from '../Store';
import Conversation from '../component/Conversation';
import Messages from '../component/Messages';

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
const NoConversation = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  color: rgba(99, 91, 91, 0.2);
  text-align: center;
`;

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, conversations: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'MSG_REQUEST':
      return { ...state, loadingMessages: true };
    case 'MSG_SUCCESS':
      return { ...state, messages: action.payload, loadingMessages: false };
    case 'MSG_FAIL':
      return { ...state, loadingMessages: false, error: action.payload };
    default:
      return state;
  }
};

export default function ChatScreen() {
  const { state } = useContext(Store);
  const { mode, userInfo } = state;
  const [menu, setMymenu] = useState(false);
  const [currentChat, setCurrentChat] = useState(null);
  const [modelRef1, setmodelRef1] = useState();
  const backMode = (mode) => {
    if (mode === 'pagebodydark') {
      mode = false;
    } else {
      mode = true;
    }
    return mode;
  };
  const backgroundMode = (mode1) => {
    setmodelRef1(mode1);
  };
  const closeModel = (e) => {
    if (modelRef1 !== e.target) {
      setMymenu(false);
    } else {
      setMymenu(!menu);
    }
  };
  const [{ loading, error, conversations, messages }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: '',
      conversations: [],
      messages: [],
    }
  );

  useEffect(() => {
    const getConversation = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/conversations/user`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data.conversations });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: err });
        console.log(err);
      }
    };
    getConversation();
  }, [userInfo]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        dispatch({ type: 'MSG_REQUEST' });
        const { data } = await axios.get(`/api/messages/${currentChat._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'MSG_SUCCESS', oayload: data.messages });
      } catch (err) {
        dispatch({ type: 'MSG_FAIL' });

        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  return (
    <Container className={mode} onClick={closeModel}>
      <Navbar menu={menu} setmodelRef1={backgroundMode} />
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
          {conversations.length < 1
            ? 'no conversation'
            : conversations.map((c) => (
                <div onClick={() => setCurrentChat(c)} key={c._id}>
                  <Conversation conversation={c} />
                </div>
              ))}
        </Left>
        <Right>
          {currentChat ? (
            <>
              <RightTopbar>
                <LeftBar>
                  <SmallImg src="/images/pro.jpg" />
                  <SmallName>John Doe</SmallName>
                </LeftBar>
                <RightBar>Report</RightBar>
              </RightTopbar>
              <ChatArea>
                <Messages />
              </ChatArea>
              <Message>
                <TextInput placeholder="Write a message" />
                <FontAwesomeIcon icon={faPaperPlane} />
              </Message>
            </>
          ) : (
            <NoConversation>
              Select a conversation to start a chat{' '}
            </NoConversation>
          )}
        </Right>
      </ChatCont>
    </Container>
  );
}
