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
        business as part of our thrift secondhand community, you will only be
        charged 7.9% commission.
      </p>
      <p>
        These commission is charged against the listed product price, including
        delivery fee on the total amount of a successful sale.
      </p>{" "}
      <h5>HERE’S THE ENTIRE FEES BREAKDOWN</h5>{" "}
      <div>Repeddle Commission: 2.9%</div>
      <div>Payment processing fee up to: 5% (Charged by payment gateway) </div>
      <div>Total commission: 7.9%</div>
      <p>
        Total commission is applied against the total amount of a successful
        checkout of <b>each</b> product(s) including delivery that buyer paid
        for. Once the transaction is complete and you send your product to the
        buyer and buyer confirms they receive your delivery, we will less the
        commission and pay the balance into your <b>Repeddle wallet.</b> You can
        decide to use your earnings within the Repeddle App and Website or
        transfer into your provided bank account.
      </p>{" "}
      <h5>THE ENTIRE FEE CHARGED IS DEVIDED INTO TWO PARTS:</h5>{" "}
      <ol>
        <li>
          2.9% Repeddle commission: Aid us to continue supporting the growth of
          your business and giving you great and seamless user experience with
          access to all the functionality and resources available on Repeddle
          App and Website.
        </li>
        <li>
          5% Payment Processing fee: Payment processing fee is charged by
          payment gateway providers available on our platform which enables them
          to offer you safe and secured payment experience.
        </li>
      </ol>
      <p>
        <b>PS:</b> When making a withdrawal from your Repedlle wallet, the
        payments gateway providers also charge a processing fee; For South
        Africa, a fixed amount of R10 regardless the amount of that transaction.
        For Nigeria, the amount depends the charge, but between (N10.75 –
        N53.75)Max. These fee is entirely up to the payment platforms, Repeddle
        do not have any say or take in these charge whatsoever.
      </p>
      <BoldText style={{ textTransform: "uppercase" }}>
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
      <ul style={{ listStyleType: "disc" }}>
        <li>Your Product listed price is NGN 300</li>
        <li>Balance = NGN 276.3</li>
        <li>Delivery cost is NGN 100 </li>
        <li>Comission on delivery cost 1.4% = NGN 1.4</li>
        <li> Total amount buyer paid is NGN 400</li>
        <li>
          The total earning we will send to your Repeddle wallet is NGN 274.9
        </li>
      </ul>{" "}
      <BoldText>
        Say a successful purchase is made in <RedText>South Africa</RedText>
      </BoldText>
      <ul style={{ listStyleType: "disc" }}>
        <li>Your Product listed price is R 300 </li>
        <li> Shipping cost to buyer is R 59 </li>
        <li>Total cost we charge buyer is R 359 </li>
        <li>
          {" "}
          7.9% Commission fee applied to the total amount paid by buyer is R
          28.37{" "}
        </li>
        <li>
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
      <p>
        <ul style={{ listStyleType: "disc" }}>
          <li>
            Before you mark a price on your product, consider factoring in all
            the expenses incurred in the process.{" "}
          </li>
          <li>
            {" "}
            Your expenditure may also include the commission charged on any
            thrift or secondhand online platform you sell your product; In this
            case “Repeddle app and website”{" "}
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
            Finally, when your product is sold “thrifted” you’re expected to
            make the full total estimated amount you intend to sell your
            product, back in your <RedText>Repeddle Wallet</RedText> or bank
            account.
          </li>
        </ul>
      </p>{" "}
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
        <BoldText>In Summary:</BoldText> the more you sell, the better your
        opportunity and chances to earn more with our reward programs and free
        membership VIP prioritization. For you to make it to our{" "}
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
