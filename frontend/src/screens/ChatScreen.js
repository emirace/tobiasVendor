import {
  faAngleLeft,
  faImage,
  faMessage,
  faPaperPlane,
  faSearch,
  faShield,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, {
  useEffect,
  useContext,
  useState,
  useReducer,
  useRef,
} from "react";
import styled from "styled-components";
import Navbar from "../component/Navbar";
import { Store } from "../Store";
import Conversation from "../component/Conversation";
import Messages from "../component/Messages";
import { Link, useLocation } from "react-router-dom";
import { getError, region } from "../utils";
import ReportConversation from "../component/Report/ReportConversation";
import Report from "../component/Report";
import ModelLogin from "../component/ModelLogin";
import CropImage from "../component/cropImage/CropImage";
import { socket } from "../App";
import LoadingBox from "../component/LoadingBox";
import useWindowDimensions from "../component/Dimension";
import { resizeImage } from "../component/ImageUploader";

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
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  margin: 10px 10px 0 10px;
  border-radius: 0.2rem;
  height: calc(100% - 172px);
  @media (max-width: 992px) {
    margin: 5px;
    height: calc(100% - 132px);
  }
`;
const Left = styled.div`
  flex: 1;
  margin: 10px 20px 0 20px;
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
  margin: 10px 20px 0 20px;
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
const ChatCont2 = styled.div`
  overflow-y: auto;
  height: 100%;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none;
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

const Search = styled.input.attrs((props) => ({
  placeholder: props.placeholder,
}))`
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

const ChatArea = styled.div`
  height: calc(100% - 210px);
  overflow-y: auto;
  &.support {
    height: calc(100% - 75px);
  }
  &.messages {
    height: calc(100% - 140px);
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  }
  @media (max-width: 992px) {
    height: calc(100% - 190px);
  }
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
  @media (max-width: 992px) {
    height: 40px;
    & svg {
      font-size: 20px;
    }
  }
`;
const TextInput = styled.input`
  height: 100%;
  width: 100%;
  background: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--black-color)"
      : "var(--white-color)"};
  border-radius: 0.2rem;
  border: 1px solid
    ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev3)" : "var(--light-ev3)"};
  color: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--white-color)"
      : "var(--black-color)"};

  padding: 20px;
  &:focus-visible {
    outline: 1px solid var(--orange-color);
  }

  &::placeholder {
    padding: 20px;
    color: ${(props) =>
      props.mode === "pagebodydark"
        ? "var(--white-color)"
        : "var(--black-color)"};
  }
  @media (max-width: 992px) {
    &::placeholder {
      padding: 10px;
    }
  }
`;

const Textarea = styled.textarea`
  height: 100%;
  width: 100%;
  background: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--black-color)"
      : "var(--white-color)"};
  border-radius: 0.2rem;
  border: 1px solid
    ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev3)" : "var(--light-ev3)"};
  color: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--white-color)"
      : "var(--black-color)"};
  padding: 10px;
  resize: none;
  &:focus-visible {
    outline: 1px solid var(--orange-color);
  }
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

const Conserv = styled.div`
  overflow: auto;
  height: calc(100% - 98px);
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  }
`;

const Tab = styled.div`
  display: flex;
  justify-content: space-around;
  padding: 0 10px;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev3)" : "var(--light-ev3)"};
`;
const TabItem = styled.div`
  cursor: pointer;
  padding: 10px 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    color: var(--orange-color);
  }
  &.active {
    background: ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev2)"};
  }
  @media (max-width: 992px) {
    padding: 10px 20px;
  }
`;
const Back = styled.div`
  display: none;
  padding: 5px;
  justify-content: center;
  align-items: center;
  width: 55px;
  & svg {
    font-size: 15px;
    margin-right: 5px;
  }
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  @media (max-width: 992px) {
    display: flex;
  }
`;

const BackUser = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PrivacyInfo = styled.div`
  display: flex;
  height: 50px;
  padding: 5px 50px;
  align-items: center;
  & svg {
    color: grey;
    font-size: 30px;
    margin: 5px;
  }
  @media (max-width: 992px) {
    opacity: 0.6;
    padding: 5px 0;
    & svg {
      font-size: 20px;
    }
    & div {
      line-height: 11px !important;
      font-size: 11px;
    }
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

const Image = styled.img`
  height: 100%;
`;

const UploadImageModal = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  padding: 30px;
  @media (max-width: 992px) {
    height: calc(100% - 55px);
    padding-bottom: 5px;
  }
`;

const Remove = styled.div`
  background: var(--malon-color);
  padding: 5px 7px;
  position: absolute;
  bottom: 0;
  right: 0;
  color: white;
  border-radius: 0.2rem;
`;

const Imagecont = styled.div`
  position: relative;
  height: calc(100% - 55px);
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
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true };
    case "UPLOAD_SUCCESS":
      return { ...state, loadingUpload: false, errorUpload: "" };
    case "UPLOAD_FAIL":
      return {
        ...state,
        loadingUpload: false,
        errorUpload: action.payload,
      };
    default:
      return state;
  }
};

export default function ChatScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo, notifications } = state;
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const currentCon = sp.get("conversation");
  const [menu, setMymenu] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [currentChat, setCurrentChat] = useState("");
  const [currentReply, setCurrentReply] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState("");
  const [modelRef1, setmodelRef1] = useState();
  const [modelRef2, setmodelRef2] = useState();
  const [onlineUser, setOnlineUser] = useState([]);
  const scrollref = useRef();
  const [reports, setReports] = useState([]);
  const [searchResult, setSearchResult] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [image, setImage] = useState("");
  const [showUploadingImage, setShowUploadingImage] = useState(false);
  const searchRef = useRef();

  const supportNotification = notifications.filter(
    (x) => x.notifyType === "support" && x.read === false
  );

  const reportNotification = notifications.filter(
    (x) => x.notifyType === "report" && x.read === false
  );

  const backMode = (mode) => {
    if (mode === "pagebodydark") {
      mode = false;
    } else {
      mode = true;
    }
    return mode;
  };
  const backgroundMode = (mode1) => {
    setmodelRef1(mode1);
  };
  const changeRef2 = (res) => {
    setmodelRef2(res);
  };
  const closeModel = (e) => {
    if (modelRef1 !== e.target) {
      setMymenu(false);
    } else {
      setMymenu(!menu);
    }
    if (modelRef2 !== e.target) {
      setShowNotification(false);
    } else {
      setShowNotification(!menu);
    }
    if (searchRef !== e.target) {
      setSearchResult("");
    }
  };

  const [{ loading, error, loadingUpload, conversations, messages }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
      conversations: [],
      messages: [],
    });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = "15px";

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, []);

  useEffect(() => {
    socket.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        message: data.message,
      });
      setRefresh(!refresh);
    });
  }, [userInfo]);

  const [arrivalReport, setArrivalReport] = useState();

  useEffect(() => {
    socket.on("getReport", (data) => {
      setArrivalReport(data.report);
    });
  }, []);

  useEffect(() => {
    if (arrivalReport) {
      setReports([...reports, arrivalReport]);
    }
  }, [arrivalReport]);

  const [testing, setTesting] = useState("");
  useEffect(() => {
    if (
      arrivalMessage &&
      currentChat &&
      currentChat?.members.includes(arrivalMessage.sender)
    ) {
      if (currentChat._id === arrivalMessage.message.conversationId) {
        dispatch({
          type: "MSG_SUCCESS",
          payload: [...messages, arrivalMessage.message],
        });
      } else {
        setTesting("working");
      }
    } else if (arrivalMessage) {
    }
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    socket.on("getUsers", (users) => {
      setOnlineUser(users);
    });
  }, [userInfo]);

  useEffect(() => {
    const getConversation = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/conversations/user`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({
          type: "FETCH_SUCCESS",
          payload: data.conversations,
        });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err });
        console.log(err);
      }
    };
    getConversation();
  }, [userInfo, refresh]);

  const [reportConversions, setReportConversions] = useState([]);
  useEffect(() => {
    const getReportConversation = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/conversations/reports`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        console.log(data);
        setReportConversions(data);
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err });
        console.log(err);
      }
    };
    if (userInfo.isAdmin) getReportConversation();
  }, [userInfo, refresh]);

  const [supportConversations, setSupportConversations] = useState([]);
  useEffect(() => {
    const getSupportConversation = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await axios.get(`/api/conversations/supports`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        console.log("support", data);
        setSupportConversations(data);
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err });
        console.log(err);
      }
    };
    if (userInfo.isAdmin) getSupportConversation();
  }, [userInfo, refresh]);

  const [reports1, setReports1] = useState(false);

  useEffect(() => {
    const getReport = async () => {
      try {
        if (currentReply) {
          const { data } = await axios.get(`/api/reports/${currentReply}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          setReports(data.reports);
        }
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err });
        console.log(getError(err));
      }
    };
    getReport();
  }, [currentReply, userInfo, reports1]);

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

  useEffect(() => {
    if (sp) {
      const getCat = async () => {
        try {
          const { data } = await axios.get(
            `/api/conversations/find/${currentCon}`,
            { headers: { Authorization: `Bearer ${userInfo.token}` } }
          );
          setCurrentChat(data);
        } catch (err) {
          console.log(getError(err));
        }
      };
      getCat();
    }
  }, []);

  useEffect(() => {
    scrollref.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, reports]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.length && !image.length) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Failed",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    const receiverId = currentChat.members.find(
      (member) => member !== userInfo._id
    );
    console.log(currentChat._id);

    const message = {
      text: newMessage,
      conversationId: currentChat._id,
      image: image,
      receiverId,
      guestEmail: currentChat.guest ? currentChat.guestEmail : "",
      sendMail: isOnlineCon(currentChat),
    };
    try {
      const { data } = await axios.post("api/messages", message, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      dispatch({
        type: "MSG_SUCCESS",
        payload: [...messages, data.message],
      });
      console.log("receiver", receiverId);
      socket.emit("sendMessage", {
        message: data.message,
        senderId: userInfo._id,
        image: image,
        receiverId,
        text: newMessage,
      });
      socket.emit("post_data", {
        userId:
          (currentChat.conversationType === "reportProduct" ||
            currentChat.conversationType === "reportUser") &&
          !userInfo.isAdmin
            ? "Admin"
            : receiverId,
        itemId: currentChat._id,
        notifyType:
          currentChat.conversationType === "reportProduct" ||
          currentChat.conversationType === "reportUser"
            ? "report"
            : currentChat.conversationType === "support"
            ? "support"
            : "message",
        msg:
          currentChat.conversationType === "reportProduct" ||
          currentChat.conversationType === "reportUser"
            ? "New report Message"
            : currentChat.conversationType === "support"
            ? "New Support message"
            : `${userInfo.username} sent you a message`,
        link: `/messages?conversation=${currentChat._id}`,
        mobile: { path: "Conversation", id: "" },

        userImage: userInfo.image,
      });
      setNewMessage("");
      setImage("");
      setRefresh(!refresh);
    } catch (err) {
      console.log(err);
    }
  };

  const [user, setUser] = useState([]);
  const [loadingx, setLoadingx] = useState(false);

  useEffect(() => {
    if (currentChat) {
      const friendId = currentChat.members.find((m) => m !== userInfo._id);
      const getUser = async () => {
        try {
          setLoadingx(true);
          const { data } = currentChat.guest
            ? await axios.get(`/api/guestusers/${friendId}`, {
                headers: { Authorization: `Bearer ${userInfo.token}` },
              })
            : await axios.get(`/api/users/seller/${friendId}`, {
                headers: { Authorization: `Bearer ${userInfo.token}` },
              });
          setUser(data);
          setLoadingx(false);
        } catch (err) {
          setLoadingx(false);
          console.log(err);
        }
      };
      if (friendId) {
        getUser();
      }
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

  const isOnlineCon = (c) => {
    if (onlineUser.length > 0) {
      let onlineUserList = [];
      onlineUser.map((o) => onlineUserList.push(o._id));
      if (
        onlineUserList.includes(
          c.members.find((member) => member !== userInfo._id)
        )
      ) {
        return true;
      } else return false;
    }
  };

  const selectCoversation = async (user) => {
    try {
      const { data } = await axios.get(
        `/api/conversations/find/${userInfo._id}/${user._id}`,
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setCurrentChat(data);
    } catch (err) {
      console.log(err);
    }
  };

  const addConversation = async (id) => {
    try {
      const { data } = await axios.post(
        `/api/conversations/`,
        { recieverId: id, type: "user" },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      setCurrentChat(data);
      setSearchResult([]);
    } catch (err) {
      console.log(err);
    }
  };

  const uploadHandler = async (e) => {
    const file = e;
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      console.log("helo");
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post("/api/upload", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: "UPLOAD_SUCCESS" });
      console.log("fkkjshdaeldnf", data);
      setImage(data.secure_url);
      console.log("jkghfgfdsfdgfhjhimage", image);
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Image Uploaded",
          showStatus: true,
          state1: "visible1 success",
        },
      });
    } catch (err) {
      dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Failed uploading image",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      console.log(getError(err));
    }
  };

  const [invalidImage, setInvalidImage] = useState("");
  const [resizeImage1, setResizeImage] = useState({
    file: [],
    filepreview: null,
  });
  useEffect(() => {
    const uploadImage = async () => {
      try {
        if (!invalidImage && resizeImage1.filepreview) {
          await uploadHandler(resizeImage1.file);
          // setImage(resizeImage1.filepreview);
        }
      } catch (err) {
        console.log(getError(err));
      }
    };
    uploadImage();
  }, [resizeImage1]);

  const handleImageUpload = async (e) => {
    resizeImage(e, setInvalidImage, setResizeImage);
  };

  const { width } = useWindowDimensions();
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && width > 992) {
      handleSubmit(e);
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

  const [currentTab, setCurrentTab] = useState("messages");
  const toggleTab = (tab) => {
    switch (tab) {
      case "messages":
        return (
          <Conserv>
            {conversations.length < 1
              ? "No Conversation"
              : conversations.map(
                  (c, index) =>
                    c.conversationType !== "support" && (
                      <div
                        onClick={() => {
                          setShowLeft(false);
                          setCurrentChat(c);
                          socket.emit("remove_notifications", c._id);
                        }}
                        key={index}
                      >
                        <Conversation
                          conversation={c}
                          status={isOnlineCon(c)}
                          currentChat={currentChat._id}
                        />
                      </div>
                    )
                )}
          </Conserv>
        );
      case "reports":
        return (
          <Conserv>
            {reportConversions.length < 1
              ? "No Reports"
              : reportConversions.map((r, index) => (
                  <div
                    key={r._id}
                    onClick={() => {
                      setShowLeft(false);
                      setCurrentChat(r);
                      socket.emit("remove_notifications", r._id);
                    }}
                  >
                    <Conversation
                      report
                      conversation={r}
                      status={isOnlineCon(r)}
                      currentChat={currentChat._id}
                    />
                  </div>
                ))}
          </Conserv>
        );
      case "supports":
        return (
          <Conserv>
            {supportConversations.length < 1
              ? "No Support"
              : supportConversations.map((r, index) => (
                  <div
                    key={r._id}
                    onClick={() => {
                      setShowLeft(false);
                      setCurrentChat(r);
                      socket.emit("remove_notifications", r._id);
                    }}
                  >
                    <Conversation
                      report
                      conversation={r}
                      status={isOnlineCon(r)}
                      currentChat={currentChat._id}
                    />
                  </div>
                ))}
          </Conserv>
        );

      default:
        break;
    }
  };

  const handleSubmitReply = async () => {
    try {
      const { data } = await axios.post(
        "/api/reports/",
        {
          reportedUser: reports[0].reportedUser.toString(),
          user: currentReply,
          text: newMessage,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      socket.emit("sendReport", {
        report: data.savedReport,
      });

      setReports1(!reports1);
      //
      // const newreports = reports.map((r) => {
      //   if (r._id === data.savedReport.user) {
      //     r.user.push(data.savedReport);
      //   }
      //   return r;
      // });
      // console.log('newreport', newreports);
      // setReports1(data.savedReport);

      // socket.emit('sendReport', {
      //   report: data.savedReport,
      // });

      setNewMessage("");
    } catch (err) {
      console.log(getError(err));
    }
  };
  const [showLeft, setShowLeft] = useState(true);
  // let searchConversations=conversations
  //   if(searchInput.length>0){
  //     searchConversations=searchConversations.filter((i)=>{
  //       return i
  //     })
  //   }

  return (
    <Container className={mode} onClick={closeModel}>
      <Navbar
        menu={menu}
        setmodelRef1={backgroundMode}
        showNotification={showNotification}
        setShowNotification={setShowNotification}
        setMymenu={setMymenu}
        setmodelRef2={changeRef2}
      />

      <ChatCont mode={mode}>
        <Left mode={mode} showLeft={showLeft}>
          <TopBar>
            <div style={{ position: "relative" }}>
              <FontAwesomeIcon icon={faSearch} />
              <Search
                onChange={handleSearchInput}
                placeholder="Search..."
                mode={mode}
              />

              {searchResult.length > 0 && (
                <SearchUl mode={mode} ref={searchRef}>
                  {searchResult.map(
                    (u) =>
                      u._id !== userInfo._id && (
                        <SearchLi
                          key={u._id}
                          onClick={() => addConversation(u._id)}
                        >
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
          {toggleTab(currentTab)}
          {userInfo && userInfo.isAdmin && (
            <Tab mode={mode}>
              <TabItem
                className={currentTab === "messages" ? "active" : ""}
                mode={mode}
                onClick={() => {
                  setCurrentTab("messages");
                  setCurrentChat("");
                }}
              >
                Messages
              </TabItem>
              <TabItem
                mode={mode}
                className={currentTab === "reports" ? "active" : ""}
                onClick={() => {
                  setCurrentTab("reports");
                  setCurrentChat("");
                }}
              >
                Reports
                {reportNotification.length ? (
                  <Badge>{reportNotification.length}</Badge>
                ) : null}
              </TabItem>
              <TabItem
                mode={mode}
                className={currentTab === "supports" ? "active" : ""}
                onClick={() => setCurrentTab("supports")}
              >
                Supports
                {supportNotification.length ? (
                  <Badge>{supportNotification.length}</Badge>
                ) : null}
              </TabItem>
            </Tab>
          )}
        </Left>
        <Right mode={mode} showLeft={showLeft}>
          {currentChat ? (
            <ChatCont2>
              {!loadingx && (
                <BackUser>
                  {!showLeft && (
                    <Back mode={mode} onClick={() => setShowLeft(true)}>
                      <FontAwesomeIcon icon={faAngleLeft} />
                      Back
                    </Back>
                  )}
                  <div></div>
                  {user._id ? (
                    <Link
                      to={`/seller/${user._id}`}
                      style={{
                        display: "flex",
                        justifyContent: "end",
                        paddingRight: "10px",
                        "box-shadow":
                          mode === "pagebodylight"
                            ? "0 0 3px rgba(0, 0, 0, 0.2)"
                            : "0 0 3px rgba(225, 225, 225, 0.2)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <ProfileImg src={user.image} />
                        <div>{user.username}</div>
                      </div>
                    </Link>
                  ) : (
                    <div style={{ hieght: "46px" }} />
                  )}
                </BackUser>
              )}
              {currentTab !== "supports" && (
                <PrivacyInfo>
                  <FontAwesomeIcon icon={faShield} />

                  <div
                    style={{
                      color: "grey",
                      textAlign: "center",
                      lineHeight: "18px",
                    }}
                  >
                    {currentTab === "messages"
                      ? `
                  Kind Reminder: To make sure you're covered by Repeddle Buyer's
                  & Seller's Protection, all payments must be made using
                  Repeddle's App and Website complete CHECKOUT system.`
                      : currentTab === "reports"
                      ? `Please leave all information that will help us resolve your
                  query. Please include an order number if your report is
                  related to an order you purchased from this seller, or you
                  can go to your purchase history and report the related item
                  directly from the report tab on the item page.`
                      : ""}
                  </div>
                </PrivacyInfo>
              )}
              {currentChat.conversationType !== "user" &&
                currentChat.conversationType !== "support" && (
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
                      <div>
                        {currentChat.conversationType === "reportUser"
                          ? product.username
                          : product.name}
                      </div>
                    </div>
                  </Link>
                )}
              <ChatArea
                className={
                  currentTab === "supports"
                    ? "support"
                    : currentTab === "messages" &&
                      currentChat.conversationType === "user"
                    ? "messages"
                    : ""
                }
              >
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {messages.map((m, index) => (
                    <div ref={scrollref} key={index}>
                      <Messages
                        key={m._id}
                        own={m.sender === userInfo._id}
                        message={m}
                      />
                    </div>
                  ))}
                </div>
              </ChatArea>
              <Message>
                <Textarea
                  placeholder="Write a message"
                  mode={mode}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  value={newMessage}
                ></Textarea>
                <FontAwesomeIcon
                  onClick={() => setShowUploadingImage(true)}
                  icon={faImage}
                />

                <ModelLogin
                  setShowModel={setShowUploadingImage}
                  showModel={showUploadingImage}
                >
                  <UploadImageModal>
                    {loadingUpload ? (
                      <LoadingBox />
                    ) : image ? (
                      <Imagecont>
                        <Image src={image} alt="img" />
                        <Remove onClick={() => setImage("")}>Remove</Remove>
                      </Imagecont>
                    ) : (
                      <label
                        htmlFor="addimage"
                        style={{
                          display: "flex",
                          height: "100%",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <FontAwesomeIcon
                          style={{ fontSize: "200px" }}
                          icon={faImage}
                        />
                        Click to Add Image
                      </label>
                    )}
                    <input
                      type="file"
                      id="addimage"
                      style={{ display: "none" }}
                      onChange={handleImageUpload}
                    />
                    <Message>
                      <TextInput
                        mode={mode}
                        placeholder="Write a message"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                      />

                      <FontAwesomeIcon
                        icon={faPaperPlane}
                        onClick={(e) => {
                          handleSubmit(e);
                          setShowUploadingImage(false);
                        }}
                      />
                    </Message>
                  </UploadImageModal>
                </ModelLogin>

                <FontAwesomeIcon icon={faPaperPlane} onClick={handleSubmit} />
              </Message>
            </ChatCont2>
          ) : (
            <NoConversation>
              Select a conversation to start a chat
            </NoConversation>
          )}
        </Right>
      </ChatCont>
    </Container>
  );
}
