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
import { banks, states } from "../constant";

const Label = styled.div``;
export default function VerifyAccountScreen() {
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
          accountName: input.accountName,
          bankName: input.bankName,
          accountNumber: input.accountNumber,
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
    if (!input.accountNumber) {
      handleError("Enter a valid account number", "accountNumber");
      valid = false;
    }
    if (!input.accountName) {
      handleError("Enter a valid account name", "accountName");
      valid = false;
    }
    if (!input.bankName) {
      handleError("Select a valid bank", "bankName");
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
        <title>Verify Account</title>
      </Helmet>

      <h3 className="my-3">Provide Your Bank Account Detail</h3>
      <p>
        To become a Seller, kindly provide your banking details where you can
        transfer your earnings deposited in your Repeddle wallet
      </p>

      <Form onSubmit={validate}>
        <Form.Group className="mb-3" controlId="accountName">
          <Label>Account Name</Label>
          <Input
            type="text"
            error={error.accountName}
            onFocus={() => {
              handleError(null, "accountName");
            }}
            onChange={(e) => handleOnChange(e.target.value, "accountName")}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="accountNumber">
          <Label>Account Number</Label>
          <Input
            type="number"
            error={error.accountNumber}
            onFocus={() => {
              handleError(null, "accountNumber");
            }}
            onChange={(e) => handleOnChange(e.target.value, "accountNumber")}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="bankName">
          <Label>Bank Name</Label>
          <Input
            type="text"
            error={error.bankName}
            onFocus={() => {
              handleError(null, "bankName");
            }}
            onChange={(e) => handleOnChange(e.target.value, "bankName")}
          />
          <FormControl
            sx={{
              margin: 0,
              borderRadius: "0.2rem",
              border: `1px solid ${
                mode === "pagebodydark" ? "var(--dark-ev4)" : "var(--light-ev4)"
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
              onChange={(e) => handleOnChange(e.target.value, "bankName")}
              displayEmpty
            >
              {region() === "NGN"
                ? banks.Nigeria.map((x) => <MenuItem value={x}>{x}</MenuItem>)
                : banks.SouthAfrica.map((x) => (
                    <MenuItem value={x}>{x}</MenuItem>
                  ))}
            </Select>
          </FormControl>
        </Form.Group>
        <div style={{ color: "var(--malon-color)" }}>
          Note: This cannot be change once saved, contact support to make any
          changes.
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
