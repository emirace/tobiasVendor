import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
`;

const Tooltip = styled.div`
  position: absolute;
  display: none;
  bottom: -30px;
  z-index: 9;
  background: white;
  color: #000;
  font-size: 13px;
  padding: 5px;
  border-radius: 10px;
  white-space: nowrap;

  &:before {
    content: '';
    position: absolute;
    top: -5px;
    left: 10px;
    width: 10px;
    background: white;
    height: 10px;
    transform: rotate(45deg);
  }
`;

export default function IconsTooltips(props) {
  const { tips } = props;

  return (
    <Container>
      <Tooltip>{tips}</Tooltip>
    </Container>
  );
}
