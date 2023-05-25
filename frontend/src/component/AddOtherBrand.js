import React, { useContext, useState } from "react";
import styled from "styled-components";
import { Store } from "../Store";
import axios from "axios";
import { getError } from "../utils";
import LoadingBox from "./LoadingBox";

const Container = styled.div`
  padding: 30px;
`;
const Item = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;
const Label = styled.label`
  margin-bottom: 5px;
  font-size: 14px;
  & svg {
    margin-right: 10px;
  }
`;
const TextInput = styled.input`
  border: none;
  width: 250px;
  height: 30px;
  border: 1px solid
    ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev3)" : "var(--light-ev3)"};
  background: none;
  padding-left: 10px;
  color: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--white-color)"
      : "var(--black-color)"};
  &:focus {
    outline: none;
    border: 1px solid var(--orange-color);
  }
  &::placeholder {
    font-size: 12px;
  }
`;
const UploadButton = styled.button`
  margin-top: 5px;
  border: none;
  border-radius: 0.2rem;
  cursor: pointer;
  padding: 5px;
  background: var(--orange-color);
  color: var(--white-color);
`;

export default function AddOtherBrand({ setShowOtherBrand, handleOnChange }) {
  const { state } = useContext(Store);
  const { mode, userInfo } = state;
  const [brand, setBrand] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addOtherBrand = async () => {
    console.log(brand);
    try {
      setIsLoading(true);
      await axios.post(
        `/api/otherbrands`,
        { name: brand },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      handleOnChange("Other", "brand");
      setIsLoading(false);
      setShowOtherBrand(false);
    } catch (error) {
      setIsLoading(false);
      setError(getError(error));
    }
  };

  return (
    <Container>
      <Item>
        <Label>Enter brand name</Label>
        <TextInput
          mode={mode}
          name="brand"
          type="text"
          onChange={(e) => setBrand(e.target.value)}
          onFocus={() => setError("")}
        />
      </Item>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {isLoading ? (
        <LoadingBox />
      ) : (
        <UploadButton onClick={addOtherBrand}>Add</UploadButton>
      )}
    </Container>
  );
}
