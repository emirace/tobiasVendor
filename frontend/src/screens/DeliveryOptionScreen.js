import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { Store } from "../Store";
import styled from "styled-components";

const Option = styled.div`
  display: flex;
  align-items: center;
`;
const Label = styled.label`
  margin-left: 10px;
  text-transform: capitalize;
`;
const Radio = styled.input`
  &:checked::after {
    width: 15px;
    height: 15px;
    border-radius: 15px;
    top: -2px;
    left: -1px;
    position: relative;
    background-color: var(--orange-color);
    content: "";
    display: inline-block;
    visibility: visible;
    border: 2px solid white;
  }
`;

const OptionCont = styled.div`
  margin: 10px 0;
`;
const Plans = styled.div`
  & a {
    color: var(--orange-color);
    text-decoration: underline;
  }
`;
const Plan = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 0;
  justify-content: space-between;
`;

const Input = styled.input`
  border: none;
  width: 250px;
  height: 30px;
  border-bottom: 1px solid
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
    border-bottom: 1px solid var(--orange-color);
  }
  &::placeholder {
    font-size: 12px;
  }
`;

export default function DeliveryOptionScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;
  const [deliveryOption, setDeliveryOption] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState();
  const [showMap, setShowMap] = useState(false);
  const [paxiValue, setPaxiValue] = useState("");

  const [union, setUnion] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems.length) {
      cartItems.map((x) => {
        setUnion((prevstate) => [
          ...new Set([...prevstate, ...x.deliveryOption]),
        ]);
      });
    }
    console.log("union", union);
  }, [cartItems]);

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: "SAVE_DELIVERY_METHOD", payload: deliveryMethod });
    localStorage.setItem("deliveryMethod", JSON.stringify(deliveryMethod));
    navigate("/placeorder");
  };

  function receiveMessage(message) {
    if (
      message.origin == "https://map.paxi.co.za" &&
      message.data &&
      message.data.trg === "paxi"
    ) {
      var point = message.data.point;
      /* Modify the code below for your application */

      setDeliveryMethod(message.data);
      console.log(point);
      setPaxiValue(point.shortName);
      /* Add additional logic below (eg: closing modal) */
    }
  }

  useEffect(() => {
    if (window.addEventListener) {
      window.addEventListener("message", receiveMessage, false);
    } else {
      /* support for older browsers (IE 8) */
      window.attachEvent("onmessage", receiveMessage);
    }
  }, []);

  return (
    <div className="container">
      <Helmet>
        <title>Delivery Method</title>
      </Helmet>
      <h1 className="my-3">Delivery Method</h1>

      <Form onSubmit={submitHandler}>
        {union.map((x) => (
          <div className="mb-3" key={x.name}>
            <OptionCont>
              <Option>
                <Radio
                  type="radio"
                  id={x.name}
                  value={x.name}
                  checked={deliveryOption === x.name}
                  onChange={(e) => setDeliveryOption(e.target.value)}
                />
                <Label htmlFor={x.name}>{x.name}</Label>

                {console.log(deliveryOption)}
              </Option>
              {deliveryOption === x.name &&
                deliveryOption === "Paxi PEP store" && (
                  <Plans>
                    <Plan>
                      <Input
                        type="text"
                        onClick={() => setShowMap(true)}
                        placeholder="Choose the closest pick up point"
                        value={paxiValue}
                      />
                    </Plan>
                    {showMap && (
                      <iframe
                        width="100%"
                        height="600"
                        src="https://map.paxi.co.za?size=l,m,s&status=1,3,4&maxordervalue=1000&output=nc,sn&select=true"
                        frameBorder="0"
                        allow="geolocation"
                      ></iframe>
                    )}
                  </Plans>
                )}
            </OptionCont>
          </div>
        ))}
        <div className="mb-3">
          <button
            className="search-btn1"
            style={{ width: "100%" }}
            type="submit"
          >
            Continue
          </button>
        </div>
      </Form>
    </div>
  );
}
