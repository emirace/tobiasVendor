import React, { useContext, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faXmark } from '@fortawesome/free-solid-svg-icons';
import { Store } from '../Store';

const NotificationCon = styled.div`
  position: fixed;
  background: var(--orange-color);
  top: 30px;
  right: 30px;
  border-radius: 0.2rem;
  color: white;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  gap: 1rem;
  & .warning {
    width: 1.5rem;
    margin: 0 1rem;
  }
  & .close {
    margin: 1rem;
    cursor: pointer;
    width: 1rem;
  }
  &.show {
    animation: warning 500ms ease-in-out forwards;
  }
  @keyframes warning {
    0% {
      opacity: 0;
      right: 0;
    }
    5% {
      opacity: 0;
    }
    100% {
      opacity: 1;
      right: 2rem;
    }
  }
`;
const Content = styled.div`
  padding: 0.5rem 0;
  & button {
    border: 0;
    border-radius: 0.2rem;
    padding: 0 0.2rem;
    color: var(--malon-color);
  }
`;

export default function Notification() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { notification: note } = state;

  const closeHandler = () => {
    ctxDispatch({ type: 'REMOVE_NOTIFICAATION' });
  };

  return (
    note.showStatus && (
      <NotificationCon className="show">
        <FontAwesomeIcon className="warning" icon={faBell} />
        <Content>
          <p>{note.text}</p>
          <button> {note.buttonText}</button>
        </Content>
        <FontAwesomeIcon
          onClick={closeHandler}
          className="close"
          icon={faXmark}
        />
      </NotificationCon>
    )
  );
}
