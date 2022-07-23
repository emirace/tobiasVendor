import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Store } from "../Store";

const Manual = styled.div`
  margin: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-radius: 0.2rem;
  & svg {
    font-size: 20px;
    margin-left: 15px;
  }
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
`;
const Name = styled.div`
  margin: 0 15px;
  font-weight: bold;
  color: var(--orange-color);
`;
const Full = styled.div``;
const Option = styled.div`
  display: flex;
  align-items: center;
`;
const Edit = styled.div`
  color: var(--malon-color);
  border: 2px solid var(--malon-color);
  padding: 10px;
`;

export default function InfoScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode } = state;
  const [validated, setValidated] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("+234");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state1, setState1] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [manualAddress, setManualAddress] = useState(false);
  const [selectAddress, setSelectAddress] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      const fullName = firstname + " " + lastname;
      const useraddress = {
        fullName,
        email,
        code,
        address,
        phone,
        city,
        state1,
        country,
        postalCode,
      };
      ctxDispatch({ type: "SAVE_USER_ADDRESS", payload: useraddress });
      localStorage.setItem("useraddress", JSON.stringify(useraddress));
      navigate("../payment");
    }

    setValidated(true);
  };

  return (
    <Container>
      <Helmet>
        <title>User Information</title>
      </Helmet>
      <h1 className="mt-5">Select Shipping Address</h1>
      <Manual mode={mode}>
        <Option>
          <Form.Check
            onChange={(e) => {
              setSelectAddress(e.target.checked);
              setManualAddress(false);
            }}
            type="checkbox"
            id="manualshipping"
            checked={selectAddress}
          />
          <FontAwesomeIcon icon={faHouse} />
          <Name>My Home</Name>
          <Full>1 Obazee lane,Off uppper Rd Benin city edo state</Full>
        </Option>
        <Edit>Edit</Edit>
      </Manual>
      <Manual mode={mode}>
        <Form.Check
          className="mb-3"
          onChange={(e) => {
            setSelectAddress(e.target.checked);
            setManualAddress(false);
          }}
          type="checkbox"
          id="manualshipping"
          checked={selectAddress}
          label="Select Shipping Method"
        />
      </Manual>
      <Manual mode={mode}>
        <Form.Check
          className="mb-3"
          onChange={(e) => {
            setManualAddress(e.target.checked);
            setSelectAddress(false);
          }}
          type="checkbox"
          id="manualshipping"
          checked={manualAddress}
          label="Enter Address"
        />
        {manualAddress && (
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            className="my-4"
          >
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="validationCustom01">
                <Form.Label>First name</Form.Label>
                <Form.Control
                  required
                  onChange={(e) => setFirstname(e.target.value)}
                  type="text"
                  defaultValue={firstname}
                  className={mode === "pagebodylight" ? "lightform" : ""}
                  placeholder="First name"
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid first name
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="validationCustom02">
                <Form.Label>Last name</Form.Label>
                <Form.Control
                  required
                  defaultValue={lastname}
                  className={mode === "pagebodylight" ? "lightform" : ""}
                  onChange={(e) => setLastname(e.target.value)}
                  type="text"
                  placeholder="Last name"
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid last name.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  defaultValue={email}
                  className={mode === "pagebodylight" ? "lightform" : ""}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid email.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="formBasicPhine ">
                <Form.Label>Phone number</Form.Label>
                <InputGroup className="mb-3">
                  <Form.Select
                    onChange={(e) => setCode(e.target.value)}
                    id="input-group-dropdown-1"
                  >
                    <option
                      selected={code === "+27" ? true : false}
                      value="+27"
                    >
                      +27
                    </option>
                    <option
                      selected={code === "+234" ? true : false}
                      value="+234"
                    >
                      +234
                    </option>
                  </Form.Select>
                  <Form.Control
                    required
                    type="tel"
                    defaultValue={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={mode === "pagebodylight" ? "lightform" : ""}
                    placeholder="Enter phone number"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid number.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Row>
            <Form.Group className="mb-3" controlId="validationCustom02">
              <Form.Label>Address </Form.Label>
              <Form.Control
                required
                defaultValue={address}
                onChange={(e) => setAddress(e.target.value)}
                className={mode === "pagebodylight" ? "lightform" : ""}
                type="text"
                placeholder="Address"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid address.
              </Form.Control.Feedback>
            </Form.Group>
            <Row className="mb-3">
              <Form.Group as={Col} md="3" controlId="validationCustom03">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={mode === "pagebodylight" ? "lightform" : ""}
                  placeholder="City"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid city.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="validationCustom04">
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={state1}
                  onChange={(e) => setState1(e.target.value)}
                  className={mode === "pagebodylight" ? "lightform" : ""}
                  placeholder="State"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid state.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="validationCustom04">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={mode === "pagebodylight" ? "lightform" : ""}
                  placeholder="Country"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid country.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="3" controlId="validationCustom05">
                <Form.Label>Postal code</Form.Label>
                <Form.Control
                  type="text"
                  defaultValue={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className={mode === "pagebodylight" ? "lightform" : ""}
                  placeholder="Postal code"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid zip.
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Form.Group className="mb-3">
              <Form.Check
                required
                label="Agree to terms and conditions"
                feedback="You must agree before submitting."
                feedbackType="invalid"
              />
            </Form.Group>
            <Button type="submit">Continue</Button>
          </Form>
        )}
      </Manual>
    </Container>
  );
}
