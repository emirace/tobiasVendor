import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Helmet } from "react-helmet-async";
import styled from "styled-components";

const Container = styled.div`
  margin: 0 10vw;
  & a {
    color: var(--malon-color);
  }
`;

const List = styled.ul`
  & svg {
    font-size: 8px;
    margin: 5px;
  }
  & li {
    display: flex;
    align-items: center;
  }
`;
const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 50px 0;
  &.back {
    background: ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
    padding: 20px;
    border-radius: 0.2rem;
  }
`;

export default function SustainabilityImpact() {
  return (
    <Container>
      <Helmet>
        <title>Sustainability Impact</title>
      </Helmet>
      <Section>
        <h1 style={{ fontWeight: "bold" }}>REPEDDPLE SUSTAINABILITY IMPACT</h1>
        <div>
          Fashion industry is the second most intense water consuming and
          polluting industry in the world, releasing up to 10% global carbon
          emission, greater than international airlines and maritime logistic
          combined. Repeddle is embarked on reducing some of this pollution our
          continent “Africa” is faced, in order for we to do so, we must firstly
          change the way people perceive and use fashion. Addressing stigma
          associated with secondhand thrifting is a good place to start.
        </div>
        <div>
          Research has shown that international fast fashion companies target
          Africa as the final destination for their unsold, abandoned or used
          product that their international consumers no longer want or use. This
          over the years has increasingly turned Africa as a dumping ground,
          hence causing enormous landfills in Africa.{" "}
        </div>
        <div>
          Repeddle is set to address this landfills problems in Africa by
          creating a platform that will change the way we trade secondhand.
          Below are some facts to look at, just to give few insights on why we
          need to take this very seriously.
        </div>
        <h3 style={{ color: "var(--malon-color)", fontWeight: "bold" }}>
          WHAT YOU MAY NEED TO KNOW! “THE PROBLEM”{" "}
        </h3>
        <div style={{ textAlign: "left" }}>
          {" "}
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
      </Section>
    </Container>
  );
}
