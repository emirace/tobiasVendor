import { faKey, faShield } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import styled from "styled-components";
import { Store } from "../Store";
import BuyersPro from "./info/BuyersPro";
import Model from "./Model";

const Container = styled.div`
  margin: 5px;
  padding: 20px;
  border-radius: 0.2rem;
  display: flex;
  cursor: pointer;
  border: 1px solid
    ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev3)" : "var(--light-ev3)"};
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  align-items: center;
  & svg {
    font-size: 25px;
    color: var(--orange-color);
    margin-right: 10px;
  }
`;

export default function ProtectionRight() {
  const { state } = useContext(Store);
  const { mode } = state;

  const [showModel, setShowModel] = useState(false);

  return (
    <div>
      <Container mode={mode} onClick={() => setShowModel(!showModel)}>
        <FontAwesomeIcon icon={faKey} /> Buyer's & Seller's Protection !
      </Container>
      <Model showModel={showModel} setShowModel={setShowModel}>
        <BuyersPro />
      </Model>
    </div>
  );
}
