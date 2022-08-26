import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { Store } from "../Store";
import styled from "styled-components";

const Container = styled.div`
  margin: 30px;
`;
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
    width: 20px;
    height: 20px;
    border-radius: 20px;
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
  & a.link {
    color: var(--orange-color);
    font-size: 14px;
    padding-left: 10px;
    text-decoration: underline;
    font-weight: 400;
  }
`;
const Plan = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
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
    font-size: 14px;
  }
`;

export default function DeliveryOptionScreen({ setShowModel, item }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
    mode,
  } = state;
  const [deliveryOption, setDeliveryOption] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [paxiValue, setPaxiValue] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [locker, setLocker] = useState("");
  const [meta, setMeta] = useState("");
  const [value, setValue] = useState("");

  const [union, setUnion] = useState([]);
  const navigate = useNavigate();

  // useEffect(() => {
  //   if (cartItems.length) {
  //     cartItems.map((x) => {
  //       setUnion((prevstate) => [
  //         ...new Set([...prevstate, ...x.deliveryOption]),
  //       ]);
  //     });
  //   }
  //   console.log("union", union);
  // }, [cartItems]);

  const submitHandler = (e) => {
    e.preventDefault();
    const deliverySelect = {
      trg: deliveryOption,
      phone: phone,
      meta: meta,
      value: value,
    };
    console.log(deliverySelect);
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: {
        ...item,
        deliverySelect,
      },
    });
    ctxDispatch({ type: "SAVE_DELIVERY_METHOD", payload: deliverySelect });
    setShowModel(false);
    // navigate("/placeorder");
  };

  function receiveMessage(message) {
    if (
      message.origin == "https://map.paxi.co.za" &&
      message.data &&
      message.data.trg === "paxi"
    ) {
      var point = message.data.point;
      /* Modify the code below for your application */
      setMeta(point);
      console.log(message.data);
      setPaxiValue(point.shortName);
      setShowMap(false);
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
    <Container>
      <div>
        <Helmet>
          <title>Delivery Method</title>
        </Helmet>
        <h1 className="my-3">Delivery Method</h1>
        {console.log(item)}

        <Form onSubmit={submitHandler}>
          {item.deliveryOption.map((x) => (
            <div className="mb-3" key={x.name}>
              <OptionCont>
                <Option>
                  <Radio
                    type="radio"
                    id={x.name}
                    value={x.name}
                    checked={deliveryOption === x.name}
                    onChange={(e) => {
                      setDeliveryOption(e.target.value);
                      setValue(x.value);
                      setMeta("");
                    }}
                  />
                  <Label htmlFor={x.name}>
                    {x.name} {x.value === 1 ? "" : `+ $${x.value}`}
                  </Label>
                </Option>
                {deliveryOption === x.name ? (
                  deliveryOption === "Paxi PEP store" ? (
                    <Plans>
                      <Plan>
                        <Input
                          type="text"
                          onClick={() => setShowMap(true)}
                          placeholder="Choose the closest pick up point"
                          defaultValue={paxiValue}
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
                      <Plan>
                        <Input
                          type="text"
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Phone number"
                          value={phone}
                        />
                      </Plan>

                      <a
                        className="link"
                        href="https://www.paxi.co.za/send"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        How Paxi works
                      </a>
                    </Plans>
                  ) : deliveryOption === "PUDO Locker-to-Locker" ? (
                    <Plans>
                      <Plan>
                        <Input
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, province: e.target.value })
                          }
                          placeholder="Province"
                          value={meta.province}
                        />
                      </Plan>

                      <a
                        className="link"
                        href="https://www.pudo.co.za/where-to-find-us.php"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Find locker near your location
                      </a>
                      <Plan>
                        <Input
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, shortName: e.target.value })
                          }
                          placeholder="Pick Up Locker"
                          value={meta.shortName}
                        />
                      </Plan>
                      <Plan>
                        <Input
                          type="text"
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Phone"
                          value={phone}
                        />
                      </Plan>
                      <a
                        className="link"
                        href="https://www.pudo.co.za/how-it-works.php"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        How PUDO works
                      </a>
                      <Plan>
                        <a
                          className="link"
                          href="
                      https://www.pudo.co.za/faq.php"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          PUDO FAQ
                        </a>
                      </Plan>
                    </Plans>
                  ) : deliveryOption === "PostNet-to-PostNet" ? (
                    <Plans>
                      <Plan>
                        <Input
                          mode={mode}
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, province: e.target.value })
                          }
                          placeholder="Province"
                          value={meta.province}
                        />
                      </Plan>

                      <a
                        className="link"
                        href="https://www.postnet.co.za/stores"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Find store near your location
                      </a>
                      <Plan>
                        <Input
                          mode={mode}
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, shortName: e.target.value })
                          }
                          placeholder="Pick Up Locker"
                          value={meta.shortName}
                        />
                      </Plan>
                      <Plan>
                        <Input
                          mode={mode}
                          type="text"
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="Phone"
                          value={phone}
                        />
                      </Plan>
                      <a
                        className="link"
                        href="https://www.postnet.co.za/domestic-postnet2postnet"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        How PostNet works
                      </a>
                    </Plans>
                  ) : (
                    ""
                  )
                ) : (
                  ""
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
    </Container>
  );
}
