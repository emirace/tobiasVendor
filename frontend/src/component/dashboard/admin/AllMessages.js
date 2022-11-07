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
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Store } from "../../../Store";
import { getError, region } from "../../../utils";
import Messages from "../../Messages";
import Conversation from "./Conversation";

const Container = styled.div`
  flex: 4;
  min-width: 0;
  margin: 0 20px;
  margin-bottom: 20px;
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
  &::-webkit-scrollbar {
    display: none;
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
const ChatArea = styled.div`
  height: calc(100% - 70px);
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

const ProfileImg = styled.img.attrs((props) => ({
  src: props.src,
}))`
  width: 40px;
  height: 40px;
  margin: 3px;
  border-radius: 50%;
  object-fit: cover;
  object-position: top;
  margin-right: 0 15px;
`;
const ProductImg = styled.img.attrs((props) => ({
  src: props.src,
}))`
  width: 40px;
  margin: 3px;
  height: 40px;
  object-fit: cover;
  object-position: top;
  margin-right: 0 15px;
`;
const SearchUl = styled.div`
  position: absolute;
  top: 20px;
  left: 0;
  padding: 15px;
  width: 100%;
  z-index: 9;
  background: ${(props) => (props.mode === "pagebodydark" ? "black" : "white")};
`;
const SearchLi = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
`;
const SearchImg = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 10px;
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
  const searchRef = useRef();

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
        console.log(data);
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
        console.log(getError(err));
      }
    };
    getConversation();
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      try {
        dispatch({ type: "MSG_REQUEST" });
        const { data } = await axios.get(`/api/messages/${currentChat._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "MSG_SUCCESS", payload: data.messages });
      } catch (err) {
        dispatch({ type: "MSG_FAIL" });

        console.log(err);
      }
    };
    getMessages();
  }, [currentChat, userInfo]);

  const [user, setUser] = useState([]);
  const [user2, setUser2] = useState([]);
  const [loadingx, setLoadingx] = useState(false);
  const [searchResult, setSearchResult] = useState("");

  useEffect(() => {
    if (currentChat) {
      const getUser = async () => {
        try {
          setLoadingx(true);
          const { data } = await axios.get(
            `/api/users/seller/${currentChat.members[0]}`,
            {
              header: { Authorization: `Bearer ${userInfo.token}` },
            }
          );
          setUser(data);
          setLoadingx(false);
        } catch (err) {
          setLoadingx(false);
          console.log(err);
        }
      };
      getUser();
    }
  }, [currentChat, userInfo]);
  useEffect(() => {
    if (currentChat) {
      const getUser = async () => {
        try {
          setLoadingx(true);
          const { data } = await axios.get(
            `/api/users/seller/${currentChat.members[1]}`,
            {
              header: { Authorization: `Bearer ${userInfo.token}` },
            }
          );
          setUser2(data);
          setLoadingx(false);
        } catch (err) {
          setLoadingx(false);
          console.log(err);
        }
      };
      getUser();
    }
  }, [currentChat, userInfo]);

  const [product, setProduct] = useState([]);
  useEffect(() => {
    const getproduct = async () => {
      try {
        setLoadingx(true);
        if (currentChat.productId) {
          const { data } = await axios.get(
            `/api/products/${currentChat.productId}`
          );
          setProduct(data);
          setLoadingx(false);
        } else if (currentChat.userId) {
          console.log(currentChat.userId);
          const { data } = await axios.get(
            `/api/users/seller/${currentChat.userId}`,
            {
              header: { Authorization: `Bearer ${userInfo.token}` },
            }
          );
          setProduct(data);
          setLoadingx(false);
        }
      } catch (err) {
        setLoadingx(false);
        console.log(getError(err));
      }
    };
    getproduct();
  }, [currentChat]);

  const closeModel = (e) => {
    if (searchRef !== e.target) {
      setSearchResult("");
    }
  };

  const handleSearchInput = async (e) => {
    e.preventDefault();
    if (e.target.value.length > 2) {
      const { data } = await axios.get(
        `/api/users/${region()}/search?q=${e.target.value}`
      );
      setSearchResult(data);
    }
  };

  return (
    <Container mode={mode} onClick={closeModel}>
      <Left mode={mode}>
        <TopBar>
          <div style={{ position: "relative" }}>
            <FontAwesomeIcon icon={faSearch} />
            <Search
              placeholder="Search..."
              mode={mode}
              onChange={handleSearchInput}
            />

            {searchResult.length > 0 && (
              <SearchUl mode={mode} ref={searchRef}>
                {searchResult.map(
                  (u) =>
                    u._id !== userInfo._id && (
                      <SearchLi key={u._id}>
                        <SearchImg src={u.image} alt="img" />
                        <div>{u.username}</div>
                      </SearchLi>
                    )
                )}
              </SearchUl>
            )}
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
            {!loadingx && (
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Link
                  to={`/seller/${user2._id}`}
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    paddingRight: "10px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <ProfileImg src={user2.image} />
                    <div>{user2.username}</div>
                  </div>
                </Link>
                <Link
                  to={`/seller/${user._id}`}
                  style={{
                    display: "flex",
                    justifyContent: "end",
                    paddingRight: "10px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <ProfileImg src={user.image} />
                    <div>{user.username}</div>
                  </div>
                </Link>
              </div>
            )}
            {currentChat.conversationType !== "user" && (
              <Link
                to={
                  currentChat.conversationType === "reportUser"
                    ? `/seller/${product._id}`
                    : `/product/${product.slug}`
                }
                style={{
                  display: "flex",
                  justifyContent: "center",
                  borderBottom: "1px solid grey",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <ProductImg src={product.image} />
                  <div>{product.name}</div>
                </div>
              </Link>
            )}
            <ChatArea>
              <div style={{ height: "100%" }}>
                {messages.map((m, index) => (
                  <div ref={scrollref} key={index}>
                    <Messages
                      key={m._id}
                      own={m.sender === user._id}
                      message={m}
                    />
                  </div>
                ))}
              </div>
            </ChatArea>
          </ChatCont2>
        ) : (
          <NoConversation>Select a conversation to start a chat</NoConversation>
        )}
      </Right>
    </Container>
  );
}
