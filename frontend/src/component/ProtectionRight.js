import { faKey, faShield } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import styled from "styled-components";
import { Store } from "../Store";
import Model from "./Model";

const Container = styled.div`
  margin: 5px;
  padding: 20px;
  border-radius: 0.2rem;
  display: flex;
  cursor: pointer;
  border: 1px solid
    ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev3)" : "var(--light-ev3)"};
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  align-items: center;
  & svg {
    font-size: 25px;
    color: var(--orange-color);
    margin-right: 10px;
  }
`;
const Protection = styled.div`
  padding: 30px 10vw;
  overflow: auto;
`;
const Title = styled.div`
  font-size: 25px;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;
`;
const Content = styled.div`
  margin-bottom: 50px;
`;

export default function ProtectionRight() {
  const { state } = useContext(Store);
  const { mode } = state;

  const [showModel, setShowModel] = useState(false);

  return (
    <div>
      <Container mode={mode} onClick={() => setShowModel(!showModel)}>
        <FontAwesomeIcon icon={faKey} /> Buyer's & Seller's Protection !
      </Container>
      <Model showModel={showModel} setShowModel={setShowModel}>
        <Protection>
          <Title> BUYER PROTECTION SYSTEM</Title>

          <Content>
            With our Repeddle buyer’s protection, if you make a purchase
            COMPLETELY within Repeddle App or Website using ADD TO CART and
            checkout, and the product is remarkably not as described or doesn’t
            arrive as a result of seller not sending your product or seller’s
            negligent (and not yours), we will refund you in full including
            delivery fee, otherwise all sale is final. Please have a look at our
            refund policy here. Any payment made outside our App or Website will
            not be covered by the buyer’s protection. When you purchase a
            product on our App or Website we transfer the money to the seller’s
            account ONLY when the buyer confirms receipt of the product.
            Repeddle buyer’s protection by default covers all Repeddle
            user/community members that complete their purchase through repeddle
            App or Website using the add to cart button and checkout.
          </Content>

          <Title> SELLER PROTECTION SYSTEM </Title>
          <Content>
            Seller’s don’t have to worry about not getting paid. After a
            successful sell of a product inside Repeddle’s App or website, the
            money is automatically deposited to Repeddle and we will transfer
            the money to seller’s Repeddle Wallet after buyer confirmed the
            receipt of the seller’s product. You can either decide to use the
            money for other purchase to resell on Repeddle or transfer it
            directly to your provided bank account. The Repeddle protection by
            default cover sellers of all levels that successfully completes
            their entire sale transaction inside Repeddle App or Website. To
            find out more about payment turn around period, see our refund
            policy here
          </Content>
        </Protection>
      </Model>
    </div>
  );
}
