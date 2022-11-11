import React from "react";
import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  line-height: 20px;
  top: -10px;
  text-align: center;

  right: 10px;
  background: var(--orange-color);
  border-radius: 50%;
  opacity: 1;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
  color: white;
  font-weight: bold;
  text-shadow: 0px 1px 2px rgba(0, 0, 0, 0.5);
  font-size: 0.8em;
  animation-name: bounce;
  animation-duration: 1s;
  animation-delay: 3s;
  animation-iteration-count: infinite;
  @keyframes bounce {
    0%,
    20%,
    53%,
    80%,
    100% {
      -webkit-transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
      -webkit-transform: translate3d(0, 0, 0);
      transform: translate3d(0, 0, 0);
    }

    40%,
    43% {
      -webkit-transition-timing-function: cubic-bezier(
        0.755,
        0.05,
        0.855,
        0.06
      );
      transition-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
      -webkit-transform: translate3d(0, -30px, 0);
      transform: translate3d(0, -30px, 0);
    }

    70% {
      -webkit-transition-timing-function: cubic-bezier(
        0.755,
        0.05,
        0.855,
        0.06
      );
      transition-timing-function: cubic-bezier(0.755, 0.05, 0.855, 0.06);
      -webkit-transform: translate3d(0, -15px, 0);
      transform: translate3d(0, -15px, 0);
    }

    90% {
      -webkit-transform: translate3d(0, -4px, 0);
      transform: translate3d(0, -4px, 0);
    }
  }
`;

export default function OneNewMessage({ notification }) {
  return notification > 0 && <Container>{notification}</Container>;
}
