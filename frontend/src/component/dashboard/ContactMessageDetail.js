import React, { useContext } from 'react';
import styled from 'styled-components';
import MessageImage from '../MessageImage';
import axios from 'axios';
import { Store } from '../../Store';

const MessageContainer = styled.div`
  padding: 20px;
  margin-bottom: 20px;
`;
const Item = styled.div`
  margin-bottom: 10px;
`;
const Label = styled.strong``;

const ContactMessageDetail = ({ message, handleClick }) => {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const {
    _id,
    name,
    email,
    category,
    subject,
    message: messageContent,
    file,
    assignTo,
  } = message;

  return (
    <MessageContainer>
      <Item>
        <Label>Name:</Label> <div>{name}</div>
      </Item>
      <Item>
        <Label>Email:</Label>{' '}
        <div
          style={{ color: 'var(--malon-color)' }}
          onClick={() => handleClick(_id)}
        >
          <a href={`mailto: ${email}`}>{email}</a>
        </div>
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

      <Item>
        <Label>Asigned to:</Label> <div>{assignTo ? assignTo : 'None'}</div>
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
