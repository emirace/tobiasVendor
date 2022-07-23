import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useContext, useEffect, useReducer, useRef } from "react";
import { useState } from "react";
import { io } from "socket.io-client";
import styled from "styled-components";
import { Store } from "../Store";
import { getError } from "../utils";
import LoadingBox from "./LoadingBox";
import Messages from "./Messages";

const Container = styled.div`
  height: 100%;
  width: 100%;
  padding: 20px;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
`;
const ChatArea = styled.div`
  position: relative;
  height: calc(100% - 40px);
  width: 100%;
  border-radius: 0.2rem;
  margin-top: 20px;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev2)"};
`;
const ChatBox = styled.div`
  height: calc(100% - 66px);
  padding: 40px 40px 0 40px;
  overflow-y: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;
const Message = styled.div`
  display: flex;
  align-items: center;
  height: 60px;
  margin: 3px 20px;
  & svg {
    font-size: 30px;
    margin-left: 20px;
    cursor: pointer;
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
`;

const ReportedUser = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  top: 30px;
  transform: translateX(-50%);
  left: 50%;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev3)" : "var(--light-ev3)"};
  padding: 10px 20px;
`;

const Image = styled.img`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
`;
const Name = styled.div`
  margin-left: 10px;
  font-weight: bold;
  text-transform: capitalize;
`;
const Text = styled.div`
  font-size: 15px;
  font-weight: 300;
  margin-bottom: 5px;
`;
const UserCont = styled.div`
  display: flex;
  align-items: center;
`;

const reducer = (state, action) => {
  switch (action.type) {
    case "MSG_REQUEST":
      return { ...state, loadingReports: true };
    case "MSG_SUCCESS":
      return {
        ...state,
        reports: action.payload,
        loadingReports: false,
      };
    case "MSG_FAIL":
      return { ...state, loadingReports: false, error: action.payload };
    default:
      return state;
  }
};

const ENDPOINT =
  window.location.host.indexOf("localhost") >= 0
    ? "ws://127.0.0.1:5000"
    : window.location.host;

export default function Report({ reportedUser, productName }) {
  const { state } = useContext(Store);
  const { userInfo, mode } = state;

  const scrollref = useRef();
  const [reply, setReply] = useState();
  const [arrivalReport, setArrivalReport] = useState();

  const [{ loadingReports, error, reports }, dispatch] = useReducer(reducer, {
    loadingReports: true,
    error: "",
    reports: [],
  });

  const socket = useRef();

  useEffect(() => {
    socket.current = io(ENDPOINT);
    socket.current.emit("onlogin", userInfo);
    socket.current.on("getReport", (data) => {
      setArrivalReport(data.report);
    });
  }, [userInfo]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        dispatch({ type: "MSG_REQUEST" });
        const { data } = await axios.get(`/api/reports/${reportedUser}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "MSG_SUCCESS", payload: data.reports });
      } catch (err) {
        dispatch({ type: "MSG_FAIL" });

        console.log(getError(err));
      }
    };
    getMessages();
  }, [reportedUser, userInfo]);
  useEffect(() => {
    if (arrivalReport) {
      dispatch({
        type: "MSG_SUCCESS",
        payload: [...reports, arrivalReport],
      });
    }
  }, [arrivalReport]);

  useEffect(() => {
    scrollref.current?.scrollIntoView({ behavior: "smooth" });
  }, [reports]);
  const [user, setUser] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: dataUser } = await axios.get(
          `/api/users/seller/${reportedUser}`
        );
        setUser(dataUser);
      } catch (err) {
        console.log(getError(err));
      }
    };
    fetchData();
  }, [reportedUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "/api/reports/",
        {
          reportedUser,
          user: userInfo._id,
          text: reply,
          productName: productName || "",
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: "MSG_SUCCESS",
        payload: [...reports, data.savedReport],
      });

      socket.current.emit("sendReport", {
        report: data.savedReport,
      });

      setReply("");
    } catch (err) {
      console.log(getError(err));
    }
  };

  return (
    <Container mode={mode}>
      <ChatArea mode={mode}>
        <ChatBox>
          {loadingReports ? (
            <LoadingBox />
          ) : (
            reports !== [] &&
            reports.map((m, index) => (
              <div ref={scrollref} key={index}>
                <Messages own={!m.admin} message={m} />
              </div>
            ))
          )}
        </ChatBox>
        {user && (
          <ReportedUser mode={mode}>
            <Text>Reporting:</Text>
            {productName ? (
              <div>{productName}</div>
            ) : (
              <UserCont>
                <Image src={user.image} alt="reported User" />
                <Name>{user.name}</Name>
              </UserCont>
            )}
          </ReportedUser>
        )}

        <Message>
          <TextInput
            mode={mode}
            placeholder="Write a Report/Complain"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <FontAwesomeIcon icon={faPaperPlane} onClick={handleSubmit} />
        </Message>
        <div
          style={{ textAlign: "center", fontSize: 12, marginHorizontal: 20 }}
        >
          Please leave all information that will help us resolve your query.
          Please include an order number if your report is related to an order
          you purchased from this seller, or you can go to your purchase history
          and report the related item directly from the report tab on the item
          page.
        </div>
      </ChatArea>
    </Container>
  );
}
