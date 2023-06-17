import React, { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { faArrowRight, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import jwt_decode from "jwt-decode";
import styled from "styled-components";
import Input from "../component/Input";
import Countdown from "react-countdown";
import { signoutHandler } from "../component/Navbar";

const ContinueButton = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  &:hover {
    text-decoration: underline;
  }
`;
const SocialLogin = styled.button`
  border: 0;
  color: white;
  display: flex;
  width: 400px;
  justify-content: center;
  cursor: pointer;
  align-items: center;
  padding: 8px;
  margin: 15px;
  border-radius: 5px;
  font-weight: bold;
  @media (max-width: 992px) {
    width: 300px;
  }

  &.facebook {
    background: #507cc0;
  }
  &.google {
    background: #df4930;
  }
`;
const FacebookImg = styled.img.attrs((props) => ({
  src: props.src,
  alt: props.alt,
}))`
  height: 20px;
  margin-right: 20px;
`;
const Or = styled.div`
  margin: 15px;
  position: relative;
  text-transform: uppercase;
  border: 2px solid var(--orange-color);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
`;
const Line = styled.div`
  position: absolute;
  top: 50%;
  width: 500px;
  height: 2px;
  background: var(--orange-color);
  z-index: 1;
  @media (max-width: 992px) {
    width: 300px;
  }
`;
const Social = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;
const Orgroup = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
`;

const SwitchCont = styled.div`
  padding: 10px 0;
  display: none;
  justify-content: end;
  align-items: center;
  @media (max-width: 992px) {
    display: flex;
  }
`;
const Switch = styled.input.attrs({
  type: "checkbox",
  id: "darkmodeSwitch",
  role: "switch",
})`
  position: relative;

  width: 40px;
  height: 15px;
  -webkit-appearance: none;
  background: #000;
  border-radius: 20px;
  outline: none;
  transition: 0.5s;
  @media (max-width: 992px) {
  }

  &:checked {
    background: #fff;
    &:before {
      left: 25px;
      background: #000;
    }
  }
  &:before {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    content: "";
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    background: #fff;
    transition: 0.5s;
  }
`;
const Label = styled.label.attrs({
  for: "darkmodeSwitch",
})`
  margin-left: 5px;
  @media (max-width: 992px) {
  }
`;

const ForgetPassword = styled.div`
  color: var(--orange-color);
  text-align: right;
  &:hover {
    color: var(--malon-color);
  }
`;

const Para = styled.p`
  @media (max-width: 992px) {
    margin-bottom: 0.5rem;
  }
`;
export default function VerifyEmailScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [input, setInput] = useState({
    number: "",
  });
  const [error, setError] = useState("");

  const [restart, setRestart] = useState(Math.random());
  const [countdown, setCountdown] = useState(false);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, mode } = state;
  // useEffect(() => {
  //   resendEmail();
  // }, [userInfo]);

  // const submitHandler = async () => {
  //   try {
  //     const { data } = await axios.post(
  //       `/api/users/verifyemail`,
  //       {
  //         otp: input.number,
  //       },
  //       {
  //         headers: { Authorization: `Bearer ${userInfo.token}` },
  //       }
  //     );
  //     ctxDispatch({
  //       type: "SHOW_TOAST",
  //       payload: {
  //         message: "Email Verified Successfully",
  //         showStatus: true,
  //         state1: "visible1 success",
  //       },
  //     });
  //     window.location.href = redirect || "/";
  //   } catch (err) {
  //     ctxDispatch({
  //       type: "SHOW_TOAST",
  //       payload: {
  //         message: getError(err),
  //         showStatus: true,
  //         state1: "visible1 error",
  //       },
  //     });
  //     console.log(err);
  //   }
  // };

  const resendEmail = async () => {
    setRestart(Math.random());
    setCountdown(true);
    try {
      const { data } = await axios.get(`/api/users/sendverifyemail`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Email sent Successfully",
          showStatus: true,
          state1: "visible1 success",
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

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
    <Container
      className="small-container"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <Helmet>
        <title>Verify email</title>
      </Helmet>

      <h3 className="my-3">Verify Your Email Address</h3>
      <Para>You're almost there! We will send an email to </Para>
      <Para>
        <b>{userInfo.email}</b>
      </Para>
      <Para style={{ textAlign: "center" }}>
        Just click on the link in that email to verify your email. If you don't
        see it, you may need to <b>check your spam</b> folder.
      </Para>
      <Para>Still can't find the email?</Para>
      <div>
        <button
          disabled={countdown}
          onClick={resendEmail}
          style={{ padding: "7px 25px", fontSize: "15px" }}
          className="search-btn1"
        >
          Resend Email
        </button>
      </div>
      {countdown && (
        <div>
          <span>Try again in</span>
          <Countdown
            date={Date.now() + 120000}
            key={restart}
            onComplete={() => setCountdown(false)}
            renderer={renderer}
          />
        </div>
      )}
      <Para style={{ display: "flex", alignItems: "center" }}>
        If you have already verify your email,{" "}
        <button
          onClick={signoutHandler}
          style={{
            color: "var(--orange-color)",
            fontWeight: "bold",
            background: "none",
            border: 0,
            marginLeft: "5px",
          }}
        >
          Login Again
        </button>
      </Para>
    </Container>
  );
}
