import { faBan, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Store } from "../../Store";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Content = styled.div`
  max-width: 600px;
  border-radius: 10px;
  margin-top: 40px;
  margin-bottom: 40px;
  box-shadow: 0px 0px 35px 0px var(--orange-color);
  padding: 50px 50px 50px 50px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;
const Title = styled.h3``;
const Text = styled.div`
  max-width: 600px;
  text-align: center;
`;
const Button = styled.button`
  background: var(--orange-color);
  border: 0;
  color: white;
  padding: 8px;
  border-radius: 0.2rem;
  &:hover {
    background: var(--malon-color);
  }
`;

export default function DeletedScreen() {
  const { state } = useContext(Store);
  const { mode } = state;
  const navigate = useNavigate();

  return (
    <Container mode={mode}>
      <Content>
        <div
          style={{
            // marginBottom: "30px",
            color: "var(--malon-color)",
            fontSize: "150px",
          }}
        >
          404
        </div>
        <Title>Page not found</Title>
        <Text
          style={{
            marginBottom: "30px",
          }}
        >
          Looks like this page is missing, if you still need help, please
          contact support on{" "}
          <Link to="/articles" style={{ color: "var(--orange-color)" }}>
            Support center
          </Link>
        </Text>
        <Button onClick={() => navigate("/")}>Go To Homepage</Button>
      </Content>
    </Container>
  );
}
