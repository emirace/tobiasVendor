import React, { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError, region } from "../utils";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import jwt_decode from "jwt-decode";
import styled from "styled-components";

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
`;
const Social = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Orgroup = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
`;

export default function Signin() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, mode } = state;

  async function responseGoogle(res) {
    const profile = jwt_decode(res.credential);
    console.log(res);
    console.log(profile);
    const { data } = await axios.post("/api/users/google-signin", {
      name: profile.name,
      email: profile.email,
      image: profile.picture,
    });
    console.log(data);
    ctxDispatch({ type: "USER_SIGNIN", payload: data });
    localStorage.setItem("userInfo", JSON.stringify(data));
    navigate(redirect || "/");
  }
  // useEffect(() => {
  //   /*global google*/
  //   google.accounts.id.initialize({
  //     client_id:
  //       "359040935611-ilvv0jgq9rfqj3io9b7av1rfgukqolbu.apps.googleusercontent.com",
  //     callback: responseGoogle,
  //   });
  //   google.accounts.id.renderButton(document.getElementById("signindiv"), {
  //     width: "500px",
  //   });
  // }, []);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/api/users/${region()}/signin`, {
        email,
        password,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      window.location.href = redirect || "/signin";
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);
  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <h1 className="my-3">Sign In</h1>
      <Social>
        <SocialLogin id="" className="facebook">
          <FacebookImg src="/images/facebook.png" alt="facebook" />
          Facebook
        </SocialLogin>
        <SocialLogin id="" className="google">
          <FacebookImg src="/images/google.png" alt="google" />
          Facebook
        </SocialLogin>
        <Orgroup>
          <Or className={mode}>or</Or>
          <Line />
        </Orgroup>
      </Social>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            required
            className={mode === "pagebodydark" ? "hhf" : "color_black"}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <div className="mb-3">
          <button type="submit" className="search-btn1">
            Sign In
          </button>
        </div>
        <div className="mb-3">
          New customer?{"  "}
          <Link to={`/signup?redirect=${redirect}`}>
            {" "}
            {"  "}Create your account
          </Link>
        </div>

        <ContinueButton>
          <Link to="/info">
            Continue without Signing in <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </ContinueButton>
      </Form>
    </Container>
  );
}
