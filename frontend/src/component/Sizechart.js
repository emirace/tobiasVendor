import React from "react";
import styled from "styled-components";

const Condition = styled.div`
height:100%
  overflow: hidden;
`;
const Image = styled.img`
  width: 100%;
`;
export default function Sizechart() {
  return (
    <Condition>
      <Image src="/images/repeddleSize1.jpg" alt="sizeChart" />
      <Image src="/images/repeddleSize2.jpg" alt="sizeChart" />
      <Image src="/images/repeddleSize3.jpg" alt="sizeChart" />
    </Condition>
  );
}
