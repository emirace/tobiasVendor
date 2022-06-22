import React, { useContext, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { getError } from '../utils';
import jwt_decode from 'jwt-decode';

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

export default function SignupScreen() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get('redirect');
  const redirect = redirectInUrl ? redirectInUrl : '/';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showForm, setShowForm] = useState(false);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, mode } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      const { data } = await axios.post('/api/users/signup', {
        name,
        email,
        password,
        phone,
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      window.location.href = redirect || '/';
    } catch (err) {
      toast.error(getError(err));
    }
  };
  async function responseGoogle(res) {
    const profile = jwt_decode(res.credential);
    const { data } = await axios.post('/api/users/google-signup', {
      name: profile.name,
      email: profile.email,
      image: profile.picture,
    });
    console.log(data);
    ctxDispatch({ type: 'USER_SIGNIN', payload: data });
    localStorage.setItem('userInfo', JSON.stringify(data));
    navigate(redirect || '/');
  }
  useEffect(() => {
    /*global google*/
    google.accounts.id.initialize({
      client_id:
        '359040935611-ilvv0jgq9rfqj3io9b7av1rfgukqolbu.apps.googleusercontent.com',
      callback: responseGoogle,
    });
    google.accounts.id.renderButton(document.getElementById('signindiv'), {
      width: '500px',
    });
  }, []);

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

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
        <div id="signindiv"></div>
        <Orgroup>
          <Or className={mode}>or</Or>
          <Line />
        </Orgroup>
      </Social>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            required
            className={mode === 'pagebodydark' ? 'hhf' : 'color_black'}
            onClick={() => setShowForm(true)}
            onChange={(e) => setName(e.target.value)}
          />
        </Form.Group>
        {showForm && (
          <>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                className={mode === 'pagebodydark' ? 'hhf' : 'color_black'}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="phone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                className={mode === 'pagebodydark' ? 'hhf' : 'color_black'}
                type="number"
                required
                onChange={(e) => setPhone(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                className={mode === 'pagebodydark' ? 'hhf' : 'color_black'}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                className={mode === 'pagebodydark' ? 'hhf' : 'color_black'}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
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
          Already have an account?{' '}
          <Link to={`/signin?redirect=${redirect}`}>Sign-In</Link>
        </div>
      </Form>
    </Container>
  );
}
