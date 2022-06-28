import React from 'react';
import styled from 'styled-components';

const Cards = styled.div`
  width: 23%;
  position: relative;
`;

const Image = styled.img`
  border: 1px solid var(--malon-color);
  width: 100%;
  margin-bottom: 5px;
`;
const Name = styled.div``;
const Add = styled.div`
  position: absolute;
  top: 100px;
  left: 50%;
  border: 1px solid;
  border-radius: 50%;
  background-color: var(--orange-color);
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25px;
  font-weight: 300;
  opacity: 6;
`;

export default function Card({ src, name }) {
  return (
    <Cards>
      <Image src={src} alt="outfit" />
      <Name>@{name}</Name>
      <Add>+</Add>
    </Cards>
  );
}
