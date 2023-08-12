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
export default function HowToLogReturn() {
  return (
    <Container>
      <RedTitle>HOW TO LOG A RETURN</RedTitle>
      <p>
        We strongly encourage both Sellers and Buyers to take precaution when
        selling or buying in order to avoid what may lead to back and forth of
        returns and refunds. However, If your purchase is eligible for returns,
        it’s within your right to log a return within <b>72 hours (3 days)</b>{" "}
        from the date your order was delivered to your pick-up point or address
        and you will be fully refunded.
      </p>
      <Title>How It Works:</Title>
      <ol>
        <li>
          Firstly, make sure you haven’t confirmed your order as <b>received</b>{" "}
          should you need to log a return. Once order has been confirmed, you
          will not be able to log a return anymore, but you can either{" "}
          <b>relist</b> the product to sale on Repeddle or <b>message</b> the
          seller to reach an agreement.
        </li>
        <li>
          Within <b>72 hrs (3 days)</b> your order was delivered, If your order
          is eligible for return, you must log a return through the{" "}
          <b>Log a Return</b> on your order details page.
        </li>
        <li>
          When logging a return, Ensure to upload pictures that clearly show
          your reason and include a detailed description of the reason for the
          return.
        </li>
      </ol>
      <li> Log in to your account</li>
      <li>
        On App/Mobile click on profile icon. On Desktop click on your profile
        picture.
      </li>
      <li>
        On the Website select Purchased Orders, On the App select My
        Orders/Returns.
      </li>
      <li>
        On the Website, from Purchase Product history, select <b>View</b>. On
        the App after selecting Orders/Returns tab, select the order you wish to
        return from the purchase list.
      </li>
      <li>
        From Your Order product page, select <b>Log a Return.</b>
      </li>
      <li>
        Choose <b>return form</b> to log a return. If you wish to <b>message</b>{" "}
        the seller about the return, or <b>re-list</b> the product to sell
        instead of logging a return, choose that option.
      </li>
      <li>
        Fill out all the correct information accordingly and describe reason in
        detail. <b>NOTE:</b> Return delivery method must be the same delivery
        method you chose when making the purchase.
      </li>
      <li> Upload Image and submit</li>
      <Title>Return Eligibility:</Title>
      <p>
        Your purchase is eligible for return if any of the below issue is
        associated with you order.
      </p>
      <li>
        The product was misrepresented and your purchased order is remarkably
        different from the listing and descriptions.
      </li>
      <li> Product condition is significantly not as described.</li>
      <li> Missing or wrong product “not what I ordered”</li>
      <li> Product has significant undisclosed damage.</li>
      <Title>Non Eligible Return:</Title>
      <li> You changed your mind</li>
      <li> Fit issues</li>
      <li> Delayed delivery</li>
      <b>Please Note:</b> If a seller has a “no Return/Refund” disclaimer, it
      will not be hold against Repeddle’s Return and Refunds policy or Terms of
      use. Hence, Repeddle’s Terms of Use, Return and Refund policy supersede
      any seller’s Return/Refund disclaimer.
      <Title>REFUNDS</Title>
      When you make a purchase on Repeddle, we hold the payment of your purchase
      until we know you have received your order as described. We allow you{" "}
      <b>72 hours (3 days)</b> from delivered date to notify us if the product
      is significantly not as described or has been misrepresented by logging a
      return with description and clear image to support your claim on Repeddle
      App or Website.
    </Container>
  );
}
