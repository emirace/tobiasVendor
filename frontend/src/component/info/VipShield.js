import {
  faCircle,
  faShirt,
  faTreeCity,
  faTruckRampBox,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  margin: 0 10vw;
  text-align: justify;
  & a {
    color: var(--malon-color);
  }
`;

const List = styled.ul`
  & svg {
    font-size: 8px;
    margin: 8px;
  }
  & li {
    display: flex;
  }
`;
const SubHeading = styled.h4`
  font-size: 1.2rem;
  color: var(--red-color);
  margin-top: 15px;
`;
const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 30px 0;
  &.back {
    background: ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
    padding: 20px;
    border-radius: 0.2rem;
  }
`;
const Row = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;

  &.gap {
    gap: 10px;
  }
`;
const Col = styled.div`
  flex: 1;
  padding: 10px;
  display: flex;
  justify-content: center;
`;
const Orange = styled.span`
  color: var(--orange-color);
`;

const Malon = styled.span`
  color: var(--malon-color);
`;

const Cont = styled.div`
  padding: 20px;
`;
const ContText = styled.div`
  text-align: center;
  & svg {
    margin: 10px;
  }
`;
const ContImage = styled.div``;

const Image = styled.img`
  height: 600px;
`;

export default function VipShield() {
  return (
    <Container>
      <Helmet>
        <title>Vip Shield</title>
      </Helmet>
      <Section>
        <h4>REPEDDLE VIP SHIELD</h4>
        <p>
          <Orange>
            <b>OUR APPROACH:</b>
          </Orange>{" "}
          We are powering a new generation of conscious fashion thinkers in{" "}
          <b>AFRICA</b> by creating a unique platform our generation will find
          very useful, keeping their creative minds and spirit alive, turning
          their creativity as an income stream for them, while doing right by
          our planet and environment, making sustainable living by selling and
          thrifting secondhand fashion.
        </p>
        <p>
          {" "}
          To support the business growth and reward the effort of our thrift
          community that buy and sell using our platforms, we have created a{" "}
          <Orange>
            <b>REPEDDLE VIP SHIELD</b>
          </Orange>{" "}
          for them to showcase on their profile. Our VIP shield can only be
          earned when you become (<b>TOP SELLER</b>) an active user.{" "}
        </p>
        <p>
          <b>Did you know?</b> By extending the life of a piece of clothing by
          extra 9-months, you are reducing its waste, water and carbon footprint
          by up-to 30%. These means; by Reselling, Upcycling or thrifting a
          garment, you are prolonging a textile lifespan, giving it chance to
          live longer while reducing textile carbon footprint on the planet and
          saving our environment. We hope these will minimize the emergency of
          global environmental crisis we and the planet is currently faced.
        </p>
        <SubHeading>HOW WE MEASURE TOP SELLER QUALIFICATION</SubHeading>{" "}
        <div style={{ width: "100%" }}>
          For you to qualify to become a TOP SELLER and earn a VIP shield, you
          must meet the following 5 simple criterial:
        </div>
        <List>
          <li>
            1. Actively participating in the circular economy by buying and
            selling secondhand items on Repeddle including sharing experiences,
            items and listing on your social media earns you a VIP Shield.
          </li>
          <li> 2. Make a minimum of 10 sales out of your listings</li>
          <li>
            3. You should have at least, a minimum of eight 4.5+ stars out of
            ten users rating who have purchased directly from your shop using
            Repeddle App or Website.
          </li>
          <li> 4. Have an average delivery of less than 3 days.</li>
          <li>
            5. Your customer review should reflect at least eight positive
            reviews out of ten users who have purchased directly from your shop
            using Repeddle App or Website.
          </li>
        </List>
      </Section>
      <Section>
        <SubHeading>BENEFIT FOR EARNING A VIP SHIELD</SubHeading>
        <List>
          <li>
            <FontAwesomeIcon icon={faCircle} />
            Profiles with VIP shield display will get priority visibility on our
            App and website including social media platforms.
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} /> Getting priority visibility
            means you get boosted display of your contents and profile across
            all our Platforms, Articles and Mentions. This translate to more
            items/profile views, engagements and selling. More sale means more
            earnings.
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} /> If your earning remains
            positively higher than other sellers, you can then become our
            ambassador after due processes checks. Our aim is to convert many of
            our platform users to community influencers and ambassadors. Our
            influencers and ambassador may have access to benefits, including
            incentives.
          </li>
        </List>
        <div style={{ height: "15px" }} />
        <p>
          <Orange>
            <b>WE NEED EACH OTHER</b>
          </Orange>{" "}
          This is a journey we are on. With you, we can achieve more for Africa
          and make our environment a better, cleaner planet to live.
        </p>{" "}
        <p style={{ textAlign: "left" }}>
          <Orange>
            <b>JOIN US TODAY!</b>
          </Orange>{" "}
          Together, we can make SUSTAINABLE IMPACT and change the way people
          think and use fashion one person at a time. This is the best gift we
          can give our generation, our planet and our future unborn.
        </p>
      </Section>
      <Section>
        <Link to="/sell">
          <b>
            SPREAD THE WORD. START SELLING. ADD MORE ITEMS TO KEEP EARNING TODAY
          </b>
        </Link>
      </Section>
    </Container>
  );
}
