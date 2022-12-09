import { faBoltLightning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import styled from "styled-components";

const Container = styled.div`
  position: fixed;
  right: 0;
  top: 200px;
  background: var(--orange-color);
  /* height: 50px; */
  /* width: 100px; */
  padding: 5px;
  padding-left: 20px;
  border-top-left-radius: 25px;
  border-bottom-left-radius: 25px;
  font-size: 12px;
`;
export default function RebundleLabel({ userId }) {
  const [restart, setRestart] = useState(Math.random());
  const [countdown, setCountdown] = useState(false);
  const [rebundleList, setRebundleList] = useState([]);

  useEffect(() => {
    const getRebundleList = async () => {
      const { data } = await axios.get("/api/");
    };
    getRebundleList();
  }, []);

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return "";
    } else {
      // Render a countdown
      return (
        <span>
          {" "}
          {minutes}min : {seconds}secs
        </span>
      );
    }
  };

  return (
    <Container>
      <div>
        REBUNDLE{" "}
        <FontAwesomeIcon
          style={{ marginLeft: "10px" }}
          icon={faBoltLightning}
        />
      </div>
      <Countdown
        date={Date.now() + 1200000}
        key={restart}
        onComplete={() => setCountdown(false)}
        renderer={renderer}
      />
    </Container>
  );
}
