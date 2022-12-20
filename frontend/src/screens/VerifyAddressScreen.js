import React, { useContext, useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { Store } from "../Store";
import { getError, region } from "../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Input from "../component/Input";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { states } from "../constant";

const Label = styled.div``;
export default function VerifyAddressScreen() {
  const navigate = useNavigate();
  const [input, setInput] = useState({
    number: "",
  });
  const [error, setError] = useState("");

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo, mode } = state;

  const submitHandler = async () => {
    try {
      const { data } = await axios.put(
        `/api/users/profile`,
        {
          address: {
            state: input.state,
            street: input.street,
            apartment: input.apartment,
            zipcode: input.zipcode,
          },
          isSeller: true,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Account Verified Successfully",
          showStatus: true,
          state1: "visible1 success",
        },
      });
      navigate("/newproduct");
    } catch (err) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: getError(err),
          showStatus: true,
          state1: "visible1 error",
        },
      });
      console.log(err);
    }
  };

  const validate = (e) => {
    e.preventDefault();
    let valid = true;
    if (!input.street) {
      handleError("Enter your street", "street");
      valid = false;
    }
    if (!input.apartment) {
      handleError("Enter your apartment", "apartment");
      valid = false;
    }
    if (!input.province) {
      handleError("Select your province", "province");
      valid = false;
    }
    if (!input.zipcode) {
      handleError("Enter your zip code", "zipcode");
      valid = false;
    }

    if (valid) {
      submitHandler();
    }
  };

  const handleOnChange = (text, input) => {
    setInput((prevState) => ({ ...prevState, [input]: text }));
  };
  const handleError = (errorMessage, input) => {
    setError((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Verify Address</title>
      </Helmet>

      <h3 className="my-3">Provide Your Receive/Return Address</h3>
      <p>
        The provided address may be use for return should there be a need. This
        address is not displayed to buyers.
      </p>

      <Form onSubmit={validate}>
        <Form.Group className="mb-3" controlId="street">
          <Label>Street</Label>
          <Input
            type="text"
            error={error.street}
            onFocus={() => {
              handleError(null, "street");
            }}
            onChange={(e) => handleOnChange(e.target.value, "street")}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="apartment">
          <Label>Apartment</Label>
          <Input
            type="apartment"
            error={error.apartment}
            onFocus={() => {
              handleError(null, "apartment");
            }}
            onChange={(e) => handleOnChange(e.target.value, "apartment")}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="bankName">
          <Label> {region() === "NGN" ? "State" : "Province"}</Label>
          <FormControl
            sx={{
              margin: 0,
              width: "100%",
              borderRadius: "0.2rem",
              border: `1px solid  ${
                mode === "pagebodydark" ? "white" : "black"
              }`,
              "& .MuiOutlinedInput-root": {
                color: `${
                  mode === "pagebodydark"
                    ? "var(--white-color)"
                    : "var(--black-color)"
                }`,
                "&:hover": {
                  outline: "none",
                  border: 0,
                },
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "0 !important",
              },
            }}
            size="small"
          >
            <Select
              value={input.state}
              onChange={(e) => handleOnChange(e.target.value, "state")}
              displayEmpty
            >
              {region() === "NGN"
                ? states.Nigeria.map((x) => <MenuItem value="x">{x}</MenuItem>)
                : states.SouthAfrican.map((x) => (
                    <MenuItem value={x}>{x}</MenuItem>
                  ))}
            </Select>
          </FormControl>
          {error.province && (
            <div style={{ color: "red" }}>{error.province}</div>
          )}
        </Form.Group>
        <Form.Group className="mb-3" controlId="zipcode">
          <Label>Zip Code</Label>
          <Input
            type="number"
            error={error.zipcode}
            onFocus={() => {
              handleError(null, "zipcode");
            }}
            onChange={(e) => handleOnChange(e.target.value, "zipcode")}
          />
        </Form.Group>
        <div style={{ color: "var(--malon-color)" }}>
          Note: This can be editted later in your profile screen
        </div>
        <div className="mb-3">
          <button type="submit" className="search-btn1">
            <FontAwesomeIcon style={{ marginRight: "10px" }} icon={faCheck} />{" "}
            Save
          </button>
        </div>
        {/* <div className="mb-3">
          Didn't received verification code
          <span
            style={{ cursor: "pointer", color: "var(--orange-color)" }}
            onClick={resendEmail}
          >
            {" "}
            {"  "}Send again
          </span>
        </div> */}
      </Form>
    </Container>
  );
}
