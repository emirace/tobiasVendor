import React, { useContext, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { Store } from "../Store";

const Container = styled.div``;
const Image = styled.img`
  max-width: 150px;
  display: block;
`;
const Largecont = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};

  @media (max-width: 992px) {
    padding: 10px;
  }
`;
const Close = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: grey;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  & svg {
    color: black;
  }
`;
const LargeImage = styled.img`
  max-height: 100%;
  @media (max-width: 992px) {
    max-height: auto;
    max-width: 100%;
  }
`;
export default function MessageImage({ url }) {
  const { state } = useContext(Store);
  const { mode } = state;
  const [show, setShow] = useState(false);
  return (
    <Container>
      <Image src={url} alt="img" onClick={() => setShow(true)} />
      {show && (
        <Largecont mode={mode}>
          <Close
            onClick={() => {
              console.log("show", show);
              setShow(false);
            }}
          >
            <FontAwesomeIcon icon={faClose} />
          </Close>
          <LargeImage src={url} alt="img" />
        </Largecont>
      )}
    </Container>
  );
}
