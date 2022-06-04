import React from 'react';
import styled from 'styled-components';
import { format } from 'timeago.js';

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
const TimeR = styled.div`
  text-align: left;
  font-size: 13px;
`;
const TimeS = styled.div`
  text-align: right;
  font-size: 13px;
`;

export default function Messages({ message, own }) {
  return (
    <>
      {own ? (
        <SendChat>
          <div>
            <InlineS>{message.text}</InlineS>
            <TimeS>{format(message.createdAt)}</TimeS>
          </div>
        </SendChat>
      ) : (
        <RecievedChat>
          <div>
            <InlineR>{message.text}</InlineR>
            <TimeR>{format(message.createdAt)}</TimeR>
          </div>
        </RecievedChat>
      )}
    </>
  );
}
