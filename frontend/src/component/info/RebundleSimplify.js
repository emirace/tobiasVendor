import React from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 0 10vw;
  text-align: justify;
`;
const RedTitle = styled.h3`
  text-align: center;
  font-size: 1.2rem;
  color: var(--red-color);
  margin-top: 15px;
`;
const Title = styled.h3`
  font-size: 1.2rem;
  margin-top: 15px;
  margin-bottom: 0;
`;
export default function RebundleSimplify() {
  return (
    <Container>
      <RedTitle>RE:BUNDLE SIMPLIFIED</RedTitle>
      <p>
        Want <b>free delivery</b>? Re:Bundle gives you the opportunity to pay
        for one delivery (the 1st purchase) and get free delivery on the rest
        items you purchase from the same seller within two (2) hours window
        after the 1st checkout.
      </p>
      <Title>How It Works:</Title>
      <ol>
        <li>
          Purchase a product using a prefer delivery method made available by
          the seller.
        </li>
        <li>
          After the 1st successful purchase, a two hours’ time window is
          activated for you to make additional purchase from the same seller and
          get free delivery on the products you bought between that two hours,
          this means you don’t pay delivery fee for products you purchase when
          Re:Bundle is active within two hours after your 1st purchase.
        </li>
        <li>
          If you did not see Re:Bundle on the seller’s profile or on checkout,
          that means the seller has not activated Re:Bundle. You may simply
          message the seller using the message me button on the seller’s profile
          and ask them to activate Re:Bundle before you complete the checkout,
          as you want to purchase more products from them using Re:Bundle.
        </li>
      </ol>
      <Title>Attention:</Title>
      <ol>
        <li>
          In order for the seller to pack your Re:Bundle purchase, all your
          Re:Bundle purchases must be able to fit into the courier bag or box,
          if not, it may attract extra delivery charge.
        </li>
        <li>
          For the Re:Bundle option to be completely successful, you need to
          ensure completing your order and checkout within the two hours window
          after the 1st purchase from the same seller. This applies whenever
          Re:Bundle is activated or whenever you wish to use Re:Bundle.
        </li>
        <li>
          If you wish to use Re:Bundle and you don’t see the option activated on
          the seller’s profile or when checking out, remember you’re very free
          to message the seller and ask them to activate Re:Bundle for you.
          Sellers are always happy to do so.
        </li>
        <li>
          The free delivery elapses after two hours you made the first purchase,
          meaning Re:Bundle window closes after two hours from the 1st complete
          purchase checkout.
        </li>
      </ol>
    </Container>
  );
}
