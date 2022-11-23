import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Store } from "../Store";

const Container = styled.div`
  background: ${(props) => (props.mode === "pagebodydark" ? "black" : "white")};
  padding: 20px;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9;
  width: 100%;
  border-radius: 0.2rem;
  box-shadow: ${(props) =>
    props.mode === "pagebodylight "
      ? "0 5px 16px rgba(0, 0, 0, 0.5)"
      : "0 5px 16px rgba(225, 225, 225, 0.5)"};
  @media (max-width: 992px) {
    width: 100%;
    flex-direction: column;
  }
`;
const Title = styled.div`
  font-weight: bold;
`;
const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  margin-left: 20px;
`;
const ButtonNo = styled.div`
  padding: 5px 7px;
  font-weight: bold;
  color: var(--orange-color);
  cursor: pointer;
  margin-right: 20px;
  &:hover {
    color: var(--malon-color);
  }
`;
const ButtonBackgroud = styled.div`
  background: var(--orange-color);
  padding: 5px 7px;
  font-weight: bold;
  color: white;
  cursor: pointer;
  border-radius: 0.2rem;
  &:hover {
    background: var(--malon-color);
  }
`;
export default function AcceptCookies() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode } = state;
  const navigate = useNavigate();
  const handleSubmit = () => {
    ctxDispatch({ type: "SET_COOKIES", payload: true });
  };
  return (
    <Container mode={mode}>
      {/* <Title>Cookies</Title> */}
      <div>
        Cookies are use on this website to ensure we give you the best
        experience. If you continue to use this site that means you agree to the
        use of cookies.
      </div>
      <Buttons>
        <ButtonNo onClick={() => navigate("/privacypolicy")}>
          MORE INFO
        </ButtonNo>
        <ButtonBackgroud onClick={handleSubmit}>Allow Cookies</ButtonBackgroud>
      </Buttons>
    </Container>
  );
}
