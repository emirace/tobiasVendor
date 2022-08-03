import {
  faMessage,
  faSearch,
  faShield,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { Store } from "../../../Store";
import { getError } from "../../../utils";
import Conversation from "../../Conversation";
import Messages from "../../Messages";

const Container = styled.div`
  flex: 4;
  min-width: 0;
  margin: 0 20px;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  display: flex;
  gap: 10px;
`;

const Left = styled.div`
  flex: 1;
  padding: 10px;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev2)"};
  @media (max-width: 992px) {
    margin: 0;
    display: ${(props) => (props.showLeft ? "" : "none")};
  }
`;
const Right = styled.div`
  flex: 2;
  padding: 0 10px;
  border-radius: 0.2rem;
  padding: 10px 30px;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev2)"};
  @media (max-width: 992px) {
    margin: 5px;
    padding: 10px;
    display: ${(props) => (props.showLeft ? "none" : "")};
  }
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

const Search = styled.input`
  height: 40px;
  background: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--black-color)"
      : "var(--white-color)"};
  color: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--white-color)"
      : "var(--black-color)"};
  border: 0;
  border-radius: 0.2rem;
  padding: 0 10px;
  &:focus-visible {
    outline: 0;
  }
  &::placeholder {
    padding-left: 10px;
    color: ${(props) =>
      props.mode === "pagebodydark" ? "var(--light-ev4)" : "var(--dark-ev4)"};
  }
`;

const Conserv = styled.div`
  overflow: auto;
  height: calc(100% - 50px);
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ChatCont2 = styled.div`
  overflow-y: auto;
  height: 100%;
`;
const NoConversation = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  color: rgba(99, 91, 91, 0.2);
  text-align: center;
`;
const ChatArea = styled.div`
  height: calc(100% - 130px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  justify-content: end;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const PrivacyInfo = styled.div`
  display: flex;
  height: 70px;
  padding: 10px 50px;
  align-items: center;
  & svg {
    color: grey;
    font-size: 30px;
    margin: 10px;
  }
`;

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, conversations: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "MSG_REQUEST":
      return { ...state, loadingMessages: true };
    case "MSG_SUCCESS":
      return {
        ...state,
        messages: action.payload,
        loadingMessages: false,
      };
    case "MSG_FAIL":
      return { ...state, loadingMessages: false, error: action.payload };
    default:
      return state;
  }
};
export default function AllMessages() {
  const { state } = useContext(Store);
  const { mode, userInfo } = state;

  const [{ loading, error, conversations, messages }, dispatch] = useReducer(
    reducer,
    {
      loading: true,
      error: "",
      conversations: [],
      messages: [],
    }
  );
  const [currentChat, setCurrentChat] = useState();
  const [showLeft, setShowLeft] = useState(false);
  const scrollref = useRef();
  useEffect(() => {
    const getConversation = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const { data } = await axios.get("/api/conversations", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
        console.log(getError(err));
      }
    };
    getConversation();
  }, []);

  return (
    <Container mode={mode}>
      <Left mode={mode}>
        <TopBar>
          <div>
            <FontAwesomeIcon icon={faSearch} />
            <Search placeholder="Search..." mode={mode} />
          </div>
          <div>
            <FontAwesomeIcon icon={faMessage} />
          </div>
        </TopBar>
        <Conserv>
          {conversations.length < 1
            ? "No Conversation"
            : conversations.map((c, index) => (
                <div
                  onClick={() => {
                    setShowLeft(false);
                    setCurrentChat(c);
                  }}
                  key={index}
                >
                  <Conversation
                    conversation={c}
                    currentChat={currentChat && currentChat._id}
                  />
                </div>
              ))}
        </Conserv>
      </Left>
      <Right mode={mode}>
        {currentChat ? (
          <ChatCont2>
            <PrivacyInfo>
              <FontAwesomeIcon icon={faShield} />
              <div style={{ color: "grey", textAlign: "center" }}>
                Please leave all information that will help us resolve your
                query. Please include an order number if your report is related
                to an order you purchased from this seller, or you can go to
                your purchase history and report the related item directly from
                the report tab on the item page.
              </div>
            </PrivacyInfo>
            <ChatArea>
              {messages.map((m, index) => (
                <div ref={scrollref} key={index}>
                  <Messages
                    key={m._id}
                    own={m.sender === userInfo._id}
                    message={m}
                  />
                </div>
              ))}
            </ChatArea>
          </ChatCont2>
        ) : (
          <NoConversation>Select a conversation to start a chat</NoConversation>
        )}
      </Right>
    </Container>
  );
}
