import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ModelLogin from "../component/ModelLogin";
import { Store } from "../Store";
import LoadingBox from "../component/LoadingBox";
import MessageBox from "../component/MessageBox";
import { getError } from "../utils";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";

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
  text-transform: capitalize;
`;
const Full = styled.div``;
const FormContainer = styled.div`
  padding: 20px;
`;
const Add = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  color: var(--malon-color);
  font-weight: 500;
`;
const Option = styled.div`
  display: flex;
  align-items: center;
`;
const Edit = styled.div`
  color: var(--malon-color);
  border: 2px solid var(--malon-color);
  padding: 2px 10px;
`;

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ADDRESS_REQUEST":
      return { ...state, loadingAddress: true };
    case "FETCH_ADDRESS_SUCCESS":
      return {
        ...state,
        loadingAddress: false,
        addresses: action.payload,
        error: "",
      };

    case "FETCH_ADDRESS_FAILED":
      return { ...state, loadingAddress: false, error: action.payload };
    default:
      return state;
  }
};

export default function InfoScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo } = state;
  const [validated, setValidated] = useState("");
  const [name, setName] = useState("");
  const [apartment, setApartment] = useState("");
  const [street, setStreet] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [state1, setState1] = useState("");
  const [country, setCountry] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selected, setSelected] = useState(null);

  const navigate = useNavigate();
  const [{ loadingAddress, error, addresses }, dispatch] = useReducer(reducer, {
    loadingAddress: true,
    error: "",
    addresses: null,
  });

  useEffect(() => {
    dispatch({ type: "FETCH_ADDRESS_REQUEST" });
    const getAddress = async () => {
      try {
        const { data } = await axios.get(`/api/addresses/${userInfo._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_ADDRESS_SUCCESS", payload: data });

        console.log(data);
      } catch (err) {
        dispatch({ type: "FETCH_ADDRESS_FAILED" });
        console.log(getError(err));
      }
    };
    getAddress();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      const useraddress = {
        name,
        zipcode: postalCode,
        street: street,
        city,
        state: state1,
        country,
        apartment,
      };
      try {
        const { data } = await axios.post(
          "/api/addresses",
          {
            name,
            zipcode: postalCode,
            street: street,
            city,
            state: state1,
            country,
            apartment,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );

        ctxDispatch({ type: "SAVE_USER_ADDRESS", payload: useraddress });
        localStorage.setItem("useraddress", JSON.stringify(useraddress));
        navigate("../payment");
      } catch (err) {
        console.log(getError(err));
      }
    }

    setValidated(true);
  };
  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      try {
        const { data } = await axios.put(
          `/api/addresses/${selected}`,
          {
            name,
            zipcode: postalCode,
            street: street,
            city,
            state: state1,
            country,
            apartment,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        setShowEditForm(false);
      } catch (err) {
        console.log(getError(err));
      }
    }

    setValidated(true);
  };

  const handleSelect = (item) => {
    console.log(item);
    setName(item.name);
    setPostalCode(item.zipcode);
    setStreet(item.street);
    setCity(item.city);
    setState1(item.state);
    setCountry(item.country);
    setApartment(item.apartment);
    setSelected(item._id);
  };
  const handleContinue = () => {
    if (name) {
      const useraddress = {
        fullName: name,
        postalCode: postalCode,
        address: street,
        city,
        state: state1,
        country,
        apartment,
      };
      console.log(useraddress);
      ctxDispatch({ type: "SAVE_USER_ADDRESS", payload: useraddress });
      localStorage.setItem("useraddress", JSON.stringify(useraddress));
      localStorage.setItem("shippingAddress", JSON.stringify(useraddress));
      navigate("../payment");
    } else {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Select shipping address",
          showStatus: true,
          state1: "visible1 error",
        },
      });
    }
  };
  return (
    <Container>
      <Helmet>
        <title>User Information</title>
      </Helmet>
      <h1 className="mt-5">Select Shipping Address</h1>
      {loadingAddress ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox>{error}</MessageBox>
      ) : addresses.length ? (
        addresses.map((address, index) => (
          <Manual key={index} mode={mode} onClick={() => handleSelect(address)}>
            <Option>
              <Form.Check
                type="checkbox"
                readOnly
                id="manualshipping"
                checked={selected === address._id}
              />
              <FontAwesomeIcon icon={faHouse} />
              <Name>{address.name}</Name>
              <Full>
                {address.apartment}, {address.street}, {address.city},{" "}
                {address.state}, {address.country}{" "}
              </Full>
            </Option>
            <Edit onClick={() => setShowEditForm(true)}>Edit</Edit>
          </Manual>
        ))
      ) : (
        <MessageBox>
          You have not added a shipping address, add one now.
        </MessageBox>
      )}
      <Add onClick={() => setShowForm(true)}>Add New Shipping Address</Add>
      <ModelLogin showModel={showForm} setShowModel={setShowForm}>
        <FormContainer>
          <h3>Add Address</h3>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            className="my-4"
          >
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="validationCustom01">
                <Form.Label>Address Label</Form.Label>
                <Form.Control
                  required
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  defaultValue={name}
                  className={mode === "pagebodylight" ? "lightform" : ""}
                  placeholder="e.g My Home"
                />
                <Form.Control.Feedback type="invalid">
                  Please provide an address label.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="validationCustom02">
                <Form.Label>Apartment</Form.Label>
                <Form.Control
                  defaultValue={apartment}
                  className={mode === "pagebodylight" ? "lightform" : ""}
                  onChange={(e) => setApartment(e.target.value)}
                  type="text"
                  placeholder="Enter your apartment"
                />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="validationCustom02">
              <Form.Label>Street </Form.Label>
              <Form.Control
                required
                defaultValue={street}
                onChange={(e) => setStreet(e.target.value)}
                className={mode === "pagebodylight" ? "lightform" : ""}
                type="text"
                placeholder="Enter full adderess"
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
                <Form.Label>State, Region, Province</Form.Label>
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
        </FormContainer>
      </ModelLogin>
      <ModelLogin showModel={showEditForm} setShowModel={setShowEditForm}>
        <FormContainer>
          <h3>Edit Address</h3>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleEditSubmit}
            className="my-4"
          >
            <Row className="mb-3">
              <Form.Group as={Col} md="6" controlId="validationCustom01">
                <Form.Label>Address Label</Form.Label>
                <Form.Control
                  required
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  defaultValue={name}
                  className={mode === "pagebodylight" ? "lightform" : ""}
                  placeholder="e.g My Home"
                />
                <Form.Control.Feedback type="invalid">
                  Please provide an address label.
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col} md="6" controlId="validationCustom02">
                <Form.Label>Apartment</Form.Label>
                <Form.Control
                  defaultValue={apartment}
                  className={mode === "pagebodylight" ? "lightform" : ""}
                  onChange={(e) => setApartment(e.target.value)}
                  type="text"
                  placeholder="Enter your apartment"
                />
              </Form.Group>
            </Row>

            <Form.Group className="mb-3" controlId="validationCustom02">
              <Form.Label>Street </Form.Label>
              <Form.Control
                required
                defaultValue={street}
                onChange={(e) => setStreet(e.target.value)}
                className={mode === "pagebodylight" ? "lightform" : ""}
                type="text"
                placeholder="Enter full adderess"
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
                <Form.Label>State, Region, Province</Form.Label>
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
        </FormContainer>
      </ModelLogin>
      <div style={{ marginBottom: 20 }}>
        <Button onClick={handleContinue}>Continue</Button>
      </div>
    </Container>
  );
}
