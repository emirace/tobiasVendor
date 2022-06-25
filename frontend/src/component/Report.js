import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useContext, useEffect, useReducer, useRef } from 'react';
import { useState } from 'react';
import { io } from 'socket.io-client';
import styled from 'styled-components';
import { Store } from '../Store';
import { getError } from '../utils';
import LoadingBox from './LoadingBox';
import Messages from './Messages';

const Container = styled.div`
  height: 100%;
  width: 100%;
  padding: 20px;
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev1)' : 'var(--light-ev1)'};
`;
const ChatArea = styled.div`
  height: calc(100% - 40px);
  width: 100%;
  border-radius: 0.2rem;
  margin-top: 20px;
  overflow-y: auto;
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev2)' : 'var(--light-ev2)'};
  &::-webkit-scrollbar {
    display: none;
  }
`;
const ChatBox = styled.div`
  height: calc(100% - 66px);
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
    props.mode === 'pagebodydark'
      ? 'var(--black-color)'
      : 'var(--white-color)'};
  border-radius: 0.2rem;
  border: 1px solid
    ${(props) =>
      props.mode === 'pagebodydark' ? 'var(--dark-ev3)' : 'var(--light-ev3)'};
  color: ${(props) =>
    props.mode === 'pagebodydark'
      ? 'var(--white-color)'
      : 'var(--black-color)'};
  padding: 20px;
  &:focus-visible {
    outline: 1px solid var(--orange-color);
  }
  &::placeholder {
    padding: 20px;
    color: ${(props) =>
      props.mode === 'pagebodydark'
        ? 'var(--white-color)'
        : 'var(--black-color)'};
  }
`;

const reducer = (state, action) => {
  switch (action.type) {
    case 'MSG_REQUEST':
      return { ...state, loadingReports: true };
    case 'MSG_SUCCESS':
      return {
        ...state,
        reports: action.payload,
        loadingReports: false,
      };
    case 'MSG_FAIL':
      return { ...state, loadingReports: false, error: action.payload };
    default:
      return state;
  }
};

const ENDPOINT =
  window.location.host.indexOf('localhost') >= 0
    ? 'ws://127.0.0.1:5000'
    : window.location.host;

export default function Report({ reportedUser }) {
  const { state } = useContext(Store);
  const { userInfo, mode } = state;

  const scrollref = useRef();
  const [reply, setReply] = useState();
  const [arrivalReport, setArrivalReport] = useState();

  const [{ loadingReports, error, reports }, dispatch] = useReducer(reducer, {
    loadingReports: true,
    error: '',
    reports: [],
  });

  const socket = useRef();

  useEffect(() => {
    socket.current = io(ENDPOINT);
    socket.current.on('getMessage', (data) => {
      setArrivalReport({
        sender: data.senderId,
        text: data.text,
        message: data.message,
      });
    });
  }, []);

  useEffect(() => {
    socket.current = io(ENDPOINT);
    const getMessages = async () => {
      try {
        dispatch({ type: 'MSG_REQUEST' });
        const { data } = await axios.get(`/api/reports/${userInfo._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'MSG_SUCCESS', payload: data.reports });
      } catch (err) {
        dispatch({ type: 'MSG_FAIL' });

        console.log(getError(err));
      }
    };
    getMessages();
  }, [userInfo]);
  useEffect(() => {
    if (arrivalReport) {
      dispatch({
        type: 'MSG_SUCCESS',
        payload: arrivalReport,
      });
    }
  }, [arrivalReport]);

  useEffect(() => {
    scrollref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [reports]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        '/api/reports/',
        {
          reportedUser,
          text: reply,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'MSG_SUCCESS',
        payload: [...reports, data.savedReport],
      });

      socket.current.emit('sendReport', {
        report: data.savedReport,
        senderId: userInfo._id,
      });

      setReply('');
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
            reports.reports &&
            reports.reports.map((m, index) => (
              <div ref={scrollref} key={index}>
                <Messages own={m.sender === userInfo._id} message={m} />
              </div>
            ))
          )}
        </ChatBox>
        <Message>
          <TextInput
            mode={mode}
            placeholder="Write a message"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <FontAwesomeIcon icon={faPaperPlane} onClick={handleSubmit} />
        </Message>
      </ChatArea>
    </Container>
  );
}
