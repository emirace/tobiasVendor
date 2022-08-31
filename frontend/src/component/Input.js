import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import styled from "styled-components";
import { Store } from "../Store";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  border-radius: 0.2rem;
  border: 1px solid;
  width: 100%;
`;

const TextInput = styled.input`
  background: none;
  color: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--white-color)"
      : "var(--black-color)"};
  width: 100%;
  border: 0;
  padding: 10px 10px 10px 0;
  height: 40px;
  &:focus-visible {
    outline: none;
    border: 0;
  }
`;

const Error = styled.div`
  color: var(--red-color);
`;

export default function Input({
  password,
  error,
  onFocus = () => {},
  ...props
}) {
  const { state } = useContext(Store);
  const { mode } = state;
  const [hidePassword, setHidePassword] = useState(true);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <div
      style={{
        marginButtom: "10px",
      }}
    >
      <Container
        style={{
          borderColor: error
            ? "var(--red-color)"
            : isFocus
            ? "var(--orange-color)"
            : "",
        }}
      >
        <TextInput
          mode={mode}
          type={password && hidePassword ? "password" : "text"}
          onFocus={() => {
            onFocus();
            setIsFocus(true);
          }}
          onBlur={() => setIsFocus(false)}
          {...props}
        />
        {password && (
          <FontAwesomeIcon
            onClick={() => setHidePassword(!hidePassword)}
            color="var(--orange-orange)"
            icon={hidePassword ? faEye : faEyeSlash}
          />
        )}
      </Container>
      {error && <Error>{error}</Error>}
    </div>
  );
}
