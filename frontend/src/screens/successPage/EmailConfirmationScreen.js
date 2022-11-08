import { faEnvelopeCircleCheck } from "@fortawesome/free-solid-svg-icons";
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

export default function EmailConfirmationScreen({ email }) {
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
          icon={faEnvelopeCircleCheck}
        />
        <Title>Reset Password</Title>
        <Text
          style={{
            marginBottom: "30px",
          }}
        >
          We have sent you an email to reset your password. If the email address
          you entered is registered to a RePeddle account, you’ll receive a
          password reset link. Follow the link provided to reset your password.
        </Text>
        <Text>
          If you did not get an email, check your junk or spam folders, and if
          nothing, try again with an email address linked to your RePeddle
          account or{" "}
          <Link to="/forgetpassword">
            <Bold>Resend email confirmation</Bold>
          </Link>
        </Text>
      </Content>
    </Container>
  );
}
