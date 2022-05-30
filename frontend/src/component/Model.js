import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef } from "react";
import styled from "styled-components";
import ReviewLists from "../screens/ReviewLists";

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
    z-index: 10;
`;

const ModelWrapper = styled.div`
    width: 50%;
    height: 500px;
    box-shadow: 0 5px 16px rgba(0, 0, 0, 0.2);
    background: #fff;
    color: #000;
    position: relative;
    z-index: 10;
    border-radius: 10px;
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
                        <ReviewLists />
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
