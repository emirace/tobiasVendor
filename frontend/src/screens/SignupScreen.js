import React, { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Store } from "../Store";
import { toast } from "react-toastify";
import styled from "styled-components";
import { getError } from "../utils";
import jwt_decode from "jwt-decode";
import Input from "../component/Input";

const SocialLogin = styled.button`
  border: 0;
  color: white;
  display: flex;
  justify-content: center;
  cursor: pointer;
  align-items: center;
  padding: 8px;
  margin: 15px;
  border-radius: 5px;
  width: 100%;
  font-weight: bold;

  &.facebook {
    background: #507cc0;
  }
  &.google {
    background: #df4930;
  }
  @media (max-width: 992px) {
    width: 300px;
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
  width: 100%;
`;
const Orgroup = styled.div`
  width: 100%;
  position: relative;
  display: flex;
  justify-content: center;
`;

export default function SignupScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [input, setInput] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, mode } = state;

  const submitHandler = async () => {
    try {
      const { data } = await axios.post("/api/users/signup", {
        username: input.username,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        password: input.password,
        phone: input.phone,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      window.location.href = redirect || "/";
    } catch (err) {
      toast.error(getError(err));
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const handleOnChange = (text, input) => {
    setInput((prevState) => ({ ...prevState, [input]: text }));
  };
  const handleError = (errorMessage, input) => {
    setError((prevState) => ({ ...prevState, [input]: errorMessage }));
  };
  const validate = (e) => {
    e.preventDefault();
    let valid = true;
    if (!input.username) {
      handleError("Please enter your username", "username");
      valid = false;
    }
    if (!input.firstName) {
      handleError("Please enter your firstname", "firstName");
      valid = false;
    }
    if (!input.lastName) {
      handleError("Please enter your lastname", "lastName");
      valid = false;
    }
    if (!input.phone) {
      handleError("Please enter your phone number", "phone");
      valid = false;
    }
    if (!input.confirmPassword) {
      handleError("Please confirm your password", "confirmPassword");
      valid = false;
    } else if (input.password !== input.confirmPassword) {
      handleError("Passwords do not match", "confirmPassword");
      valid = false;
    }
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
      handleError("Please input a valid email", "email");
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

    if (valid) {
      submitHandler();
    }
  };
  return (
    <Container className="small-container">
      <Helmet>
        <title>Sign Up</title>
      </Helmet>
      <h1 className="my-3">Sign Up</h1>
      <Social>
        <SocialLogin id="" className="facebook">
          <FacebookImg src="/images/facebook.png" alt="facebook" />
          Facebook
        </SocialLogin>
        <SocialLogin id="" className="google">
          <FacebookImg src="/images/google.png" alt="google" />
          Google
        </SocialLogin>
        <Orgroup>
          <Or className={mode}>or</Or>
          <Line />
        </Orgroup>
      </Social>
      <Form onSubmit={validate}>
        <Form.Group
          className="mb-3"
          controlId="name"
          onClick={() => setShowForm(true)}
        >
          <Form.Label>UserName</Form.Label>
          <Input
            error={error.username}
            onFocus={() => {
              handleError(null, "username");
            }}
            onChange={(e) => handleOnChange(e.target.value, "username")}
          />
        </Form.Group>
        {showForm && (
          <>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>First Name</Form.Label>
              <Input
                error={error.firstName}
                onFocus={() => {
                  handleError(null, "firstName");
                }}
                onChange={(e) => handleOnChange(e.target.value, "firstName")}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Last Name</Form.Label>
              <Input
                error={error.lastName}
                onFocus={() => {
                  handleError(null, "lastName");
                }}
                onChange={(e) => handleOnChange(e.target.value, "lastName")}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Input
                error={error.email}
                onFocus={() => {
                  handleError(null, "email");
                }}
                onChange={(e) => handleOnChange(e.target.value, "email")}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Phone</Form.Label>
              <Input
                error={error.phone}
                onFocus={() => {
                  handleError(null, "phone");
                }}
                onChange={(e) => handleOnChange(e.target.value, "phone")}
                type="number"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Input
                error={error.password}
                onFocus={() => {
                  handleError(null, "password");
                }}
                onChange={(e) => handleOnChange(e.target.value, "password")}
                password
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Input
                error={error.confirmPassword}
                onFocus={() => {
                  handleError(null, "confirmPassword");
                }}
                onChange={(e) =>
                  handleOnChange(e.target.value, "confirmPassword")
                }
                password
              />
            </Form.Group>
          </>
        )}

        <div className="mb-3">
          <button type="submit" className="search-btn1">
            Sign Up
          </button>
        </div>
        <div className="mb-3">
          Already have an account?{" "}
          <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
        </div>
      </Form>
    </Container>
  );
}
