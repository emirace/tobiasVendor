import { faBoltLightning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Countdown from "react-countdown";
import styled from "styled-components";
import { Store } from "../Store";
import { rebundleIsActive } from "../utils";

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
  color: white;
`;
export default function RebundleLabel({ userId, active }) {
  const { state } = useContext(Store);
  const { userInfo, cart } = state;
  const [restart, setRestart] = useState(Math.random());
  const [countdown, setCountdown] = useState(true);
  const [rebundleList, setRebundleList] = useState([]);
  const [show, setShow] = useState(false);
  const [seller, setSeller] = useState("");

  useEffect(() => {
    const getRebundleList = async () => {
      if (!userInfo) return;
      const data = await rebundleIsActive(userInfo, userId, cart);
      console.log("data", data);
      setShow(data.success);
      setSeller(data.seller);
    };
    getRebundleList();
  }, [userId, userInfo]);

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return "";
    } else {
      // Render a countdown
      return (
        <span>
          {hours !== 0 && `${hours}hrs : `}
          {minutes}mins : {seconds}secs
        </span>
      );
    }
  };

  return active ? (
    show ? (
      <Container>
        <div>
          <FontAwesomeIcon
            style={{ marginRight: "10px" }}
            icon={faBoltLightning}
          />
          Rebundle is Active
        </div>
        <Countdown
          date={
            Date.now() +
            (7200000 -
              (Number(Date.now()) - Number(Date.parse(seller.createdAt))))
          }
          key={restart}
          onComplete={() => setCountdown(false)}
          renderer={renderer}
        />
      </Container>
    ) : (
      ""
    )
  ) : (
    ""
  );
}
