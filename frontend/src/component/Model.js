import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useRef } from 'react';
import styled from 'styled-components';

const Background = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModelWrapper = styled.div`
  width: 50%;
  height: 500px;
  box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
  background: #fff;
  color: #000;
  display: grid;
  grid-template-columns: 1fr 1fr;
  position: relative;
  z-index: 10;
  border-radius: 10px;
`;

const ModelImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px 0 0 10px;
  background: #000;
`;

const ModelContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  line-height: 1.8;
  color: #141414;
  p {
    margin-bottom: 1rem;
  }

  button {
    padding: 10px 24px;
    background: #141414;
    color: #fff;
    border: none;
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
`;

export default function Model({ showModel, setShowModel }) {
  const modelRef = useRef();

  const closeModel = (e) => {
    if (modelRef.current === e.target) {
      setShowModel(false);
    }
  };
  return (
    <>
      {showModel && (
        <Background ref={modelRef} onClick={closeModel}>
          <ModelWrapper showModel={showModel}>
            <ModelImg src="/images/t6.jpg" alt="pics" />
            <ModelContent>
              <h1>Start Shoping</h1>
              <button>sign in</button>
            </ModelContent>
            <CloseModelButton
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
