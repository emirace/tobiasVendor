import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  margin: 0 15vw;
  & a {
    color: var(--malon-color);
  }
`;
const Header = styled.h1`
  display: flex;
  justify-content: center;
  font-weight: bold;
`;
const Header2 = styled.h2`
  display: flex;
  justify-content: center;
  font-weight: bold;
  margin: 0 5px;
`;
const SubHeading = styled.h4`
  margin: 0 5px;
  font-weight: bold;
`;

const Image = styled.img`
  width: 100%;
  margin: 10px;
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
const Row = styled.div`
  display: flex;
`;
const SmallImg = styled.div`
  width: 300px;
`;
const Image2 = styled.img`
  width: 50%;
  padding: 5px;
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

export default function About() {
  return (
    <Container>
      <Helmet>
        <title>About Us</title>
      </Helmet>
      <Header>OUR STORY</Header>
      <div>
        <b>INSPIRING A GENERATION:</b> Crafting our story of a sustainable
        circular fashion in Africa, one garment at a time, one person at a time,
        and one loving home at a time.
      </div>
      <Image
        src="https://res.cloudinary.com/emirace/image/upload/v1660192223/20220711_223429_0000_fpvzbl.png"
        alt="img"
      />
      <Image
        src="https://res.cloudinary.com/emirace/image/upload/v1660192223/20220711_223429_0000_fpvzbl.png"
        alt="img"
      />
      <Section>
        <SubHeading>WHO WE ARE</SubHeading>
        <div>
          Repeddle is Africa’s leading social marketplace for Pre-loved fashion,
          Gen-Z, Millennials, the Environment and your Budget. By fostering a
          creative generation of conscious fashion consumers to better the
          planet and our environment, we approach solving Africa’s fashion waste
          crisis.
        </div>
        <div>
          Become Part of Our Community Member; Click the JOIN US button above.{" "}
        </div>
      </Section>
      <Section>
        <SubHeading>REPEDDLE EXPLAINED: (THE M.G.H.)</SubHeading>
        <Row>
          <SmallImg
            src="https://res.cloudinary.com/emirace/image/upload/v1660106384/cytonn-photography-n95VMLxqM2I-unsplash_mdqay8.jpg"
            alt="img"
          />
          <SmallImg
            src="https://res.cloudinary.com/emirace/image/upload/v1657405562/yne3ejukoc1glryhx7zk.png"
            alt="img"
          />
        </Row>
        <div>
          <b>THE MEANING:</b> Our name <b>REPEDDLE</b> is derived from two words
          “Re & Peddle” <b>Re</b>- Meaning: “Once more; afresh; anew” and{" "}
          <b>Peddle</b>- Meaning: “Try to sell (something, especially small
          goods) by going from place to place”.
        </div>
        <div>
          <b>OUR SYMBOL</b>: Our symbol represents a handshake in a circular
          form, meaning; people agreeing to join forces to achieve a beneficial
          common goal, theses goal is to better both humanity and the planet.
          The circular form interprets as “recycling” that helps us save the
          planet. These put together, is part of our company’s vision: “people
          coming together to form community that solves environmental crisis
          through fashion Re-use and Recycling”
        </div>
        <div>
          <b>THE GOAL</b>: Our goal is to help address part of global
          environmental crisis, “Carbon emissions, Landfills and Waste”, which
          has led to global warming state of emergency, and fashion industry
          being the 2nd largest contributor to these global problems.
        </div>
        <div>
          THE HOW: By providing a platform for a likeminded community that
          believes in a common goal, we address these challenges and encourage
          our community to “once more, refresh and make anew” fashion items to
          “Resell & Thrift” them on Repeddle.
        </div>
        <div>
          By so doing, we are radically reducing the impact of fashion footprint
          on our planet and making our environment a better place for all to
          live.
        </div>
      </Section>
      <Section>
        <SubHeading>NOW, LET'S GO PEDDLE</SubHeading>
        <SubHeading>DOWNLOAD OUR APP</SubHeading>
        <Row>
          <Image2
            src="https://res.cloudinary.com/emirace/image/upload/v1660106368/andhika-soreng-XuJ9qu47S2c-unsplash_zet7ow.jpg"
            alt="img"
          />
          <Image2
            src="https://res.cloudinary.com/emirace/image/upload/v1660106376/blubel-TL5JFCvITp4-unsplash_wuc6rd.jpg"
            alt="img"
          />
        </Row>
      </Section>
      <Section>
        <SubHeading>REUSE & SECONDHAND</SubHeading>
        <SubHeading>POSITIVE IMPACT OF USING PRE-LOVED GARMENT</SubHeading>
        <SubHeading>SECONDHAND = SECONDCHANCE</SubHeading>
        <div>
          By buying and selling secondhand item on Repeddle, you’re not only
          reducing carbon footprint and saving the planet, but you are giving an
          African Child a better hope for tomorrow. Learn more on our
          sustainability take <Link to="/sustainability">here</Link>
        </div>
        <List>
          <li>
            <FontAwesomeIcon icon={faCircle} />
            <b>98%</b> Chance of clothes ending up in landfills avoided.
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} />
            2,700 L of water saved for one person to drink for 900 days.
            “sustainablecampus.fsu.edu”
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} />
            10% Co2 of global carbon emissions avoided.
          </li>
        </List>
        <Link to="/sell">
          <SubHeading> GO PEDDLE</SubHeading>
        </Link>
      </Section>
      <Section>
        <SubHeading>
          IT STARTS WITH LESS - MAKING IT BETTER FOR AFRICA +THE PLANET
        </SubHeading>
        <div>
          By buying and selling secondhand item on Repeddle, you’re not only
          reducing carbon footprint and saving the planet, but you are giving an
          African Child a better hope for tomorrow. Learn more on our
          sustainability take <Link to="/sustainability">here</Link>
        </div>
        <List>
          <li>
            <FontAwesomeIcon icon={faCircle} />
            Think before you buy.
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} />
            Buy second-hand clothing from thrift stores, local markets, your
            family and friends or online like Repeddle.
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} />
            Discourage throw away culture, repair your damaged clothes instead
            of throwing them away. You can resale them on Repeddle App and
            Website.{" "}
          </li>
        </List>

        <Link to="/sell">
          <SubHeading>
            THINK THE PLANET, THINK THE ENVIRONMENT, THINK REPEDDLE{" "}
          </SubHeading>
        </Link>
      </Section>

      <Section>
        <SubHeading>UPCYLE. RECYCLE. REUSE. RESELL</SubHeading>
        <SubHeading>
          MAKING SUSTAINABILITY MORE IMPACTFUL IN THREE EASY WAYS
        </SubHeading>
        <SubHeading>THE REPEDDLE VIP SHIELD</SubHeading>
        <List>
          <li>
            <FontAwesomeIcon icon={faCircle} />
            First, we advance the conversation of secondhand fashion as part of
            the solution for sustainable fashion, address the footprint and
            impact of fashion in Africa, our environment and the planet.
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} />
            Second we strive to take fashion waste off our environment by
            encouraging people to upcycle, recycle, rework, reuse and resell
            fashion by making fashion affordable and sustainable to avoid waste,
            landfills and carbon emission.
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} />
            Third, we offer the best and quality rare finds to Africa’s Pre-love
            fashion lovers and community on Repeddle, helping them to always
            think secondhand first.
          </li>
        </List>

        <Link to="/">
          <SubHeading>REPEDDLE VIP SHIELD</SubHeading>
        </Link>
      </Section>
    </Container>
  );
}
