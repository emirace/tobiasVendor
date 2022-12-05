import React, { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError, GOOGLE_CLIENT_ID, region } from "../utils";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import jwt_decode from "jwt-decode";
import styled from "styled-components";
import Input from "../component/Input";
import OAuth2Login from "react-simple-oauth2-login";
import { login, logout } from "../hooks/initFacebookSdk";
import secureLocalStorage from "react-secure-storage";

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
  font-family: "Google Sans", arial, sans-serif;
  font-size: 14px;
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
  flex-direction: column;
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

export default function SigninScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, mode, redirectToken } = state;

  const handleCallbackResponse = async (response) => {
    console.log("Encoded JWT ID token: " + response.credential);
    var userObject = jwt_decode(response.credential);
    console.log(userObject);
    const { data } = await axios.post(`/api/users/${region()}/google`, {
      tokenId: response.credential,
    });
    console.log(data);
    ctxDispatch({ type: "USER_SIGNIN", payload: data });
    localStorage.setItem("userInfo", JSON.stringify(data));
    window.location.href = `${redirect}?redirecttoken=${redirectToken}`;
  };
  const { innerWidth } = window;
  useEffect(() => {
    /* global google*/
    console.log("google", google);
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCallbackResponse,
    });
    google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      theme: "dark",
      size: "large",
      width: innerWidth > 992 ? 400 : 300,
      logo_alignment: "center",
    });
  }, []);

  const handleFbLogin = async () => {
    window.FB.login(
      function (response) {
        console.log(response.authResponse);
        apiAuthenticate(response.authResponse.accessToken);
      },
      { scope: "public_profile,email", return_scopes: true }
    );
  };

  async function apiAuthenticate(accessToken) {
    // authenticate with the api using a facebook access token,
    // on success the api returns an account object with a JWT auth token
    const response = await axios.post(`/api/users/${region()}/facebook`, {
      accessToken,
    });
    const account = response.data;
    console.log(account);
    //signin here
    ctxDispatch({ type: "USER_SIGNIN", payload: account });
    localStorage.setItem("userInfo", JSON.stringify(account));
    window.location.href = `${redirect}?redirecttoken=${redirectToken}`;
  }
  const submitHandler = async () => {
    try {
      const { data } = await axios.post(`/api/users/${region()}/signin`, {
        email: input.email,
        password: input.password,
      });
      console.log(data);

      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      if (data.isVerifiedEmail) {
        window.location.href = `${redirect}?redirecttoken=${redirectToken}`;
      } else {
        window.location.href = `/verifyemail?redirecttoken=${redirectToken}`;
      }
    } catch (err) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: getError(err),
          showStatus: true,
          state1: "visible1 error",
        },
      });
    }
  };

  const validate = (e) => {
    e.preventDefault();
    let valid = true;
    if (!input.email) {
      handleError("Please enter an email", "email");
      valid = false;
    } else if (
      !input.email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      valid = false;
      handleError("Please enter a valid email", "email");
    }
    if (!input.password) {
      handleError("Please enter password", "password");
      valid = false;
    }

    if (valid) {
      submitHandler();
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const darkMode = (mode) => {
    if (mode) {
      ctxDispatch({ type: "CHANGE_MODE", payload: "pagebodydark" });
      localStorage.setItem("mode", "pagebodydark");
    } else {
      ctxDispatch({ type: "CHANGE_MODE", payload: "pagebodylight" });
      localStorage.setItem("mode", "pagebodylight");
    }
  };

  const handleOnChange = (text, input) => {
    setInput((prevState) => ({ ...prevState, [input]: text.trim() }));
  };
  const handleError = (errorMessage, input) => {
    setError((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign In</title>
      </Helmet>
      <SwitchCont>
        <Switch
          checked={mode === "pagebodydark"}
          onChange={(e) => darkMode(e.target.checked)}
        ></Switch>
        <Label>{mode === "pagebodydark" ? "DarkMode" : "LightMode"}</Label>
      </SwitchCont>
      <h1 className="my-3">Sign In</h1>

      <Social>
        <SocialLogin onClick={handleFbLogin} id="" className="facebook">
          <FacebookImg src="/images/facebook.png" alt="facebook" />
          Sign in with Facebook
        </SocialLogin>
        <div id="signInDiv"></div>
      </Social>

      <Orgroup>
        <Or className={mode}>or</Or>
        <Line />
      </Orgroup>
      <Form onSubmit={validate}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Input
            name="email"
            error={error.email}
            onFocus={() => {
              handleError(null, "email");
            }}
            onChange={(e) => handleOnChange(e.target.value, "email")}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Input
            name="password"
            password
            error={error.password}
            onFocus={() => {
              handleError(null, "password");
            }}
            onChange={(e) => handleOnChange(e.target.value, "password")}
          />
          <ForgetPassword>
            <Link to="/forgetpassword">Forget Password</Link>
          </ForgetPassword>
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
      </Form>
    </Container>
  );
}
