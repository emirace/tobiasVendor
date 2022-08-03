import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Store } from "../../Store";
import { getError } from "../../utils";

const Container = styled.div`
  flex: 1;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  padding: 20px;
  margin-right: 20px;
  border-radius: 0.2rem;
`;
const Tittle = styled.div`
  font-size: 22px;
  font-weight: 600;
`;
const List = styled.ul``;
const ListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0;
`;
const Img = styled.img.attrs((props) => ({
  src: props.src,
  alt: props.alt,
}))`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;
const User = styled.div`
  display: flex;
  flex-direction: column;
`;
const Username = styled.span`
  font-weight: 600;
`;
const Role = styled.span`
  font-weight: 300;
`;
const Button = styled.button`
  display: flex;
  align-items: center;
  border: none;
  border-radius: 0.2rem;
  padding: 5px 10px;
  background: var(--orange-color);
  color: var(--white-color);
  cursor: pointer;
  & svg {
    font-size: 16px;
    margin-right: 5px;
  }
`;

export default function WidgetSmallProduct({ products }) {
  const { state } = useContext(Store);
  const { mode } = state;

  return (
    <Container mode={mode}>
      <Tittle>My New Added Product</Tittle>
      <List>
        {products &&
          products.map((u, index) => (
            <ListItem key={index}>
              <Img src={u.image} alt="profile" />
              <User>
                <Username>{u.name}</Username>
                <Role>{u.category}</Role>
              </User>
              <Link to={`/product/${u.slug}`}>
                <Button>
                  <FontAwesomeIcon icon={faEye} /> View
                </Button>
              </Link>
            </ListItem>
          ))}
      </List>
    </Container>
  );
}
