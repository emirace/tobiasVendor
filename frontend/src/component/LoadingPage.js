import React, { useContext } from "react";
import styled from "styled-components";
import { Store } from "../Store";

const Background = styled.div`
  width: 100vw;
  height: 100vh;
  /* background: rgba(0, 0, 0, 0.8); */
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Image = styled.img`
  border-radius: 0.2rem;
  height: 10%;
`;
export default function LoadingPage() {
  const { state } = useContext(Store);
  const { mode } = state;
  return (
    <Background>
      <Wrapper>
        <Image
          src={
            mode === "pagebodydark"
              ? "https://res.cloudinary.com/emirace/image/upload/v1660419474/White-Icon_hq7kqa.gif"
              : "https://res.cloudinary.com/emirace/image/upload/v1660419474/Icon-Black_tmgxd4.gif"
          }
          alt="loading"
        />
      </Wrapper>
    </Background>
  );
}
