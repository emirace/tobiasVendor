import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useRef } from "react";
import styled from "styled-components";
import ReviewLists from "../screens/ReviewLists";
import { Store } from "../Store";

const Background = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModelWrapper = styled.div`
  width: 75%;
  height: 600px;
  overflow: auto;
  border-radius: 0.2rem;
  box-shadow: ${(props) =>
    props.mode === "pagebodylight "
      ? "0 5px 16px rgba(0, 0, 0, 0.2)"
      : "0 5px 16px rgba(225, 225, 225, 0.2)"};
  position: relative;
  z-index: 10;
  border-radius: 10px;
  &::-webkit-scrollbar {
    display: none;
  }
  @media (max-width: 992px) {
    width: 100%;
    height: 100%;
  }
`;

const CloseModelButton = styled.div`
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  width: 32px;
  height: 32px;
  padding: 0;
  z-index: 10;
  @media (max-width: 992px) {
    right: 20px;
    width: 20px;
  }
`;

export default function ModelLogin({ showModel, setShowModel, children }) {
  const modelRef = useRef();

  const { state } = useContext(Store);
  const { mode } = state;
  const closeModel = (e) => {
    if (modelRef.current === e.target) {
      setShowModel(false);
    }
  };

  useEffect(() => {
    if (showModel) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "15px";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [showModel]);

  return (
    <>
      {showModel && (
        <Background ref={modelRef} onClick={closeModel}>
          <ModelWrapper className={mode} mode={mode} showModel={showModel}>
            {children}
            <CloseModelButton
              style={{ color: "grey" }}
              ariel-label="Close model"
              onClick={() => setShowModel(!showModel)}
            >
              <FontAwesomeIcon icon={faClose} />
            </CloseModelButton>
          </ModelWrapper>
        </Background>
      )}
    </>
  );
}
