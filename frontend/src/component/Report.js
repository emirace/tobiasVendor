import axios from 'axios';
import React, { useContext, useEffect, useReducer, useRef } from 'react';
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

export default function Report({ reportedUser }) {
  const { state } = useContext(Store);
  const { userInfo, mode } = state;

  const scrollref = useRef();

  const [{ loadingReports, error, reports }, dispatch] = useReducer(reducer, {
    loadingReports: true,
    error: '',
    reports: [],
  });

  useEffect(() => {
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
    scrollref.current?.scrollIntoView({ behavior: 'smooth' });
  }, [reports]);

  return (
    <Container mode={mode}>
      <ChatArea mode={mode}>
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
      </ChatArea>
    </Container>
  );
}
