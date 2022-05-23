import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { Store } from '../Store';

const Container = styled.div`
  position: ralative;
`;
const Border = styled.div`
  height: 40px;
  border: 2px solid rgba(99, 91, 91, 0.2);
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
    color: #f79a23;
  }
`;
const TextGroup = styled.div`
  padding-left: 5px;
  padding-right: 5px;
  position: absolute;
  background: ${(props) => (props.bg ? '#fff' : '#000')};
  border: 1px solid rgba(99, 91, 91, 0.2);
  width: 200px;
  display: ${(props) => (props.dis ? 'block' : 'none')};
`;

export default function SelectOPtion(props) {
  const { state } = useContext(Store);
  const { mode } = state;
  const [currentOption, setCurrentOption] = useState('');
  const [display, setDisplay] = useState(false);
  const { options: a, getResult1 } = props;
  const b = a.split(',');

  const backMode = (mode) => {
    if (mode === 'pagebodydark') {
      mode = false;
    } else {
      mode = true;
    }
    return mode;
  };
  const optionMode = backMode(mode);

  getResult1(currentOption);
  return (
    <Container>
      <Border onClick={() => setDisplay(!display)}>{currentOption}</Border>
      <TextGroup dis={display} bg={optionMode}>
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
