import React, { useContext, useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Toast from "react-bootstrap/Toast";
import styled from "styled-components";
import { Store } from "../Store";

const ToastCont = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  max-width: 400px;
  max-height: 100px;
  z-index: 10;
  padding: 6px;
  background: var(--orange-color);
  color: #fff;
  text-align: center;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border-radius: 0.2rem;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.2s, top 0.2s, visibility 0.2s;
  &.visible1 {
    top: 50px;
    visibility: visible;
    opacity: 1;
  }

  &.success {
    background: var(--orange-color);
  }
  &.error {
    background: var(--malon-color);
  }
`;

export default function ToastNotification() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { toast } = state;

  function closeHandler() {
    ctxDispatch({ type: "REMOVE_TOAST" });
  }
  return (
    <ToastCont className={toast.state1}>
      <Toast
        onClose={() => closeHandler(false)}
        show={toast.showStatus}
        delay={3000}
        autohide
      >
        {toast.message}
      </Toast>
    </ToastCont>
  );
}
