import React, { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import jwt_decode from "jwt-decode";
import styled from "styled-components";
import Input from "../component/Input";

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

export default function ResetScreen() {
  const navigate = useNavigate();

  const params = useParams();
  const { token } = params;
  console.log(token);
  const [input, setInput] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, mode } = state;

  const submitHandler = async () => {
    try {
      const { data } = await axios.post(`/api/users/resetpassword/${token}`, {
        password: input.password,
      });
      if (data.success) {
        ctxDispatch({
          type: "SHOW_TOAST",
          payload: {
            message: data.message,
            showStatus: true,
            state1: "visible1 success",
          },
        });
        navigate("/signin");
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

    if (!input.password) {
      handleError("Please enter password", "password");
      valid = false;
    }
    if (!input.password) {
      handleError("Please enter password", "password");
      valid = false;
    } else if (input.password.length < 6) {
      valid = false;
      handleError("Your password must be at least 6 characters", "password");
    } else if (input.password.search(/[a-z]/i) < 0) {
      handleError(
        "Password must contain at least 1 lowercase alphabetical character",
        "password"
      );
      valid = false;
    } else if (input.password.search(/[A-Z]/) < 0) {
      handleError(
        "Password must contain at least 1 uppercase alphabetical character",
        "password"
      );
      valid = false;
    } else if (input.password.search(/[0-9]/) < 0) {
      handleError("Password must contain at least 1 digit", "password");
      valid = false;
    }

    if (!input.confirmPassword) {
      handleError("Please confirm your password", "confirmPassword");
      valid = false;
    } else if (input.password !== input.confirmPassword) {
      handleError("Passwords do not match", "confirmPassword");
      valid = false;
    }

    if (valid) {
      submitHandler();
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

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
    setInput((prevState) => ({ ...prevState, [input]: text }));
  };
  const handleError = (errorMessage, input) => {
    setError((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Reset Password</title>
      </Helmet>

      <h3 className="my-3">Reset Password</h3>

      <Form onSubmit={validate}>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>New Password</Form.Label>
          <Input
            password
            error={error.password}
            onFocus={() => {
              handleError(null, "password");
            }}
            onChange={(e) => handleOnChange(e.target.value, "password")}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Input
            password
            error={error.confirmPassword}
            onFocus={() => {
              handleError(null, "confirmPassword");
            }}
            onChange={(e) => handleOnChange(e.target.value, "confirmPassword")}
          />
        </Form.Group>
        <div className="mb-3">
          <button type="submit" className="search-btn1">
            Reset Password
          </button>
        </div>
      </Form>
    </Container>
  );
}
