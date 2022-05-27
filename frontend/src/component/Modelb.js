import React, { useState } from 'react';
import styled from 'styled-components';
import Model from './Model';

const Button = styled.button`
  background: black;
  color: white;
  border: 1px solid white;
`;
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export default function Modelb(children) {
  const [showModel, setShowModel] = useState(false);
  return (
    <Container>
      <Button onClick={() => setShowModel(!showModel)}>I am a Model</Button>
      <Model showModel={showModel} setShowModel={setShowModel} />
    </Container>
  );
}
