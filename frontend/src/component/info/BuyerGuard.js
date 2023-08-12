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
export default function BuyerGuard() {
  return (
    <Container>
      <RedTitle>REPEDDLE BUYER’S GUIDE</RedTitle>
      <Title>How Can I Start Buying?</Title>
      <p>
        Something nice caught your eyes and wondering how to buy them? Let’s
        guide you through.
      </p>
      <Title>1. Creating Account On Repeddle</Title>
      First time buyer? You don’t have to compulsorily create an account to add
      items to cart. You can add items to cart, and with a click, create an
      account when checking out. When creating account, use the CREATE YOUR
      ACCOUNT or REGISTER tab. Enter your preferred username manually or use
      your Google or Facebook account by clicking on any of the preferred
      method. After creating an account you can edit/update your account
      preferences and details on MY PROFILE by clicking on your profile picture,
      then the edit PEN to edit.
      <Title>2. Log-In To Repeddle</Title>
      Logging in to Repeddle is just a click; Click on SIGN IN, choose your
      preferred sign in method <b>“Facebook or Google”</b> or enter your log-in
      details <b>“e-mail &amp; password</b>” manually.
      <Title>3. Adding Items To Cart or Wishlist</Title>
      Add items to <b>Cart</b> or <b>Wishlist</b> by using our simple navigation
      and search tools, be sure to select size while adding to cart for items
      that require size. You have the freedom to shop multiple items from
      multiple sellers as well as buying in <b>bulk</b> or <b>slot</b>. When a
      seller activates <b>Re:Bundle</b>, you have the privilege to enjoy free
      delivery for multiple items you purchase from that particular seller and
      pay for only one delivery. <b>Please Note:</b> Ensure to complete your
      whole purchase, payment and communications on Repeddle App or Website so
      your purchase and transaction can be protected if anything doesn’t seem/go
      right.
      <Title>4. Delivery</Title>
      After item(s) have been added to cart, on the cart page, select your
      preferred delivery option(s) that has been offered by the seller. Please
      fill in your pick-up point or address as required by your chosen delivery
      method very accurately. If you’re buying from multiple sellers or buying
      multiple item(s), be sure to select delivery option and fill in the
      correct pick-up point or address required and then proceed to Checkout.
      <Title>5. Payment Methods</Title>
      Select your preferred offered payment method; Repeddle Wallet, EFT (Pay
      With Bank) or Card. if your wallet balance is insufficient, you may choose
      to fund your wallet from FUND MY WALLET.
      <Title>6. Order Preview</Title>
      Confirm that your order is correctly placed with the right INFORMATIONS,
      pick-up point or address, then check your order summary and PROCEED TO
      PAYMENT.
      <Title>7. Make Your Payment</Title>
      Proceed to complete the payment by entering the correct required payment
      fields and click pay. Once the payment is complete and order is
      successfully placed, you will receive a Repeddle in App/Website order
      confirmation and e-mail with the order details. You can track the process
      of your order from your profile by clicking <b>purchased orders</b>{" "}
      &gt;click on the <b>order</b> &gt; click on <b>track order</b> to view the
      process. Please Note: Tracking from this page is not actual live tracking
      from courier, but tracking the process of the seller sending your item.
      <Title>8. Tracking</Title>
      With every updated process of your order, you’ll receive an in App and
      e-mail communication to inform you on the seller’s status once the seller
      updates their delivery process. You will get a tracking number with this
      communication the seller would provide when they have dispatched your
      order to enable you track your order live using the live tracking system
      on the website of your chosen delivery method. <b>NOTE:</b>{" "}
      <i>
        Please be sure to keep an eye on the notification bell of the
        App/Website.
      </i>
      <Title>9. Receiving Your Order</Title>
      We please ask that you give the seller <b>3 days</b> to process and
      dispatch your order. When your order is dispatched, it should arrive
      between <b>3-7</b> business days according to the delivery window of your
      chosen delivery method. When it arrives at your pick- up point or address,
      ensure to pick them up and inspect your order for your satisfaction.
      Please do not forget to <b>mark</b> your order as <b>received</b> so the
      seller can get paid. To mark order as received, go to your <b>profile</b>{" "}
      &gt; <b>Purchased order</b> &gt;
      <b>View</b> &gt; <b>Confirm You Have Received Order.</b> You can also mark
      order as received by clicking the order notification from the notification
      bell of the App/Website. <b>NOTE:</b> You have <b>3 days</b> to mark order
      as received. We’ll automatically pay the seller after <b>3 days</b> your
      order has been delivered to your pick-up point or address if you did not
      mark your order as received.
      <Title>10. Item Not Sent?</Title>
      After 5 business days of making a purchase, if you did not received any
      communication or delivery update regarding your order, please ensure to
      message the seller through the provided message system on Repeddle. At
      this time, you may also contact a support team through the{" "}
      <b>support icon</b> on the righthand side to get assistance.
    </Container>
  );
}
