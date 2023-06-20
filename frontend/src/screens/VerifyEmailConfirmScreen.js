import { faEnvelopeCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import LoadingBox from "../component/LoadingBox";
import MessageBox from "../component/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils";
import secureLocalStorage from "react-secure-storage";

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

const Button = styled.div`
  padding: 5px 7px;
  color: white;
  background: var(--orange-color);
  cursor: pointer;
  border-radius: 0.2rem;
  &:hover {
    background: var(--malon-color);
  }
`;

export default function VerifyEmailConfirmScreen({ email }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode } = state;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const params = useParams();
  const { token } = params;
  const signoutHandler = () => {
    ctxDispatch({ type: "USER_SIGNOUT" });
    secureLocalStorage.removeItem("userInfo");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
  };
  useEffect(() => {
    setLoading(true);
    signoutHandler();
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
        setError(getError(error));
      }
    };
    check();
  }, []);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "unset");
  }, []);
  return loading ? (
    <LoadingBox />
  ) : (
    <Container mode={mode}>
      {error ? (
        <MessageBox>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ textAlign: "center" }}>{error}</div>
            <div>
              <Link
                to={"/verifyemail"}
                style={{ color: "var(--orange-color)" }}
              >
                Resend
              </Link>
            </div>
          </div>
        </MessageBox>
      ) : (
        <Content>
          <FontAwesomeIcon
            style={{
              marginBottom: "30px",
            }}
            size="6x"
            color="var(--malon-color)"
            icon={faEnvelopeCircleCheck}
          />
          <Title>Email verified Successfully</Title>
          <Text
            style={{
              marginBottom: "10px",
            }}
          >
            Thank you for verifying your email and connecting with us.
          </Text>
          <Text>
            As you now join the community of RePeddle tribe, we’re committed to
            ensure you have the very best experience using RePeddle platforms
            and tools.
          </Text>
          <Link to="/signin">
            <Button>Login</Button>
          </Link>
        </Content>
      )}
    </Container>
  );
}
