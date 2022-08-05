import React from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 20px;
`;
const RedTitle = styled.h3`
  text-align: center;
  color: var(--red-color);
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
      <h3>HOW REPEDDLE COMMISSION WORKS</h3>
      <RedTitle>OUR COMMISSION EXPLIANED</RedTitle>
      <p>
        Here’s how our fee structure works to help you understand what you could
        earn and decides how you should mark your price.
      </p>
      <p>
        To give you unmatched user experience and support the growth of your
        business as part of our thrift secondhand community, you will not be
        charged <BoldText> Repeddle commission</BoldText> until after 3oth
        November 2022. The only charge that will be due to you is the{" "}
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
          2. 5% Payment Processing fee; The payment processing fee is paid to
          payment providers available on our platform which enables them to
          offer you safe and secured payment experience.
        </li>
      </ol>
      <BoldText>
        There are no Setup, Signup, Adding product, Monthly or Hidden fees.
      </BoldText>{" "}
      <RedTitle> ESTIMATED CALCULATION EXAMPLE MADE FOR YOU!</RedTitle> This
      gives you an idea of what your earning looks like base on the listed price
      of your product, your delivery choice and our commission. Say a successful
      purchase is made in Nigeria  Your Product listed price is NGN 300 
      Shipping cost to buyer is NGN 59  Total cost we charge buyer is NGN 359 
      7.9% Commission fee applied to the total amount paid by buyer is NGN 28.37
       The total earning we will send to your Repeddle wallet or your bank
      account is = NGN 330.63 Say a successful purchase is made in South Africa
       Your Product listed price is R 300  Shipping cost to buyer is R 59 
      Total cost we charge buyer is R 359  7.9% Commission fee applied to the
      total amount paid by buyer is R 28,37  The total earning we will send to
      your Repeddle wallet or your bank account is = R 330.63 HELPING YOU MARK
      YOUR PRICE While we want you to have fun doing what you love doing best,
      we also prioritize that your business generates profit for you, hence we
      came up with a strategy to help you make a good price marking of your
      product.  Before you mark a price on your product, consider factoring in
      all the expenses incurred in the process.  Your expenditure may also
      include the commission charged on any thrift or secondhand online platform
      you sell your product; In this case “Repeddle app and website”  Then add
      all the expenditure including cost of the purchase of your product or the
      current market value.  Then you will have the total price to list your
      products on Repeddle app and website  Finally, when your product is sold
      “thrifted” you’re expected to make the full total estimated amount you
      intend to sell your product, back in your Repeddle Wallet or bank account.
      NOTE: We do not currently offer cross border sells. Example: If you’re
      located in Nigeria and your product is listed in Nigeria, you will only
      sell to buyers within Nigeria. Viś-à-viś to sellers and buyers in South
      Africa. WONDERING WHY YOU NEED TO PAY COMMISSION? HERE’S WHY! App or
      Website Infrastructure: Our infrastructure is built with tools to support
      your business growth, to maintain this infrastructure there’s a lot that
      goes on behind the scene. We use the 2,9% Repeddle commission fee to
      offset the monthly maintenance fee that is required to keep these
      infrastructure running smoothly. Marketing: For a business to thrive, it
      requires aggressive consistent marketing, our aim is for your business to
      succeed, either you do it as a side hustle or fulltime. We prioritize your
      growth and currently subsidizing Ad campaigns we run so your store and
      real products gets to the right hand and find new home. Support system:
      Our customer support system is active and accessible at all times to you,
      so you get all the information, insights and education you need to scale
      your business while having great experience using Repeddle’s app and
      website. Delivery: Repeddle provides you with hassle free, easy and a
      click away delivery options integrated into our app and website to choose
      from. You have the choice to choose which delivery option(s) is convenient
      for you that you offer to buyers, with the delivery options you have
      initiated, buyers will choose what’s also convenient for them, both in
      time and cost. These gives you more selling opportunities. Payments:
      Unlike other platforms, Repeddle offers you different payment options
      that’s convenient, secured and reliable for you to choose from. These
      payment processing platforms charges up-to 5% of the total amount for
      every transaction that goes through your sellers account/dashboard. 5% of
      the 7.9% we charge covers this fee. In Summary, the more you sell, the
      better your opportunity and chances to earn more with our reward programs
      and free membership VIP prioritization. For you to make it to our VIP
      PRIORITY LIST and get verified with VIP SHILED, your sale and earnings
      needs to be higher in number than other users + your total profile reviews
      + star ratings. Read more about our reward programs and how we calculate
      our verification shield approval here. LIST A PRODUCT TO START SELLING
      TODAY!
    </Container>
  );
}
