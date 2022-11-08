import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { RiCustomerService2Fill } from "react-icons/ri";
import { CgChevronRight } from "react-icons/cg";
import { CgChevronLeft } from "react-icons/cg";
import { CgChevronDown } from "react-icons/cg";
import { GrAttachment } from "react-icons/gr";
import { HiOutlineSearch } from "react-icons/hi";
import { v4 } from "uuid";
import { Store } from "../Store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowRight,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { socket } from "../App";
import Messages from "./Messages";
import { useLocation } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { getError } from "../utils";

const Container = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  z-index: 9;
  border-radius: 50%;
  background: ${(props) =>
    props.mode === "pagebodylight" ? "black" : "white"};
  display: flex;
  justify-content: center;
  color: black;
  cursor: pointer;
  align-items: center;
  & svg.bigicon {
    font-size: 30px;

    color: ${(props) =>
      props.mode === "pagebodylight"
        ? "var(--orange-color)"
        : "var(--orange-color)"};
  }
`;
const Box = styled.div`
  position: absolute;
  bottom: 70px;
  right: 0;
  width: 360px;
  border-radius: 0.2rem;
  height: 80vh;
  display: flex;
  flex-direction: column;
  background: white;
  box-shadow: 0 0 25px rgba(24, 24, 24, 0.4);
`;
const Top = styled.div`
  flex: 2;
  border-top-left-radius: 0.2rem;
  border-top-right-radius: 0.2rem;
  background: black;
  color: white;
`;
const Logo = styled.img`
  width: 40%;
  margin: 30px;
`;
const Name = styled.div`
  font-size: 30px;
  text-transform: capitalize;
  margin-left: 30px;
  font-weight: bold;
  color: var(--orange-color);
`;
const Bottom = styled.div`
  flex: 5;
`;
const SmallBox = styled.div`
  padding: 15px;
  border-radius: 0.2rem;
  border-top: 1px solid var(--orange-color);
  background: white;
  margin-bottom: 20px;
  box-shadow: 0 0 25px rgba(24, 24, 24, 0.4);
`;
const BoxCont = styled.div`
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  overflow-y: auto;
  height: 100%;
`;
const Head = styled.div`
  font-weight: bold;
`;
const Li = styled.div`
  margin: 5px 0;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
`;
const Button = styled.div`
  border: 1px solid black;
  border-radius: 0.2rem;
  display: flex;
  padding: 5px 10px;
  align-items: center;
  cursor: pointer;
  justify-content: center;
  & svg {
    margin-right: 10px;
  }
`;
const SearchCont = styled.div`
  border: 1px solid;
  padding: 5px 10px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  margin: 10px 0;
`;
const Input = styled.input`
  border: 0;
  padding: 0 10px;
  flex: 1;
  &:focus-visible {
    outline: none;
  }
`;
const Admin = styled.div`
  margin: 10px;
  display: flex;
  align-items: center;
  & svg {
    font-size: 25px;
  }
`;
const Image = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
`;
const InputCont = styled.div`
  display: flex;
  border-top: 1px solid;
  align-items: center;
  height: 50px;
  padding: 0 20px;
  & svg {
    margin: 0 5px;
  }
`;
const ChatArea = styled.div`
  height: calc(100% - 50px);
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const ChatCont = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;
const Guest = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;
const Cont = styled.div`
  margin-bottom: 10px;
  width: 80%;
`;
const Input1 = styled.input`
  background: none;
  border: 1px solid;
  height: 40px;
  width: 100%;
  padding: 10px;
  &:focus-visible {
    outline: none;
    border: 1px solid var(--orange-color);
  }
`;
const Label = styled.div`
  color: grey;
`;
const Button1 = styled.div`
  padding: 5px 7px;
  background: var(--orange-color);
  color: white;
  border-radius: 0.2rem;
  text-align: center;
  &:hover {
    background: var(--malon-color);
  }
`;
const Error = styled.div`
  color: var(--red-color);
`;

export default function Support() {
  const { state } = useContext(Store);
  const { mode, userInfo } = state;
  const [showSupport, setShowSupport] = useState(false);
  const [sendMessage, setSendMessage] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(userInfo);
  const [message, setMessage] = useState("");
  const [currentChat, setCurrentChat] = useState("");
  const scrollref = useRef();
  const [messages, setMessages] = useState([]);
  const [displaySupport, setDisplaySupport] = useState(true);
  const location = useLocation();

  const CurrentPath = location.pathname;

  useEffect(() => {
    if (CurrentPath === "/messages") {
      setDisplaySupport(false);
    } else {
      setDisplaySupport(true);
    }
    console.log(CurrentPath);
  }, [CurrentPath]);

  useEffect(() => {
    scrollref.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const { data } = await axios.get(
          `/api/messages/support/${currentChat._id}`
        );
        setMessages(data.messages);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat, user]);

  const storeGuestUser = (guest) => {
    const guestUsers = secureLocalStorage.getItem("guestUsers") || [];
    console.log(guestUsers);
    const exist = guestUsers.find((user) => user.email === guest.email);
    if (exist) {
      return exist;
    } else {
      secureLocalStorage.setItem("guestUsers", [...guestUsers, guest]);
      return guest;
    }
  };

  const handleOnChange = (text, input) => {
    setInput((prevState) => ({ ...prevState, [input]: text.trim() }));
  };
  const handleError = (errorMessage, input) => {
    setError((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  const handleGuest = async () => {
    if (!input.username) {
      handleError("Please enter your name", "username");
      return;
    }
    if (!input.email) {
      handleError("Please enter an email", "email");
      return;
    }
    console.log("hey");
    try {
      const id = (
        m = Math,
        d = Date,
        h = 16,
        s = (s) => m.floor(s).toString(h)
      ) =>
        s(d.now() / 1000) +
        " ".repeat(h).replace(/./g, () => s(m.random() * h));
      const currentGuest = storeGuestUser({
        username: input.username,
        email: input.email,
        guest: true,
        _id: id(),
      });
      await addConversation(currentGuest._id);
      console.log(id());
      setUser(currentGuest);
    } catch (err) {
      console.log(err.message);
    }
    console.log("hello");
  };

  const addConversation = async (id) => {
    try {
      const { data } = await axios.post(`/api/conversations/support`, {
        recieverId: id,
        type: "support",
      });
      setCurrentChat(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.length) {
      return;
    }
    const message1 = {
      text: message,
      conversationId: currentChat._id,
      senderId: user._id,
    };
    try {
      const { data } = await axios.post("api/messages/support", message1);
      setMessages([...messages, data.message]);
      const receiverId = currentChat.members.find(
        (member) => member !== user._id
      );
      socket.emit("sendMessage", {
        message: data.message,
        senderId: user._id,
        receiverId,
        isAdmin: false,
        text: message,
      });
      socket.emit("post_data", {
        userId: "Admin",
        itemId: currentChat._id,
        notifyType: "support",
        msg: "New support Message",
        link: `/messages?conversation=${currentChat._id}`,
        userImage:
          "https://res.cloudinary.com/emirace/image/upload/v1667253235/download_vms4oc.png",
      });
      setMessage("");
    } catch (err) {
      console.log(getError(err));
    }
  };

  const handleSendMessage = async () => {
    if (user) {
      await addConversation(user._id);
    }
    setSendMessage(true);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    displaySupport && (
      <Container mode={mode}>
        {!showSupport ? (
          <RiCustomerService2Fill
            className="bigicon"
            onClick={() => setShowSupport(true)}
          />
        ) : (
          <CgChevronDown
            className="bigicon"
            onClick={() => setShowSupport(false)}
          />
        )}
        {showSupport && (
          <Box>
            <Top mode={mode}>
              {!sendMessage ? (
                <>
                  <Logo src="https://res.cloudinary.com/emirace/image/upload/v1661147636/Logo_White_3_ii3edm.gif" />
                  <Name>Hello {userInfo?.username ?? "Guest"}</Name>
                </>
              ) : (
                <>
                  <Admin>
                    <CgChevronLeft onClick={() => setSendMessage(false)} />
                    <Logo src="https://res.cloudinary.com/emirace/image/upload/v1661147636/Logo_White_3_ii3edm.gif" />
                  </Admin>
                  <Admin style={{ marginLeft: "70px" }}>
                    <Image src="/images/pimage.png" />
                    <div style={{ margin: "10px 0", maxWidth: "200px" }}>
                      We will reply as soon as we can, but usually within 48hrs
                    </div>
                  </Admin>
                </>
              )}
            </Top>
            <Bottom>
              {sendMessage &&
                (user ? (
                  <ChatCont>
                    <ChatArea>
                      <div
                        style={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          padding: "20px",
                        }}
                      >
                        {messages.map((m, index) => (
                          <div ref={scrollref} key={index}>
                            <Messages
                              key={m._id}
                              own={m.sender === user._id}
                              message={m}
                              support
                            />
                          </div>
                        ))}
                      </div>
                    </ChatArea>
                    <InputCont>
                      <Input
                        value={message}
                        placeholder="Start typing..."
                        onChange={(e) => setMessage(e.target.value)}
                      />
                      <GrAttachment />
                      <FontAwesomeIcon
                        onClick={handleSubmit}
                        onKeyDown={handleKeyDown}
                        icon={faPaperPlane}
                      />
                    </InputCont>
                  </ChatCont>
                ) : (
                  <Guest>
                    <Cont>
                      <Label>Full Name</Label>
                      <Input1
                        error={error.username}
                        onFocus={() => {
                          handleError(null, "username");
                        }}
                        onChange={(e) =>
                          handleOnChange(e.target.value, "username")
                        }
                      />

                      {error.username && <Error>{error.username}</Error>}
                    </Cont>
                    <Cont>
                      <Label>Eamil</Label>
                      <Input1
                        error={error.email}
                        onFocus={() => {
                          handleError(null, "email");
                        }}
                        onChange={(e) =>
                          handleOnChange(e.target.value, "email")
                        }
                      />

                      {error.email && <Error>{error.email}</Error>}
                    </Cont>
                    <Cont>
                      <Button1 onClick={handleGuest}>Continue</Button1>
                    </Cont>
                  </Guest>
                ))}
            </Bottom>
            {!sendMessage && (
              <BoxCont>
                <div style={{ padding: "150px 10px 10px 10px" }}>
                  <SmallBox>
                    <Head>FAQ</Head>
                    <SearchCont>
                      <HiOutlineSearch />
                      <Input placeholder="Search question" />
                    </SearchCont>
                    <div>
                      <Li>
                        <span>How can i start sell </span> <CgChevronRight />
                      </Li>
                      <Li>
                        <span>How can i start sell </span> <CgChevronRight />
                      </Li>
                      <Li>
                        <span>How can i start sell </span> <CgChevronRight />
                      </Li>
                      <Li>
                        <span>How can i start sell </span> <CgChevronRight />
                      </Li>
                      <Li>
                        <span>How can i start sell </span> <CgChevronRight />
                      </Li>
                    </div>
                  </SmallBox>
                  <SmallBox>
                    <Head>Start a conversation</Head>

                    <Admin>
                      <Image src="/images/pimage.png" />
                      <div style={{ margin: "10px 0" }}>
                        We will reply as soon as we can, but usually within
                        48hrs
                      </div>
                    </Admin>
                    <Button onClick={handleSendMessage}>
                      <FontAwesomeIcon icon={faPaperPlane} /> Send us a message
                    </Button>
                  </SmallBox>
                </div>
              </BoxCont>
            )}
          </Box>
        )}
      </Container>
    )
  );
}
