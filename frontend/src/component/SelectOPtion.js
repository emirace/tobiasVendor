import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: ralative;
`;
const Border = styled.div`
  height: 40px;
  border: 1px solid #ddd;
  position: relative;
  max-width: 200px;
  border-radius: 5px;
  padding: 5px;
  display: flex;
  align-items: center;
  cursor: pointer;
  &:before {
    content: '';
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translate(0, -50%);
  }
`;
const Text = styled.div`
  &:hover {
    background: #f79a23;
  }
`;

export default function SelectOPtion(props) {
  const [currentOption, setCurrentOption] = useState('');
  const [display, setDisplay] = useState(false);
  const { options: a, getResult1 } = props;
  const b = a.split(',');
  const TextGroup = styled.div`
    padding-left: 5px;
    padding-right: 5px;
    position: absolute;
    background: #fff;
    border: 1px solid #ddd;
    width: 200px;
    display: ${display ? 'block' : 'none'};
  `;
  getResult1(currentOption);
  return (
    <Container>
      <Border onClick={() => setDisplay(!display)}>{currentOption}</Border>
      <TextGroup>
        {b.map((p) => (
          <Text
            onClick={() => {
              setCurrentOption(p);
              setDisplay(!display);
            }}
          >
            {p}
          </Text>
        ))}
      </TextGroup>
    </Container>
  );
}
