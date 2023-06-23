import { faBan } from "@fortawesome/free-solid-svg-icons";
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

export default function DeletedScreen() {
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
        <Title>Account Deleted</Title>
        <Text
          style={{
            marginBottom: "30px",
          }}
        >
          Your account has been permanently deleted, please contact support on{" "}
          <Link to="" style={{ color: "var(--orange-color)" }}>
            Support center
          </Link>
        </Text>
      </Content>
    </Container>
  );
}
