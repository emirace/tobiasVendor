import {
  faBan,
  faEnvelopeCircleCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Store } from "../../Store";

const Container = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  z-index: 8;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;
const Title = styled.h3``;
const Text = styled.div`
  max-width: 600px;
  text-align: center;
`;
const Bold = styled.b`
  color: var(--orange-color);
  &:hover {
    color: var(--malon-color);
  }
`;

export default function BanScreen() {
  const { state } = useContext(Store);
  const { mode } = state;
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "unset");
  }, []);
  return (
    <Container mode={mode}>
      <Content>
        <FontAwesomeIcon
          style={{
            marginBottom: "30px",
          }}
          size="6x"
          color="var(--malon-color)"
          icon={faBan}
        />
        <Title>Account Temporary Banned</Title>
        <Text
          style={{
            marginBottom: "30px",
          }}
        >
          As a result of your activities on Repeddle, your account has been
          disabled. We will suspend your account forever if you do not abide by
          the terms of service. Please note that by using our website, you agree
          to abide by our rules and held accountable by what you do and say on
          your account.
        </Text>
        <Text>
          If you did not get any mail{" "}
          <Bold>
            If you think this was a mistake, contact the support center.
          </Bold>
        </Text>
      </Content>
    </Container>
  );
}
