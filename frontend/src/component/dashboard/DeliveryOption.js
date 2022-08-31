import { faQuestionCircle, faTruck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Store } from "../../Store";

const Container = styled.div`
  padding: 30px 15vw;
`;
const Label = styled.div`
  display: flex;
  align-items: center;
  & svg {
    margin-right: 10px;
  }
`;
const Title = styled.h1`
  font-size: 28px;
`;
const TitleDetails = styled.span`
  width: 70%;
  font-size: 14px;
  line-height: 1.2;
  margin-bottom: 10px;
`;

const Option = styled.div`
  margin: 8px 0;
  display: flex;
  justify-content: space-between;
`;
const Name = styled.div``;

const Switch = styled.input.attrs({
  type: "checkbox",
  id: "darkmodeSwitch",
  role: "switch",
})`
  position: relative;

  width: 40px;
  height: 15px;
  -webkit-appearance: none;
  background: #d4d4d4;
  border-radius: 20px;
  outline: none;
  transition: 0.5s;
  @media (max-width: 992px) {
  }

  &:checked {
    background: ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev4)" : "#fcf0e0"};
    &:before {
      left: 25px;
      background: var(--orange-color);
    }
  }
  &:before {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    content: "";
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    background: grey;
    transition: 0.5s;
  }
`;

const Tips = styled.span`
  position: relative;
  &:hover::after {
    content: "${(props) => props.tips}";
    width: 350px;
    position: absolute;
    border-radius: 0.5rem;
    left: 30px;
    text-align: justify;
    font-size: 14px;
    z-index: 2;
    line-height: 1.2;
    font-weight: 400;
    padding: 10px;
    background: ${(props) =>
      props.mode === "pagebodydark"
        ? "var(--white-color)"
        : "var(--black-color)"};
    color: ${(props) =>
      props.mode === "pagebodydark"
        ? "var(--black-color)"
        : "var(--white-color)"};
  }
  & svg {
    margin-left: 10px;
    color: #d4d4d4;
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
const PlanName = styled.div`
  font-size: 14px;
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

export default function DeliveryOption({
  setDeliveryOption,
  deliveryOption,
  paxi,
  setPaxi,
  pudo,
  setPudo,
  postnet,
  setPostnet,
  aramex,
  setAramex,
  pickup,
  setPickup,
  bundle,
  setBundle,
}) {
  const { state } = useContext(Store);
  const { mode } = state;
  const handleChange = (e) => {
    const { name, value } = e;
    const exist = deliveryOption.filter((x) => x.name === name);
    if (exist) {
      const newArray = deliveryOption.filter((x) => x.name !== name);
      setDeliveryOption([...newArray, { name, value }]);
    } else {
      setDeliveryOption((prevstate) => [...prevstate, { name, value }]);
    }
  };
  const handleCheck = (e) => {
    const { name, value } = e;
    console.log("hello", name, value);

    const exist = deliveryOption.filter((x) => x.value === value);
    console.log("exist", exist);
    if (exist) {
      return true;
    } else {
      return false;
    }
  };
  return (
    <Container>
      <Title>Delivery</Title>
      <TitleDetails>
        Select as many as you like. Shops with multiple options sell faster. The
        Buyer will cover the delivery fee when purchasing.
      </TitleDetails>
      <OptionCont>
        <Option>
          <Label>
            <FontAwesomeIcon icon={faTruck} />
            <Name>Paxi PEP store</Name>
            <Tips
              mode={mode}
              tips={`Store-to-store courier service anywhere in South Africa. Drop off the item at the nearest PEP store / PAXI collection point. The Buyer will collect the item from the pick-up point of their choice.
                      `}
            >
              <FontAwesomeIcon icon={faQuestionCircle} />
            </Tips>
          </Label>
          <Switch
            mode={mode}
            checked={paxi}
            onChange={(e) => {
              setPaxi(e.target.checked);
              if (!e.target.checked) {
                setDeliveryOption(
                  deliveryOption.filter((x) => x.name !== "Paxi PEP store")
                );
              }
            }}
          ></Switch>
        </Option>
        {console.log(deliveryOption)}
        <div style={{ width: "100%", height: "1px", background: "#d4d4d4" }} />
        {paxi && (
          <Plans>
            <Plan>
              <PlanName>Offer free shipping to buyer + R 0.00</PlanName>
              <Radio
                type="radio"
                name="Paxi PEP store"
                onChange={(e) => handleChange(e.target)}
                id="free"
                value={0}
              />
            </Plan>
            <Plan>
              <PlanName>Standard parcel (450x370 mm) + R 59.95</PlanName>
              <Radio
                type="radio"
                name="Paxi PEP store"
                onChange={(e) => handleChange(e.target)}
                value={59.95}
                id="standard"
              />
            </Plan>
            <Plan>
              <PlanName>Large parcel (640x510 mm) + R 99.95</PlanName>
              <Radio
                type="radio"
                name="Paxi PEP store"
                onChange={(e) => handleChange(e.target)}
                value={99.95}
                id="Large"
              />
            </Plan>
            <a
              className="link"
              href="https://www.paxi.co.za/send"
              target="_blank"
              rel="noopener noreferrer"
            >
              How PAXI works
            </a>
          </Plans>
        )}
      </OptionCont>
      <OptionCont>
        <Option>
          <Label>
            <FontAwesomeIcon icon={faTruck} />
            <Name>PUDO Locker-to-Locker</Name>
            <Tips
              mode={mode}
              tips={`
              Locker-to-locker courier service anywhere in South Africa. Drop off the item at the nearest Pudo locker. The Buyer will collect the item from the locker of their choice. Pudo lockers are accessible 24/7, so you can drop off or pick up your package when it suits you best.
                      `}
            >
              <FontAwesomeIcon icon={faQuestionCircle} />
            </Tips>
          </Label>
          <Switch
            mode={mode}
            checked={pudo}
            onChange={(e) => {
              setPudo(e.target.checked);
              if (!e.target.checked) {
                setDeliveryOption(
                  deliveryOption.filter(
                    (x) => x.name !== "PUDO Locker-to-Locker"
                  )
                );
              }
            }}
          ></Switch>
        </Option>
        <div style={{ width: "100%", height: "1px", background: "#d4d4d4" }} />
        {pudo && (
          <Plans>
            <Plan>
              <PlanName>Offer free shipping to buyer + R 0.00</PlanName>
              <Radio
                type="radio"
                name="PUDO Locker-to-Locker"
                onChange={(e) => handleChange(e.target)}
                id="free"
                value={0}
              />
            </Plan>
            <Plan>
              <PlanName>Extra-Small (600x170x80 mm) + R 40.00</PlanName>
              <Radio
                type="radio"
                name="PUDO Locker-to-Locker"
                onChange={(e) => handleChange(e.target)}
                value={40}
                id="standard"
              />
            </Plan>
            <Plan>
              <PlanName>Small (600x410x80 mm) + R 50.00</PlanName>
              <Radio
                type="radio"
                name="PUDO Locker-to-Locker"
                onChange={(e) => handleChange(e.target)}
                value={50}
                id="Large"
              />
            </Plan>
            <Plan>
              <PlanName>Medium (600x410x190 mm) + R 50.00</PlanName>
              <Radio
                type="radio"
                name="PUDO Locker-to-Locker"
                onChange={(e) => handleChange(e.target)}
                value={50}
                id="Large"
              />
            </Plan>
            <Plan>
              <PlanName>Large (600x410x410 mm) + R 50.00</PlanName>
              <Radio
                type="radio"
                name="PUDO Locker-to-Locker"
                onChange={(e) => handleChange(e.target)}
                value={50}
                id="Large"
              />
            </Plan>
            <Plan>
              <PlanName>Extra-Large (600x410x690 mm) + R 50.00</PlanName>
              <Radio
                type="radio"
                name="PUDO Locker-to-Locker"
                onChange={(e) => handleChange(e.target)}
                value={50}
                id="Large"
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
          </Plans>
        )}
      </OptionCont>
      <OptionCont>
        <Option>
          <Label>
            <FontAwesomeIcon icon={faTruck} />
            <Name>PostNet-to-PostNet</Name>
            <Tips
              mode={mode}
              tips={`
              PostNet-to-PostNet courier service anywhere in South Africa. Drop off the item at the nearest PostNet counter. The Buyer will collect the item from the pick-up point of their choice. Your parcel will be delivered within 2-4 working days.
                      `}
            >
              <FontAwesomeIcon icon={faQuestionCircle} />
            </Tips>
          </Label>
          <Switch
            mode={mode}
            checked={postnet}
            onChange={(e) => {
              setPostnet(e.target.checked);
              if (!e.target.checked) {
                setDeliveryOption(
                  deliveryOption.filter((x) => x.name !== "PostNet-to-PostNet")
                );
              }
            }}
          ></Switch>
        </Option>
        <div style={{ width: "100%", height: "1px", background: "#d4d4d4" }} />
        {postnet && (
          <Plans>
            <Plan>
              <PlanName>Offer free shipping to buyer + R 0.00</PlanName>
              <Radio
                type="radio"
                name="PostNet-to-PostNet"
                onChange={(e) => handleChange(e.target)}
                id="free"
                value={0}
              />
            </Plan>
            <Plan>
              <PlanName>Standard parcel (up to 5kg) + R 99.99</PlanName>
              <Radio
                type="radio"
                name="PostNet-to-PostNet"
                onChange={(e) => handleChange(e.target)}
                value={99.99}
                id="standard"
              />
            </Plan>
            <a
              className="link"
              href="https://www.postnet.co.za/domestic-postnet2postnet"
              target="_blank"
              rel="noopener noreferrer"
            >
              How Postnet works
            </a>
          </Plans>
        )}
      </OptionCont>
      <OptionCont>
        <Option>
          <Label>
            <FontAwesomeIcon icon={faTruck} />
            <Name>Aramex Store-to-Door</Name>
            <Tips
              mode={mode}
              tips={`
              Store-to-door courier service anywhere in South Africa. Aramex shipment sleeves can be bought at kiosks, selected Pick n Pay and Freshstop stores nationwide. The parcel will be delivered to buyer’s door.        `}
            >
              <FontAwesomeIcon icon={faQuestionCircle} />
            </Tips>
          </Label>
          <Switch
            mode={mode}
            checked={aramex}
            onChange={(e) => {
              setAramex(e.target.checked);
              if (!e.target.checked) {
                setDeliveryOption(
                  deliveryOption.filter(
                    (x) => x.name !== "Aramex Store-to-Door"
                  )
                );
              }
            }}
          ></Switch>
        </Option>
        <div style={{ width: "100%", height: "1px", background: "#d4d4d4" }} />
        {aramex && (
          <Plans>
            <Plan>
              <PlanName>Offer free shipping to buyer + R 0.00</PlanName>
              <Radio
                type="radio"
                name="Aramex Store-to-Door"
                onChange={(e) => handleChange(e.target)}
                id="free"
                value={0}
              />
            </Plan>
            <Plan>
              <PlanName>Standard parcel (350x450 mm) + R 99.99</PlanName>
              <Radio
                type="radio"
                name="Aramex Store-to-Door"
                onChange={(e) => handleChange(e.target)}
                value={99.99}
                id="standard"
              />
            </Plan>
            <a
              className="link"
              href="https://www.youtube.com/watch?v=VlUQTF064y8"
              target="_blank"
              rel="noopener noreferrer"
            >
              How Aramex works
            </a>
          </Plans>
        )}
      </OptionCont>
      <OptionCont>
        <Option>
          <Label>
            <FontAwesomeIcon icon={faTruck} />
            <Name>Pick up from Seller</Name>
          </Label>
          <Switch
            mode={mode}
            checked={pickup}
            onChange={(e) => {
              setPickup(e.target.checked);
              handleChange({ name: "Pick up from Seller", value: "0" });
              if (!e.target.checked) {
                setDeliveryOption(
                  deliveryOption.filter((x) => x.name !== "Pick up from Seller")
                );
              }
            }}
          ></Switch>
        </Option>
        <div style={{ width: "100%", height: "1px", background: "#d4d4d4" }} />
      </OptionCont>
      <OptionCont>
        <Option>
          <Label>
            <FontAwesomeIcon icon={faTruck} />
            <Name>Bundling</Name>
            <Tips
              mode={mode}
              tips={`
              Bundling allows buyers to shop multiple items from your store and only pay for delivery once! The buyer will be charged delivery on their first purchase, and, if they make any additional purchases within the next hour, free delivery will then automatically apply. Shops who enable bundling sell more and faster.       `}
            >
              <FontAwesomeIcon icon={faQuestionCircle} />
            </Tips>
          </Label>
          <Switch
            mode={mode}
            checked={bundle}
            onChange={(e) => setBundle(e.target.checked)}
          ></Switch>
        </Option>
        <div style={{ width: "100%", height: "1px", background: "#d4d4d4" }} />
        <Plans>
          <Link to="/rebundle" target="_blank">
            More on bundling
          </Link>
        </Plans>
      </OptionCont>
    </Container>
  );
}
