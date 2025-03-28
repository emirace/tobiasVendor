import React, { useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import jwt_decode from 'jwt-decode';
import styled from 'styled-components';
import Input from '../component/Input';

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
  type: 'checkbox',
  id: 'darkmodeSwitch',
  role: 'switch',
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
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    background: #fff;
    transition: 0.5s;
  }
`;
const Label = styled.label.attrs({
  for: 'darkmodeSwitch',
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

export default function ForgetScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [input, setInput] = useState({
    email: '',
  });
  const [error, setError] = useState('');

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, mode } = state;

  const submitHandler = async () => {
    try {
      const { data } = await axios.post(`/api/users/forgetpassword`, {
        email: input.email,
      });
      console.log(data);
      if (data.success) {
        navigate('/emailsent');
      }
    } catch (err) {
      ctxDispatch({
        type: 'SHOW_TOAST',
        payload: {
          message: getError(err),
          showStatus: true,
          state1: 'visible1 error',
        },
      });
    }
  };

  const validate = (e) => {
    e.preventDefault();
    let valid = true;
    if (!input.email) {
      handleError('Please enter an email', 'email');
      valid = false;
    } else if (
      !input.email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      valid = false;
      handleError('Please enter a valid email', 'email');
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
      ctxDispatch({ type: 'CHANGE_MODE', payload: 'pagebodydark' });
      localStorage.setItem('mode', 'pagebodydark');
    } else {
      ctxDispatch({ type: 'CHANGE_MODE', payload: 'pagebodylight' });
      localStorage.setItem('mode', 'pagebodylight');
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
        <title>Forget Password</title>
      </Helmet>

      <h3 className="my-3">Forget Password</h3>

      <Form onSubmit={validate}>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Enter Recovery Email</Form.Label>
          <Input
            error={error.email}
            onFocus={() => {
              handleError(null, 'email');
            }}
            onChange={(e) => handleOnChange(e.target.value, 'email')}
          />
        </Form.Group>
        <div className="mb-3">
          <button type="submit" className="search-btn1">
            Reset Password
          </button>
        </div>
        <div className="mb-3">
          Have an account?{'  '}
          <Link to={`/signin?redirect=${redirect}`}> {'  '}Sign in</Link>
        </div>
      </Form>
    </Container>
  );
}
