import { faTruck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Store } from "../Store";

const Container = styled.div`
  padding: 5px;
  /* background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev2)"}; */
  display: flex;
  align-items: center;
  & svg {
    margin: 0 10px;
  }
`;
const Text = styled.div`
  & a {
    color: var(--orange-color);
    cursor: pointer;
  }
`;
export default function RebundlePoster() {
  const { state } = useContext(Store);
  const { mode } = state;
  return (
    <Container mode={mode}>
      <FontAwesomeIcon icon={faTruck} />
      <Text>
        Free delivery with <Link to="/rebundle">Re:bundle</Link>
      </Text>
    </Container>
  );
}
