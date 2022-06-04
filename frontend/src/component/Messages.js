import React from 'react';
import styled from 'styled-components';

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

export default function Messages() {
  return (
    <>
      <RecievedChat>
        <InlineR>hello</InlineR>
      </RecievedChat>
      <RecievedChat>
        <InlineR>hello</InlineR>
      </RecievedChat>
      <SendChat>
        <InlineS>hi, how are you doing</InlineS>
      </SendChat>
      <RecievedChat>
        <InlineR>hello</InlineR>
      </RecievedChat>
      <SendChat>
        <InlineS>hi, how are you doing</InlineS>
      </SendChat>
    </>
  );
}
