import { faBoltLightning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Countdown from "react-countdown";
import styled from "styled-components";
import { Store } from "../Store";

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
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [restart, setRestart] = useState(Math.random());
  const [countdown, setCountdown] = useState(true);
  const [rebundleList, setRebundleList] = useState([]);
  const [show, setShow] = useState(false);
  const [seller, setSeller] = useState("");

  useEffect(() => {
    console.log("hello11111");
    const getRebundleList = async () => {
      console.log("hello");
      if (userInfo) {
        console.log("hello2222");
        try {
          const { data } = await axios.get(`/api/users/checkbundle/${userId}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });
          console.log("hello333");

          setShow(data.success);
          setSeller(data.seller);
          console.log(data);
        } catch (err) {
          console.log(err);
        }
      }
    };
    getRebundleList();
  }, [userInfo]);

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

  return true ? (
    <Container>
      <div>
        REBUNDLE {console.log("hello")}
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
  ) : (
    ""
  );
}
