import { faCloud, faDroplet, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  margin: 0 10vw 5vw 10vw;
  & a {
    color: var(--malon-color);
  }
`;
const Header = styled.h2`
  font-weight: bold;
  font-size: 20px;
`;
const Text = styled.span`
  color: var(--malon-color);
`;
const List = styled.ul`
  & svg {
    margin: 15px;
  }
  & li {
    display: flex;
    align-items: center;
  }
`;
export default function FashionImpact() {
  return (
    <Container>
      <Header>REPEDDLE SUSTAINABILITY IMPACT</Header>
      <p>
        Save our environment (AFRICA) and planet from
        <Text>Landfill, Water pollution</Text> and <Text>Carbon Emission</Text>.
      </p>
      <p>
        We advocate for <b>clean air, clean water</b> and a{" "}
        <b>clean environment</b>. These are not too much to ask; these are
        common basic living condition!!!
      </p>
      <p>
        {" "}
        <Text>By buying and selling</Text> secondhand item on Repeddle, you’re
        not only reducing carbon footprint and saving the planet, but you are
        giving an African Child a better hope for tomorrow. Learn more on our
        sustainability take{" "}
        <Link to="/sustainability">
          <Text>here.</Text>
        </Link>
      </p>{" "}
      <Header>POSITIVE IMPACT OF USING SECONDHAND CLOTHES</Header>
      <List>
        <li>
          <FontAwesomeIcon size="3x" icon={faGlobe} /> 98% Chance of clothes
          ending up in landfills avoided.{" "}
        </li>
        <li>
          <FontAwesomeIcon size="3x" icon={faDroplet} /> 2,700 L of water saved
          for one person to drink for 900 days. “sustainablecampus.fsu.edu”{" "}
        </li>
        <li>
          <FontAwesomeIcon size="3x" icon={faCloud} /> 10% co2 of global carbon
          emissions avoided.
        </li>
      </List>
    </Container>
  );
}
