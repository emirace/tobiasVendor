import React from "react";
import styled from "styled-components";

const Alert = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 20px;
  &.danger {
    color: red;
  }
`;
export default function MessageBox(props) {
  return <Alert className={props.variant}>{props.children}</Alert>;
}
