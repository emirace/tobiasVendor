import React, { useContext, useRef, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";

const NotificationCon = styled.div`
    position: absolute;
    background: var(--orange.color);
    top: 30px;
    right: 30ps;
    border-radius: 0.2rem;
    overflow: hidden;
    display: flex;
    justity-content: center;
    align-items: center;
    gap: 1rem;
    & .warning {
        width: 1.5rem;
        margin-left: 1rem;
    }
    & .close {
        margin: 1rem;
        cursor: pointer;
        width: 1rem;
    }
    &.show {
        animation: warning 400ms ease-in-out forward;
        display: flex;
    }
    @keyframes warning {
        0% {
            opacity: 0;
            right: 0;
        }
        5% {
            opacity: 0;
        }
        100% {
            opacity: 1;
            right: 2rem;
        }
    }
`;
const Content = styled.div``;

export default function Notification() {
    <NotificationCon>
        <FontAwesomeIcon clasdName="warning" icon="faBell" />
        <Content>
            <p>this is a notification</p>
            <button> view</button>
        </Content>
        <FontAwesomeIcon className="close" icon="faXmark" />
    </NotificationCon>;
}
