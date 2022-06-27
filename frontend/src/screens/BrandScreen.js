import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
`;
const Alpha = styled.div`
  padding: 5px;
  margin: 5px;
`;
export default function BrandScreen() {
  const alpha = Array.from(Array(26)).map((e, i) => i + 65);
  const alphabet = alpha.map((x) => String.fromCharCode(x));
  console.log(alphabet);

  return (
    <Container>
      {alphabet.map((x) => (
        <Alpha>{x}</Alpha>
      ))}
    </Container>
  );
}
