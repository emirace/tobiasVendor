import React from "react";
import styled from "styled-components";
import MessageImage from "../MessageImage";

const MessageContainer = styled.div`
  padding: 20px;
  margin-bottom: 20px;
`;
const Item = styled.div`
  margin-bottom: 10px;
`;
const Label = styled.strong``;

const ContactMessageDetail = ({ message }) => {
  const {
    name,
    email,
    category,
    subject,
    message: messageContent,
    file,
  } = message;

  return (
    <MessageContainer>
      <Item>
        <Label>Name:</Label> <div>{name}</div>
      </Item>
      <Item>
        <Label>Email:</Label> <div>{email}</div>
      </Item>
      <Item>
        <Label>Category:</Label> <div>{category}</div>
      </Item>
      <Item>
        <Label>Subject:</Label> <div>{subject}</div>
      </Item>
      <Item>
        <Label>Message:</Label> <div>{messageContent}</div>
      </Item>
      {file && (
        <div>
          <MessageImage url={file} />
        </div>
      )}
    </MessageContainer>
  );
};

export default ContactMessageDetail;
