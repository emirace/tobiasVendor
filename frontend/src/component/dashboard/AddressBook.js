import axios from "axios";
import React, { useContext, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { Store } from "../../Store";
import { getError } from "../../utils";
import LoadingBox from "../LoadingBox";
import MessageBox from "../MessageBox";
import ModelLogin from "../ModelLogin";

import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

const Container = styled.div`
  flex: 4;
  margin: 0 20px;
  padding: 20px;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  @media (max-width: 992px) {
    padding: 10px;
    margin: 0;
  }
`;
const TitleCont = styled.div`
  margin-bottom: 20px;
`;
const Title = styled.h1`
  font-size: 28px;
`;
const Content = styled.div``;
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
    props.mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev2)"};
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
  cursor: pointer;
`;
const Option = styled.div`
  display: flex;
  align-items: center;
`;
const Edit = styled.div`
  color: var(--malon-color);
  border: 2px solid var(--malon-color);
  padding: 2px 10px;
  cursor: pointer;
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

export default function AddressBook() {
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
  const [refresh, setRefresh] = useState(false);

  const [deliveryOption, setDeliveryOption] = useState("");
  const [value, setValue] = useState("");
  const [meta, setMeta] = useState("");

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
  }, [refresh]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      try {
        const { data } = await axios.post(
          "/api/addresses",
          {
            meta: { deliveryOption, cost: value, ...meta },
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );

        dispatch({
          type: "FETCH_ADDRESS_SUCCESS",
          payload: { ...addresses, data },
        });
        setShowForm(false);
        setRefresh(!refresh);
        setMeta({});
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
            meta: { deliveryOption, cost: value, ...meta },
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        setShowEditForm(false);
        setRefresh(!refresh);
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

  const deletehandle = async () => {
    try {
      console.log(selected);
      await axios.delete(`/api/addresses/${selected}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setRefresh(!refresh);
    } catch (err) {
      console.log(getError(err));
    }
  };
  return (
    <Container mode={mode}>
      <TitleCont>
        <Title>NewProduct AddressBook</Title>
      </TitleCont>
      <Content>
        {loadingAddress ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox>{error}</MessageBox>
        ) : addresses.length ? (
          addresses.map((address, index) => (
            <Manual key={address._id} mode={mode}>
              <Option>
                <FontAwesomeIcon icon={faHouse} />
                <Name>{address.meta.deliveryOption}</Name>
                <Full></Full>
              </Option>
              <div style={{ display: "flex", gap: "20px" }}>
                <Edit
                  onClick={() => {
                    setShowEditForm(true);
                    handleSelect(address);
                  }}
                >
                  Edit
                </Edit>
                <Edit
                  onClick={() => {
                    handleSelect(address);
                    deletehandle();
                  }}
                >
                  Delete
                </Edit>
              </div>
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
                    onChange={(e) => setName(e.target.value)}
                    type="text"
                    defaultValue={name}
                    className={mode === "pagebodylight" ? "lightform" : ""}
                    placeholder="e.g My Home, My Office"
                  />
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
              <Button type="submit">Add</Button>
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
              <Button type="submit">Edit</Button>
            </Form>
          </FormContainer>
        </ModelLogin>
      </Content>
    </Container>
  );
}
