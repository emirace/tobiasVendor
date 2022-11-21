import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px 40px;
  & p {
    text-align: justify;
  }
  & a {
    color: var(--malon-color);
    &:hover {
      text-decoration: underline;
    }
  }
  @media (max-width) {
    padding: 20px 10px;
  }
`;
const RedTitle = styled.h3`
  font-size: 1.2rem;
  width: 100%;
  color: var(--red-color);
  margin-top: 15px;
`;
const RedTitle1 = styled.h3`
  font-size: 1.2rem;
  color: var(--red-color);
  margin-top: 15px;
`;
const BoldText = styled.span`
  font-weight: bold;
`;
const RedText = styled.span`
  color: var(--red-color);
`;
export default function FeeStructure() {
  return (
    <Container>
      <h3 style={{ textAlign: "center", fontSize: "1.2rem" }}>
        HOW REPEDDLE COMMISSION WORKS
      </h3>
      <RedTitle>OUR COMMISSION EXPLIANED</RedTitle>
      <p>
        Here’s how our fee structure works to help you understand what you could
        earn and decides how you should mark your price.
      </p>
      <p>
        To give you unmatched user experience and support the growth of your
        business as part of our thrift secondhand community, you will not be
        charged <BoldText> Repeddle commission.</BoldText> The only charge that
        will be due to you is the{" "}
        <BoldText> payment platform processing fee.</BoldText>
        These fee is entirely up to the payment platform. Repeddle do not have
        any say or take in these charge whatsoever. The payment processing fee
        up-to 5% of the total transaction amount, depending on the payment
        platform, will be applied to a successful completed checkout.
      </p>
      <p>
        {" "}
        After the grace period (30th November 2022) of selling (thrifting) your
        secondhand products completely free of{" "}
        <BoldText> Repeddle Commission,</BoldText> when you have successfully
        sold your product on Repeddle, we will less a commission fee of only{" "}
        <BoldText> 7.9%</BoldText> (includes payment processing fee) on the
        total transaction (including shipment).
      </p>{" "}
      <h5>HERE’S THE ENTIRE FEES BREAKDOWN</h5>{" "}
      <div>Repeddle Commission: 2.9%</div>
      <div>Payment processing fee: 5% </div>
      <div>Total commission: 7.9%</div>
      <p>
        {" "}
        Total commission is applied against the total amount of a successful
        checkout of EACH product(s) including shipment that buyer paid for. Once
        the transaction is complete and you send your product to the buyer and
        buyer confirms they receive your delivery, we will pay your balance into
        your Repeddle wallet. You can decide to use your earnings within the
        Repeddle app and website or transfer into your provided bank account.
      </p>{" "}
      <h5>THE ENTIRE FEE CHARGED IS DEVIDED INTO TWO PARTS:</h5>{" "}
      <ol>
        <li>
          2.9% Repeddle commission; Aid us to continue supporting the growth of
          your business and giving you great and seamless user experience with
          access to all the functionality and resources available in Repeddle
          app and website.
        </li>
        <li>
          5% Payment Processing fee; The payment processing fee is paid to
          payment providers available on our platform which enables them to
          offer you safe and secured payment experience.
        </li>
      </ol>
      <BoldText>
        There are no Setup, Signup, Adding product, Monthly or Hidden fees.
      </BoldText>{" "}
      <RedTitle> ESTIMATED CALCULATION EXAMPLE MADE FOR YOU!</RedTitle>{" "}
      <p>
        This gives you an idea of what your earning looks like base on the
        listed price of your product, your delivery choice and our commission.
      </p>
      <BoldText>
        {" "}
        Say a successful purchase is made in <RedText>Nigeria</RedText>
      </BoldText>
      <ul>
        <li>Your Product listed price is NGN 300</li>
        <li>Shipping cost to buyer is NGN 59 </li>
        <li> Total cost we charge buyer is NGN 359 </li>
        <li>
          7.9% Commission fee applied to the total amount paid by buyer is NGN
          28.37
        </li>
        <li>
          The total earning we will send to your Repeddle wallet or your bank
          account is = NGN 330.63
        </li>
      </ul>{" "}
      <BoldText>
        Say a successful purchase is made in <RedText>South Africa</RedText>
      </BoldText>
      <ul>
        <li>Your Product listed price is R 300 </li>
        <li> Shipping cost to buyer is R 59 </li>
        <li>Total cost we charge buyer is R 359 </li>
        <li>
          {" "}
          7.9% Commission fee applied to the total amount paid by buyer is R
          28,37{" "}
        </li>
        <li>
          {" "}
          The total earning we will send to your Repeddle wallet or your bank
          account is = R 330.63
        </li>
      </ul>{" "}
      <RedTitle>HELPING YOU MARK YOUR PRICE</RedTitle>{" "}
      <p>
        While we want you to have fun doing what you love doing best, we also
        prioritize that your business generates profit for you, hence we came up
        with a strategy to help you make a good price marking of your product.
      </p>{" "}
      <ul>
        <li>
          Before you mark a price on your product, consider factoring in all the
          expenses incurred in the process.{" "}
        </li>
        <li>
          {" "}
          Your expenditure may also include the commission charged on any thrift
          or secondhand online platform you sell your product; In this case
          “Repeddle app and website”{" "}
        </li>
        <li>
          {" "}
          Then add all the expenditure including cost of the purchase of your
          product or the current market value.{" "}
        </li>
        <li>
          {" "}
          Then you will have the total price to list your products on Repeddle
          app and website{" "}
        </li>
        <li>
          Finally, when your product is sold “thrifted” you’re expected to make
          the full total estimated amount you intend to sell your product, back
          in your <RedText>Repeddle Wallet</RedText> or bank account.
        </li>
      </ul>{" "}
      <p>
        <RedText>NOTE:</RedText> We do not currently offer cross border sells.{" "}
        <BoldText>Example:</BoldText> If you’re located in Nigeria and your
        product is listed in Nigeria, you will only sell to buyers within
        Nigeria. Viś-à-viś to sellers and buyers in South Africa.
      </p>{" "}
      <RedTitle>WONDERING WHY YOU NEED TO PAY COMMISSION? HERE’S WHY</RedTitle>{" "}
      <p>
        <BoldText>App or Website Infrastructure:</BoldText> Our infrastructure
        is built with tools to support your business growth, to maintain this
        infrastructure there’s a lot that goes on behind the scene. We use the
        2,9% Repeddle commission fee to offset the monthly maintenance fee that
        is required to keep these infrastructure running smoothly.
      </p>
      <p>
        <BoldText>Marketing:</BoldText> For a business to thrive, it requires
        aggressive consistent marketing, our aim is for your business to
        succeed, either you do it as a side hustle or fulltime. We prioritize
        your growth and currently subsidizing Ad campaigns we run so your store
        and real products gets to the right hand and find new home.
      </p>{" "}
      <p>
        <BoldText>Support system:</BoldText> Our customer support system is
        active and accessible at all times to you, so you get all the
        information, insights and education you need to scale your business
        while having great experience using Repeddle’s app and website.
      </p>
      <p>
        {" "}
        <BoldText>Delivery:</BoldText>
        Repeddle provides you with hassle free, easy and a click away delivery
        options integrated into our app and website to choose from. You have the
        choice to choose which delivery option(s) is convenient for you that you
        offer to buyers, with the delivery options you have initiated, buyers
        will choose what’s also convenient for them, both in time and cost.
        These gives you more selling opportunities
      </p>
      <p>
        <BoldText> Payments:</BoldText> Unlike other platforms, Repeddle offers
        you different payment options that’s convenient, secured and reliable
        for you to choose from. These payment processing platforms charges up-to
        5% of the total amount for every transaction that goes through your
        sellers account/dashboard. 5% of the 7.9% we charge covers this fee.
      </p>{" "}
      <p>
        In Summary, the more you sell, the better your opportunity and chances
        to earn more with our reward programs and free membership VIP
        prioritization. For you to make it to our{" "}
        <RedText> PRIORITY LIST</RedText> and get verified with{" "}
        <RedText>VIP SHILED,</RedText> your sale and earnings needs to be higher
        in number than other users + your total profile reviews + star ratings.
        Read more about our reward programs and how we calculate our
        verification shield approval <Link to="/vipshield">here</Link>.
      </p>{" "}
      <RedTitle1>
        <Link style={{ color: "var(--orange-color)" }} to="/newproduct">
          LIST A PRODUCT TO START SELLING TODAY!
        </Link>
      </RedTitle1>
    </Container>
  );
}
