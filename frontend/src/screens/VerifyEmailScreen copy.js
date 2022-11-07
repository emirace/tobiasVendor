import { faEnvelopeCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import { Store } from "../../Store";
import LoadingBox from "../component/LoadingBox";

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
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const { token } = params;
  useEffect(() => {
    setLoading(true);
    const check = async () => {
      try {
        const { data } = await axios.post(
          `/api/users/verifyemail/${token}`,
          {}
        );
        console.log(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
  }, []);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "unset");
  }, []);
  return loading ? (
    <LoadingBox />
  ) : (
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
        <Title>Email Confirmation</Title>
        <Text
          style={{
            marginBottom: "30px",
          }}
        >
          We have sent email to {email} to reset your password. After receiving
          the email follow the link provided to reset your password
        </Text>
        <Text>
          If you did not get any mail{" "}
          <Link to="/forgetpassword">
            <Bold>Resend confirmation mail</Bold>
          </Link>
        </Text>
      </Content>
    </Container>
  );
}
