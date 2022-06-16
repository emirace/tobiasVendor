import React from 'react';
import styled from 'styled-components';

const Alert = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 20px;
`;
export default function MessageBox(props) {
  return <Alert>{props.children}</Alert>;
}
