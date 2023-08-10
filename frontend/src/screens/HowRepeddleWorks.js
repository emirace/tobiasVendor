import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const StepsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
`;

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 20px;
  border-top: ${({ isNotFirst }) => (isNotFirst ? "1px solid #ccc" : "none")};

  @media (min-width: 768px) {
    flex-direction: ${({ isOdd }) => (isOdd ? "row-reverse" : "row")};
    align-items: center;
    width: 60%;
  }
`;

const StepImage = styled.img`
  max-width: 100%;
  margin-bottom: 20px;

  @media (min-width: 768px) {
    max-width: 50%;
    margin-bottom: 0;
    margin-right: ${({ isOdd }) => (isOdd ? "0" : "20px")};
    margin-left: ${({ isOdd }) => (isOdd ? "20px" : "0")};
  }
`;

const StepContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 100%;

  @media (min-width: 768px) {
    max-width: 50%;
  }
`;

const Header = styled.h2`
  font-size: 28px;
  line-height: 34px;
  color: var(--malon-color);
  margin-bottom: 0;
  text-align: center;
`;
const Header1 = styled.h2`
  font-size: 28px;
  line-height: 34px;
`;

const ShortDescription = styled.p`
  font-size: 20px;
  margin-bottom: 15px;
  font-style: italic;
  color: var(--orange-color);
  text-align: center;
`;

const TextContent = styled.p``;

const HowRepeddleWorks = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const seller = [
    {
      image:
        "https://res.cloudinary.com/emirace/image/upload/v1691621393/ntblm7mnigoa2pr273g6.png",
      header: "TAKE A PICS",
      content:
        "Always Remember; “Great image sales fast.” Take a picture of the product you wish to sell using a good source of natural lighting...",
    },
    {
      image:
        "https://res.cloudinary.com/emirace/image/upload/v1691621285/doyhrechq04fnfckki96.png",
      header: "LIST & SHARE",
      content:
        "List Products On Repeddle With Just A Few Clicks: Listing is easier than you think. With 10,400 brand names to choose from our database, it's just a click away! List and describe your item with all information buyer needs to know, set your price and share to help buyers discover your listing.",
    },
    {
      image:
        "https://res.cloudinary.com/emirace/image/upload/v1691621379/x7wilble1b3muoqsyi6n.png",
      header: "CASHOUT",
      content:
        "Request a payout anytime you sale an item, deliver the item and the buyer receives the item. With multiple delivery choices installed on our App and Website, you can choose any delivery that’s most convenient for you to send or receive your item. Once the buyer marks your order as received, you cash-out.",
    },
    // Add more seller here
  ];

  const buyer = [
    {
      image:
        "https://res.cloudinary.com/emirace/image/upload/v1691621421/fidhkhbzohm4svjzhdmb.png",
      header: "Hunt all you want",
      shortDescription: "Fashion, Homeware, Tech, Gadgets &amp; More",
      extra: (
        <span>
          <Link to="/sell" style={{ color: "var(--malon-color" }}>
            Shop
          </Link>{" "}
          the trill. No guilt..!!
        </span>
      ),
      content:
        "From the brand you love to the most trendy styles, shop variety of your favorites, from size to pocket friendly piece. Scoring a deal on Repeddle is a sure thing when shopping for something exciting.",
    },
    {
      image:
        "https://res.cloudinary.com/emirace/image/upload/v1691621408/odn3kjxjksaptotxjdxg.png",
      header: "Buy safely with REPEDDLE PROTECT.",
      shortDescription: "All Safe, No Worries!",
      content:
        "We never underestimate the importance of trust and safety in our community. Every time you buy an item on Repeddle, we ensure your money is safe by withholding your money so you get your item delivered to you before we make the money available for sellers to withdraw. In case of any unfortunate event, our support teams are always available to help.",
    },
    {
      image:
        "https://res.cloudinary.com/emirace/image/upload/v1691621436/ce53bpnuya8btoby5er3.png",
      header: "Engage with the community.",
      shortDescription:
        "Comment, Review, Share &amp; Chat with fellow community members.",
      content:
        "Connecting and engaging is very easy on Repeddle. We make our community part of us by making it social, so you can comment, review, report or chat with sellers and other users. By this way, you get the best out of what you buy, while keeping it safe.",
    },
    // Add more seller here
  ];

  return (
    <StepsContainer>
      <Header1>HOW REPEDDLE WORKS</Header1>
      <Header>FOR SELLERS</Header>
      {seller.map((step, index) => (
        <Step key={index} isOdd={index % 2 === 1} isNotFirst={index !== 0}>
          <StepImage
            src={step.image}
            alt={`Step ${index + 1}`}
            isOdd={index % 2 === 1}
          />
          <StepContent>
            <Header>{step.header}</Header>
            <ShortDescription>{step.shortDescription}</ShortDescription>
            <TextContent>{step.content}</TextContent>
          </StepContent>
        </Step>
      ))}
      <Header>FOR BUYERS</Header>
      {buyer.map((step, index) => (
        <Step key={index} isOdd={index % 2 === 1} isNotFirst={index !== 0}>
          <StepImage
            src={step.image}
            alt={`Step ${index + 1}`}
            isOdd={index % 2 === 1}
          />
          <StepContent>
            <Header>{step.header}</Header>
            <ShortDescription>{step.shortDescription}</ShortDescription>
            {step.extra && <div style={{ fontSize: "18px" }}>{step.extra}</div>}
            <TextContent>{step.content}</TextContent>
          </StepContent>
        </Step>
      ))}
    </StepsContainer>
  );
};

export default HowRepeddleWorks;
