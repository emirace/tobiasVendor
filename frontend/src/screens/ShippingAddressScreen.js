import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import InputGroup from 'react-bootstrap/InputGroup';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import CheckoutSteps from '../component/CheckoutSteps';
import SelectOPtion from '../component/SelectOPtion';

export default function ShippingAddressScreen() {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    userInfo,
    mode,
    useraddress,
    cart: { shippingAddress },
  } = state;
  const [validated, setValidated] = useState('');
  const [firstname, setFirstname] = useState(shippingAddress.fullName || '');
  const [lastname, setLastname] = useState(shippingAddress.fullName || '');
  const [email, setEmail] = useState(shippingAddress.email || '');
  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [code, setCode] = useState(shippingAddress.code || '');
  const [phone, setPhone] = useState(shippingAddress.code || '');
  const [state1, setState1] = useState(shippingAddress.state1 || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );
  const [country, setCountry] = useState(shippingAddress.country || '');

  const [confirmAddress, setConfirmAdress] = useState(false);
  useEffect(() => {});

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    event.preventDefault();
    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      const data = () => {
        if (confirmAddress && useraddress) {
          const useraddress1 = useraddress;
          return useraddress1;
        } else {
          const fullName = firstname + ' ' + lastname;
          const useraddress1 = {
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
          return useraddress1;
        }
      };
      ctxDispatch({ type: 'SAVE_SHIPPING_ADDRESS', payload: data() });
      localStorage.setItem('useraddress', JSON.stringify(data()));
      localStorage.setItem('shippingAddress', JSON.stringify(data()));
      navigate('/payment');
    }

    setValidated(true);
  };

  return (
    <div>
      <Helmet>
        <title>Shipping Address</title>
      </Helmet>
      <div className="container ">
        <h1 className="my-3">Shipping Address</h1>
        {useraddress && (
          <Form.Check
            className="mb-3"
            onChange={(e) => setConfirmAdress(e.target.checked)}
            type="checkbox"
            id="confirmshipping"
            checked={confirmAddress}
            label="Shipping address is the same as my address"
          />
        )}

        <Form
          onSubmit={handleSubmit}
          noValidate
          validated={validated}
          className="my-4"
        >
          {!confirmAddress && (
            <>
              <Form.Label className="mb-3 orange">
                Enter full receiver detail
              </Form.Label>

              <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="validationCustom01">
                  <Form.Label>First name</Form.Label>
                  <Form.Control
                    required
                    onChange={(e) => setFirstname(e.target.value)}
                    type="text"
                    defaultValue={firstname}
                    className={mode === 'pagebodylight' ? 'lightform' : ''}
                    placeholder="First name"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid name
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group as={Col} md="6" controlId="validationCustom01">
                  <Form.Label>Last name</Form.Label>
                  <Form.Control
                    required
                    onChange={(e) => setLastname(e.target.value)}
                    type="text"
                    defaultValue={lastname}
                    className={mode === 'pagebodylight' ? 'lightform' : ''}
                    placeholder="First name"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid name
                  </Form.Control.Feedback>
                </Form.Group>
              </Row>
              <Row className="mb-3">
                <Form.Group as={Col} md="6" controlId="formBasicEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    defaultValue={email}
                    className={mode === 'pagebodylight' ? 'lightform' : ''}
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
                        selected={code === '+27' ? true : false}
                        value="+27"
                      >
                        +27
                      </option>
                      <option
                        selected={code === '+234' ? true : false}
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
                      className={mode === 'pagebodylight' ? 'lightform' : ''}
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
                  className={mode === 'pagebodylight' ? 'lightform' : ''}
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
                    className={mode === 'pagebodylight' ? 'lightform' : ''}
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
                    className={mode === 'pagebodylight' ? 'lightform' : ''}
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
                    className={mode === 'pagebodylight' ? 'lightform' : ''}
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
                    className={mode === 'pagebodylight' ? 'lightform' : ''}
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
            </>
          )}
          <Button type="submit">Continue</Button>
        </Form>
      </div>
    </div>
  );
}
