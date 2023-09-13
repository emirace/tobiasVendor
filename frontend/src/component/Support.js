import React, {
  useContext,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { RiCustomerService2Fill } from 'react-icons/ri';
import { CgChevronLeft, CgChevronRight } from 'react-icons/cg';
import { CgChevronDown } from 'react-icons/cg';
import { GrAttachment } from 'react-icons/gr';
import { HiOutlineSearch } from 'react-icons/hi';
import { v4 } from 'uuid';
import { Store } from '../Store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { socket } from '../App';
import Messages from './Messages';
import { Link, useLocation } from 'react-router-dom';
import secureLocalStorage from 'react-secure-storage';
import { compressImageUpload, getError, region } from '../utils';
import OneNewMessage from './OneNewMessage';
import { resizeImage } from './ImageUploader';

const Container = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  z-index: 100;
  border-radius: 50%;
  background: ${(props) =>
    props.mode === 'pagebodylight' ? 'black' : 'white'};
  display: flex;
  justify-content: center;
  color: black;
  cursor: pointer;
  align-items: center;
  & svg.bigicon {
    font-size: 30px;

    color: ${(props) =>
      props.mode === 'pagebodylight'
        ? 'var(--orange-color)'
        : 'var(--orange-color)'};
  }
  @media (max-width: 992px) {
    bottom: 65px;
  }
`;
const Box = styled.div`
  z-index: 10;
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
  @media (max-width: 992px) {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: auto;
    border-radius: 0;
    width: auto;
  }
`;
const CloseButton = styled.div`
  display: none;
  position: fixed;
  right: 20px;
  top: 10px;

  border-radius: 50%;
  @media (max-width: 992px) {
    display: block;
  }
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
  height: 100px;
  @media (max-width: 992px) {
    /* height: auto; */
  }
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
  &:hover {
    color: var(--orange-color);
  }
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
const ImageFile = styled.img`
  width: 100%;
  max-height: 100%;
  object-fit: cover;
`;
const Badge = styled.div`
  width: 15px;
  height: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 11px;
  background: var(--orange-color);
  color: white;
  border-radius: 50%;
  margin-left: 10px;
`;
const reducer = (state, action) => {
  switch (action.type) {
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true };
    case 'UPLOAD_SUCCESS':
      return { ...state, loadingUpload: false, errorUpload: '' };
    case 'UPLOAD_FAIL':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: action.payload,
      };
    default:
      return state;
  }
};

export default function Support() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo, notifications } = state;
  const [showSupport, setShowSupport] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState(userInfo);
  const [message, setMessage] = useState('');
  const [currentChat, setCurrentChat] = useState('');
  const scrollref = useRef();
  const [messages, setMessages] = useState([]);
  const [displaySupport, setDisplaySupport] = useState(true);
  const [arrivalMessage, setArrivalMessage] = useState('');
  const [image, setImage] = useState('');
  const location = useLocation();
  const [uploadImage, setUploadImage] = useState(false);
  const [articles, setArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [{ loadingUpload }, dispatch] = useReducer(reducer, {
    loadingUpload: false,
  });

  const CurrentPath = location.pathname;
  console.log('notifications', notifications);
  const supportNotification = notifications.filter(
    (x) => x.notifyType === 'supportReceived' && x.read === false
  );

  const [sendMessage, setSendMessage] = useState(false);

  useEffect(() => {
    const exist = secureLocalStorage.getItem('guestUser');
    if (exist && !userInfo) {
      socket.emit('onlogin', exist);
      setUser(exist);
    }
  }, [user, userInfo]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data } = await axios.get(`/api/articles?search=${searchQuery}`);
        setArticles(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchArticles();
  }, [searchQuery]);

  useEffect(() => {
    if (!userInfo && user) {
      socket.emit('initial_data', { userId: user._id });
      socket.on('get_data', (notification) =>
        ctxDispatch({ type: 'UPDATE_NOTIFICATIONS', payload: notification })
      );
      socket.on('change_data', () =>
        socket.emit('initial_data', { userId: user._id })
      );
    }
  }, [user, userInfo]);

  useEffect(() => {
    if (CurrentPath === '/messages') {
      setDisplaySupport(false);
    } else {
      setDisplaySupport(true);
    }
    console.log(CurrentPath);
  }, [CurrentPath]);

  useEffect(() => {
    socket.on('getMessage', (data) => {
      console.log(data);
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        message: data.message,
      });
    });
  }, [userInfo]);

  useEffect(() => {
    if (arrivalMessage && currentChat) {
      if (currentChat._id === arrivalMessage.message.conversationId) {
        console.log(arrivalMessage);

        setMessages([...messages, arrivalMessage.message]);
      }
    }
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    scrollref.current?.scrollIntoView({ behavior: 'smooth' });
    console.log(scrollref.current);
  }, [messages, showSupport]);

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

  const handleOnChange = (text, input) => {
    setInput((prevState) => ({ ...prevState, [input]: text.trim() }));
  };
  const handleError = (errorMessage, input) => {
    setError((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  const handleGuest = async () => {
    if (!input.username) {
      handleError('Please enter your name', 'username');
      return;
    }
    if (!input.email) {
      handleError('Please enter an email', 'email');
      return;
    }
    try {
      const { data: currentGuest } = await axios.post(
        `/api/guestusers/${region()}`,
        {
          username: input.username,
          email: input.email,
          guest: true,
        }
      );
      setUser(currentGuest);
      secureLocalStorage.setItem('guestUser', currentGuest);
      socket.emit('onlogin', currentGuest);
      await addConversation(currentGuest);
    } catch (err) {
      console.log(err.message);
    }
  };

  const addConversation = async (user) => {
    console.log(userInfo);
    try {
      const { data } = await axios.post(`/api/conversations/support`, {
        recieverId: user._id,
        type: 'support',
        guestEmail: user.email,
        guest: userInfo ? false : true,
      });
      setCurrentChat(data);
      socket.emit('remove_notifications', data._id);
    } catch (err) {
      console.log(err);
    }
  };

  const [sendingMessage, setSendingMessage] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.length) {
      ctxDispatch({
        type: 'SHOW_TOAST',
        payload: {
          message: 'Enter a message to send',
          showStatus: true,
          state1: 'visible1 error',
        },
      });
      return;
    }
    const message1 = {
      text: message,
      conversationId: currentChat._id,
      senderId: user._id,
      image,
    };
    try {
      setSendingMessage(true);
      const { data } = await axios.post('api/messages/support', message1);
      setMessages([...messages, data.message]);
      console.log('heeellllooo');
      const receiverId = currentChat.members.find(
        (member) => member !== user._id
      );
      console.log(receiverId, currentChat, user);
      socket.emit('sendSupport', {
        message: data.message,
        senderId: user._id,
        receiverId,
        image,
        isAdmin: false,
        text: message,
      });
      socket.emit('post_data', {
        userId: 'Admin',
        itemId: currentChat._id,
        notifyType: 'supportRespond',
        msg: 'New support Message',
        mobile: { path: 'Conversation', id: '' },
        link: `/messages?conversation=${currentChat._id}`,
        userImage:
          'https://res.cloudinary.com/emirace/image/upload/v1667253235/download_vms4oc.png',
      });
      setMessage('');
      setImage('');
      socket.emit('remove_notifications', currentChat?._id);
      setSendingMessage(false);
    } catch (err) {
      setSendingMessage(false);
      console.log(getError(err));
    }
  };

  const handleSendMessage = async () => {
    if (user) {
      await addConversation(user);
    }
    setSendMessage(true);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !sendingMessage) {
      console.log('keypress');
      handleSubmit(e);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const imageUrl = await compressImageUpload(file, 1024, userInfo.token);
    setImage(imageUrl);
  };

  if (CurrentPath === '/brand') return;
  var pattern = /^\/brandpage\/[A-Z]$/;
  if (pattern.test(CurrentPath)) return;

  const handleSearch = (e) => {
    var key = e.keyCode || e.which;
    if (key === 13) {
      e.target.blur();
    }
  };

  return (
    displaySupport && (
      <Container mode={mode}>
        {!showSupport ? (
          <RiCustomerService2Fill
            className="bigicon"
            onClick={() => {
              setShowSupport(true);
            }}
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
                  <Name>Hello {user?.username ?? 'Guest'}</Name>
                </>
              ) : (
                <>
                  <Admin>
                    <CgChevronLeft onClick={() => setSendMessage(false)} />
                    <Logo src="https://res.cloudinary.com/emirace/image/upload/v1661147636/Logo_White_3_ii3edm.gif" />
                  </Admin>
                  <Admin style={{ marginLeft: '30px' }}>
                    <Image src="https://res.cloudinary.com/emirace/image/upload/v1690227815/IMG-20230723-WA0003_dza4wz.jpg" />
                    <Image
                      style={{ marginLeft: '-30px' }}
                      src="https://res.cloudinary.com/emirace/image/upload/v1690227844/IMG-20230723-WA0002_o2zhha.jpg"
                    />
                    <Image
                      style={{ marginLeft: '-30px' }}
                      src="https://res.cloudinary.com/emirace/image/upload/v1690227794/IMG-20230723-WA0004_c1nrox.jpg"
                    />
                    <div
                      style={{
                        margin: '10px 0 ',
                        maxWidth: '200px',
                        fontSize: '13px',
                      }}
                    >
                      We will reply as soon as we can, but usually within 2hrs
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
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          padding: '20px',
                        }}
                      >
                        {image ? (
                          <div>
                            <ImageFile src={image} alt="file" />
                          </div>
                        ) : (
                          messages.map((m, index) => (
                            <div ref={scrollref} key={index}>
                              <Messages
                                key={m._id}
                                own={m.sender === user._id}
                                message={m}
                                support
                              />
                            </div>
                          ))
                        )}
                      </div>
                    </ChatArea>
                    <InputCont>
                      <Input
                        value={message}
                        placeholder="Start typing..."
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />
                      <label htmlFor="addimage">
                        <GrAttachment />
                      </label>
                      <input
                        type="file"
                        id="addimage"
                        style={{ display: 'none' }}
                        onChange={handleImageUpload}
                      />
                      {console.log('sendingMessage', sendingMessage)}
                      <FontAwesomeIcon
                        onClick={(e) =>
                          sendingMessage ? null : handleSubmit(e)
                        }
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
                          handleError(null, 'username');
                        }}
                        onChange={(e) =>
                          handleOnChange(e.target.value, 'username')
                        }
                      />

                      {error.username && <Error>{error.username}</Error>}
                    </Cont>
                    <Cont>
                      <Label>Eamil</Label>
                      <Input1
                        error={error.email}
                        onFocus={() => {
                          handleError(null, 'email');
                        }}
                        onChange={(e) =>
                          handleOnChange(
                            e.target.value.trim().toLowerCase(),
                            'email'
                          )
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
                <div style={{ padding: '150px 10px 10px 10px' }}>
                  <SmallBox>
                    <Head>FAQ</Head>
                    <SearchCont>
                      <HiOutlineSearch />
                      <Input
                        placeholder="Search question"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        type="search"
                        value={searchQuery}
                        onKeyDown={handleSearch}
                      />
                    </SearchCont>
                    <div>
                      {articles.slice(0, 5).map((article) => (
                        <Link
                          to={`/article/${article._id}`}
                          onClick={() => {
                            setShowSupport(false);
                            setSearchQuery('');
                          }}
                        >
                          <Li>
                            <span>{article.question} </span> <CgChevronRight />
                          </Li>
                        </Link>
                      ))}
                    </div>
                  </SmallBox>
                  <SmallBox>
                    <Head>Start a conversation</Head>

                    <Admin>
                      <Image src="https://res.cloudinary.com/emirace/image/upload/v1690227747/IMG-20230723-WA0000_eokyt8.jpg" />
                      <div style={{ margin: '10px 0' }}>
                        We will reply as soon as we can, but usually within
                        48hrs
                      </div>
                    </Admin>
                    <Button onClick={handleSendMessage}>
                      {supportNotification.length ? (
                        <>
                          <span>New Message Received</span>{' '}
                          <Badge>{supportNotification.length}</Badge>
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faPaperPlane} />
                          <span> Send us a message</span>
                        </>
                      )}
                    </Button>
                  </SmallBox>
                </div>
              </BoxCont>
            )}
            <CloseButton onClick={() => setShowSupport(false)}>
              {console.log(showSupport)}
              <CgChevronDown className="bigicon" />
            </CloseButton>
          </Box>
        )}
        <OneNewMessage notification={supportNotification.length} />
      </Container>
    )
  );
}
