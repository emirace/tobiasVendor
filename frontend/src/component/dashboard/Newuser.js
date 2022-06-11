import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Store } from '../../Store';

const Container = styled.div`
  flex: 4;
  padding: 0 20px;
`;
const Title = styled.h1``;
const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
`;
const Item = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  margin-top: 10px;
  margin-right: 20px;
`;
const Label = styled.label`
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
`;
const Input = styled.input`
  background: none;
  color: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--white-color)' : 'var(--dark-color)'};
  border: 1px solid
    ${(props) =>
      props.mode === 'pagebodydark' ? 'var(--dark-ev3)' : 'var(--light-ev3)'};
  border-radius: 0.2rem;
  height: 40px;
  padding: 10px;
  &:focus-visible {
    outline: 1px solid var(--orange-color);
  }
`;
const Gender = styled.div`
  display: flex;
  align-items: center;

  & input {
    &::after {
      width: 15px;
      height: 15px;
      content: '';
      display: inline-block;
      visibility: visible;
      border-radius: 15px;
      position: relative;
      top: 11px;
      left: -1px;
      background-color: ${(props) =>
        props.mode === 'pagebodydark'
          ? 'var(--black-color)'
          : 'var(--white-color)'};
      border: 1px solid var(--orange-color);
    }
    &:checked::after {
      width: 15px;
      height: 15px;
      content: '';
      display: inline-block;
      visibility: visible;
      border-radius: 15px;
      position: relative;
      top: 11px;
      left: -1px;
      background-color: var(--orange-color);
      border: 1px solid var(--orange-color);
    }
  }
  & label {
    margin: 10px;
    font-size: 18px;
    font-weight: 300;
  }
`;

const Button = styled.button`
  width: 200px;
  border: none;
  background: var(--orange-color);
  color: var(--white-color);
  padding: 7px 10px;
  border-radius: 0.2rem;
  cursor: pointer;
  margin-top: 30px;
`;

export default function Newuser() {
  const { state } = useContext(Store);
  const { mode } = state;
  return (
    <Container>
      <Title>New User</Title>
      <Form>
        <Item>
          <Label>Username</Label>
          <Input mode={mode} type="text" placeholder="John" />
        </Item>
        <Item>
          <Label>Full Name</Label>
          <Input mode={mode} type="text" placeholder="John Doe" />
        </Item>
        <Item>
          <Label>Email</Label>
          <Input mode={mode} type="email" placeholder="John@example.com" />
        </Item>
        <Item>
          <Label>Password</Label>
          <Input mode={mode} type="password" placeholder="password" />
        </Item>
        <Item>
          <Label>Phone</Label>
          <Input mode={mode} type="text" placeholder="+123456789" />
        </Item>
        <Item>
          <Label>Gender</Label>
          <Gender mode={mode}>
            <Input type="radio" name="gender" id="male" value="male" />
            <Label htmlFor="male">Male</Label>
            <Input type="radio" name="gender" id="female" value="female" />
            <Label htmlFor="female">Female</Label>
            <Input type="radio" name="gender" id="other" value="other" />
            <Label htmlFor="other">Other</Label>
          </Gender>
        </Item>
      </Form>
      <Link to="/dashboard/newuser">
        <Button>Create</Button>
      </Link>
    </Container>
  );
}
