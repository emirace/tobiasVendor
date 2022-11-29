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
  & a {
    color: var(--malon-color);
  }
  @media (max-width: 992px) {
    margin: 0 5vw;
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
  margin: 0 5px;
  font-weight: bold;
  font-size: 30px;
  @media (max-width: 992px) {
    font-size: 20px;
  }
`;
const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 0;
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
  @media (max-width: 992px) {
    flex-direction: column;
    gap: 5px;
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
  @media (max-width: 992px) {
    padding: 5px;
  }
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
  width: 400px;
  object-fit: cover;
  @media (max-width: 992px) {
    width: 100%;
    height: auto;
  }
`;

const TopHeader = styled.h1`
  font-weight: bold;
  @media (max-width: 992px) {
    font-size: 20px;
    text-align: center;
  }
`;

export default function SustainabilityImpact() {
  return (
    <Container>
      <Helmet>
        <title>Sustainability Impact</title>
      </Helmet>
      <Section>
        <TopHeader>REPEDDPLE SUSTAINABILITY IMPACT</TopHeader>
        <p>
          Fashion industry is the second most intense water consuming and
          polluting industry in the world, releasing up to 10% global carbon
          emission, greater than international airlines and maritime logistic
          combined. Repeddle is embarked on reducing some of this pollution our
          continent “Africa” is faced, in order for we to do so, we must firstly
          change the way people perceive and use fashion. Addressing stigma
          associated with secondhand thrifting is a good place to start.
        </p>
        <p>
          Research has shown that international fast fashion companies target
          Africa as the final destination for their unsold, abandoned or used
          product that their international consumers no longer want or use. This
          over the years has increasingly turned Africa as a dumping ground,
          hence causing enormous landfills in Africa.{" "}
        </p>
        <div>
          Repeddle is set to address this landfills problems in Africa by
          creating a platform that will change the way we trade secondhand.
          Below are some facts to look at, just to give few insights on why we
          need to take this very seriously.
        </div>
      </Section>
      <Section>
        <SubHeading
          style={{
            color: "var(--malon-color)",
            fontWeight: "bold",
          }}
        >
          WHAT YOU MAY NEED TO KNOW! “THE PROBLEM”{" "}
        </SubHeading>
        <div style={{ textAlign: "left", width: "100%" }}>
          <b style={{ color: "var(--malon-color)" }}>FACTS:</b> Here are some
          REAL FACTS that shows the impact of fast fashion which harms Africa
          and the planet.
        </div>
        <List>
          <li>
            <FontAwesomeIcon icon={faCircle} /> In recent years, the world is
            producing, consuming, and throwing away more clothes than ever
            before.{" "}
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} /> Clothing production doubled from
            2000 to 2014, with more than 150 billion garments produced annually.{" "}
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} />
            It takes on average of 10,000 – 20,000 litters of water to cultivate
            just one kilogram of raw cotton, that is about 3.4 million liters of
            water to cultivate just one kilogram of raw cotton between 2000 to
            2014{" "}
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} /> Europeans throw away 2 million
            tons of textiles each year.{" "}
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} />
            Globally, only 30% of collected clothing are resold on domestic
            markets, due to poor quality and low re-sale value. The rest are
            baled and sold to textile merchants who ship them overseas to
            Sub-Saharan Africa to sell in countries like Kenya, Ghana, Senegal,
            including Nigeria and South Africa, which mostly end up in
            landfills.{" "}
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} /> Every second, the equivalent of
            one garbage truck of textiles is landfilled or burned.{" "}
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} />
            Africa’s solid waste generation set to double to 225 million cubic
            tons by 2025{" "}
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} />
            85% of textiles collected globally from Western and European
            countries hugely contributing to waste generation in Africa.{" "}
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} /> 90% of this waste are either
            “openly burned, dumped illegally with no barriers to protect
            groundwater and no monitoring of gases in place” causing water,
            environmental and air pollution with excessive increased CO2
            emission.
          </li>
        </List>
        <Row style={{ justifyContent: "space-around" }}>
          <Cont>
            <ContText>
              <div>The equivalent of</div>
              <div
                style={{
                  color: "var(--malon-color)",
                  fontSize: "17px",
                  fontWeight: "bold",
                  fontStyle: "italic",
                }}
              >
                1 garbage truck
              </div>
              <div>of textiles is wasted</div>
              <div
                style={{
                  color: "var(--malon-color)",
                  fontSize: "17px",
                  fontWeight: "bold",
                  fontStyle: "italic",
                }}
              >
                every second
              </div>
              <FontAwesomeIcon size="3x" icon={faTruckRampBox} />
            </ContText>
          </Cont>
          <Cont>
            <ContText>
              <div>5.2%</div>
              <div
                style={{
                  color: "var(--malon-color)",
                  fontSize: "17px",
                  fontWeight: "bold",
                  fontStyle: "italic",
                }}
              >
                of the waste
              </div>
              <div>in our landfills are textiles</div>
              <FontAwesomeIcon size="3x" icon={faTreeCity} />
            </ContText>
          </Cont>
          <Cont>
            <ContText>
              <div>3 years</div>
              <div
                style={{
                  color: "var(--malon-color)",
                  fontSize: "17px",
                  fontWeight: "bold",
                  fontStyle: "italic",
                }}
              >
                is the average lifetime
              </div>
              <div>of a garment today</div>
              <FontAwesomeIcon size="3x" icon={faShirt} />
            </ContText>
          </Cont>
        </Row>
      </Section>
      <Section>
        <SubHeading>
          <Orange>
            <b>Less</b>
          </Orange>{" "}
          Is{" "}
          <Malon>
            <b>More</b>
          </Malon>
        </SubHeading>
        <Image
          src="https://res.cloudinary.com/emirace/image/upload/v1661221992/cherie-birkner-J6MJPuJiDPo-unsplash_cclo31.webp"
          alt="img"
        />
        <SubHeading>MAKING IT BETTER FOR AFRICA</SubHeading>
        <SubHeading>+THE PLANET+</SubHeading>
      </Section>
      <Section>
        <Orange>
          <SubHeading>WHAT WE CAN DO!</SubHeading>
        </Orange>
        <p>
          <Orange>
            <b>THE SOLLUTION:</b>
          </Orange>{" "}
          We hope this enlightens you and helps you rethink consciously on how
          we use fashion. The first route to go from here is to promote circular
          economy by upcycling, recycling and reworking clothes, rather than the
          linear way of extraction, consumption and waste. Part of our
          suggestion to help solve these highlighted problems are:THE SOLLUTION:
          We hope this enlightens you and helps you rethink consciously on how
          we use fashion. The first route to go from here is to promote circular
          economy by upcycling, recycling and reworking clothes, rather than the
          linear way of extraction, consumption and waste. Part of our
          suggestion to help solve these highlighted problems are:
        </p>
        <List>
          <li>
            <FontAwesomeIcon icon={faCircle} />
            Think before you buy.
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} />
            Buy second-hand clothing from thrift stores, local markets, your
            family and friends “or online store like Repeddle”.{" "}
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} />
            Repair your damaged clothes instead of throwing them away. You can
            resale them on Repeddle App and Website.
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} />
            Buy high-quality clothing that you can keep and wear for a long
            time.{" "}
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} />
            Shopping second hand clothing is an income generation engine that
            supports social cause and small businesses.
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} />
            Support carbon-neutral and only buy from fair trade clothing brands.{" "}
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} />
            Buy clothing from your local designers and manufacturers to minimize
            shipping and transport emissions.
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} />
            Wash your clothes in cold water, and try to air-dry them instead of
            using an electric dryer.
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} />
            Avoid throw away, instead; Upcycle, Recycle, Reuse and Resell.
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} />
            Shopping more mindfully and buying pre-loved second hand is one of
            the best ways we can reduce fashion footprint on the environment.
          </li>
        </List>
        <div>
          By doing the above, you are contributing to sustainable fashion rather
          than waste, water, environmental pollution and carbon emission.
        </div>
      </Section>
      <Section>
        <SubHeading>UPCYCLE</SubHeading>
        <Row style={{ justifyContent: "space-around" }}>
          <Col>
            <Image
              src="https://res.cloudinary.com/emirace/image/upload/v1661221988/utopia-by-cho-LRqBE1z5kfE-unsplash_hnfa5j.webp"
              alt="img"
            />
          </Col>
          <Col>
            <Image
              src="https://res.cloudinary.com/emirace/image/upload/v1661221989/utopia-by-cho-SZzAEl8fpGQ-unsplash_i0cgwy.webp"
              alt="img"
            />
          </Col>
        </Row>
      </Section>
      <Section>
        <SubHeading>RECYCLE</SubHeading>
        <Row style={{ justifyContent: "space-around" }}>
          <Col>
            <Image
              src="https://res.cloudinary.com/emirace/image/upload/v1661221992/ravin-rau-eNOlrYUx5ZQ-unsplash_aeg1i9.webp"
              alt="img"
            />
          </Col>
          <Col>
            <Image
              src="https://res.cloudinary.com/emirace/image/upload/v1661221992/utopia-by-cho-lSGhDJK_XKc-unsplash_l29iy2.webp"
              alt="img"
            />
          </Col>
        </Row>
      </Section>
      <Section>
        <SubHeading>REUSE & RESELL</SubHeading>
        <Image
          src="https://res.cloudinary.com/emirace/image/upload/v1661221988/utopia-by-cho-rgC0lhKbr5o-unsplash_2_sckict.webp"
          alt="img"
        />
      </Section>
    </Container>
  );
}
