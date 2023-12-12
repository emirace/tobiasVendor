import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Store } from "../../Store";
import useWindowDimensions from "../Dimension";
import { ReactComponent as Globe } from "./../../icons/Icons-10.svg";
import { ReactComponent as House } from "./../../icons/Icons-27.svg";
import { ReactComponent as Leaf } from "./../../icons/Icons-29.svg";

const Container = styled.div`
  margin: 0 15vw;
  & a {
    color: var(--malon-color);
    &:hover {
      color: var(--orange-color);
      text-decoration: underline;
    }
  }
  @media (max-width: 992px) {
    margin: 0 5vw;
  }
`;
const Header = styled.h1`
  display: flex;
  justify-content: center;
  font-weight: bold;
  @media (max-width: 992px) {
    font-size: 20px;
  }
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
  font-size: 20px;
  text-align: center;
  @media (max-width: 992px) {
    font-size: 18px;
  }
`;

const Image = styled.img`
  width: 100%;
  margin: 10px;
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
  @media (max-width: 992px) {
    &.column {
      flex-direction: column;
    }
  }
`;
const Image2 = styled.img`
  width: 100%;
  object-fit: contain;
`;
const Image2Cont = styled.div`
  position: relative;
  width: 50%;
  padding: 5px;
`;
const DownloadCont = styled.img`
  position: absolute;
  bottom: 10px;
  right: 10px;
  width: 40%;
`;

const List = styled.ul`
  list-style-type: disc;
`;

const Para = styled.div`
  margin-top: 5px;
`;

const CenHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;
const JoinUs = styled.div`
  background: var(--orange-color);
  position: absolute;
  top: 80%;
  left: 50%;
  padding: 5px 10px;
  border-radius: 0.2rem;
  color: white;
  transform: translateX(-50%);
  font-size: 30px;
  font-weight: bold;
  @media (max-width: 992px) {
    font-size: 13px;
    top: 75%;
    left: 45%;
  }
`;
const ThinkBold = styled.div`
  font-weight: bold;
  text-align: center;
`;

const ComingSoon = styled.h3`
  position: absolute;
  top: 50%;
  left: 50%;
  font-weight: bold;
  color: white;
  font-size: 50px;
  transform: translate(-50%, -50%);
  text-shadow: #000 1px 0 10px;
  text-align: center;
  white-space: nowrap;
  @media (max-width: 992px) {
    font-size: 30px;
  }
`;

export default function About() {
  const { state } = useContext(Store);
  const { mode } = state;
  const { width } = useWindowDimensions();
  const size = width > 992 ? 200 : 70;
  return (
    <Container>
      <Helmet>
        <title>About Us</title>
      </Helmet>
      <Header>OUR STORY</Header>
      <div align="center">
        <b>INSPIRING A GENERATION:</b> Crafting our story of a sustainable
        circular fashion in Africa, one garment at a time, one person at a time,
        and one loving home at a time.
      </div>
      <div style={{ position: "relative" }}>
        <Image
          src="https://res.cloudinary.com/emirace/image/upload/v1666946911/20221028_104228_0000_hnjzz1.webp"
          alt="img"
        />
        <Link to="/signup">
          <JoinUs>JOIN US</JoinUs>
        </Link>
      </div>
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
          <Image2Cont>
            <Image2
              src="https://res.cloudinary.com/emirace/image/upload/v1661221991/cytonn-photography-n95VMLxqM2I-unsplash_zjvrqp.webp"
              alt="img"
            />
          </Image2Cont>
          <Image2Cont>
            <Image2
              src={
                mode === "pagebodydark"
                  ? "https://res.cloudinary.com/emirace/image/upload/v1657405562/yne3ejukoc1glryhx7zk.png"
                  : "https://res.cloudinary.com/emirace/image/upload/v1666953838/Repeddle_Logo-02_ztvmtx.png"
              }
              alt="img"
            />
          </Image2Cont>
        </Row>
        <Para>
          <b>THE MEANING:</b> Our name <b>REPEDDLE</b> is derived from two words
          “Re & Peddle” <b>Re</b>- Meaning: “Once more; afresh; anew” and{" "}
          <b>Peddle</b>- Meaning: “Try to sell (something, especially small
          goods) by going from place to place”.
        </Para>
        <Para>
          <b>OUR SYMBOL</b>: Our symbol represents a handshake in a circular
          form, meaning; people agreeing to join forces to achieve a beneficial
          common goal, theses goal is to better both humanity and the planet.
          The circular form interprets as “recycling” that helps us save the
          planet. These put together, is part of our company’s vision: “
          <i>
            people coming together to form community that solves environmental
            crisis through fashion Re-use and Recycling
          </i>
          ”
        </Para>
        <Para>
          <b>THE GOAL</b>: Our goal is to help address part of global
          environmental crisis, “<i>Carbon emissions, Landfills and Waste</i>”,
          which has led to global warming state of emergency, and fashion
          industry being the 2nd largest contributor to these global problems.
        </Para>
        <Para>
          <b>THE HOW</b>: By providing a platform for a likeminded community
          that believes in a common goal, we address these challenges and
          encourage our community to “once more, refresh and make anew” fashion
          items to “Resell & Thrift” them on Repeddle. By so doing, we are
          radically reducing the impact of fashion footprint on our planet and
          making our environment a better place for all to live.
        </Para>
      </Section>
      <Section>
        <SubHeading>NOW, LET'S GO PEDDLE; DOWNLOAD OUR APP</SubHeading>
        <Row style={{ position: "relative" }}>
          <Image2Cont>
            <Image2
              src="https://res.cloudinary.com/emirace/image/upload/v1661221990/andhika-soreng-XuJ9qu47S2c-unsplash_po2ujf.webp"
              alt="img"
            />
            <DownloadCont src="/images/as.png" alt="playstore" />
          </Image2Cont>
          <Image2Cont>
            <Image2
              src="https://res.cloudinary.com/emirace/image/upload/v1661221991/blubel-TL5JFCvITp4-unsplash_q3ygsq.webp"
              alt="img"
            />
            <DownloadCont src="/images/gp.png" alt="playstore" />
          </Image2Cont>
          <ComingSoon>COMING SOON</ComingSoon>
        </Row>

        <Link to="/sell">
          <ThinkBold>
            THINK THE PLANET, THINK THE ENVIRONMENT, THINK REPEDDLE; GO PEDDLE{" "}
          </ThinkBold>
        </Link>
      </Section>

      <Section>
        <Row style={{ alignItems: "center" }} className="column">
          <div style={{ flex: "1" }}>
            <House height={size} width={size} />
          </div>
          <div style={{ flex: "2" }}>
            <CenHeader>
              <SubHeading>REUSE & SECONDHAND</SubHeading>
              <SubHeading>
                POSITIVE IMPACT OF USING PRE-LOVED GARMENT
              </SubHeading>
              <SubHeading>SECONDHAND = SECONDCHANCE</SubHeading>
            </CenHeader>
            <div>
              By buying and selling secondhand item on Repeddle, you’re not only
              reducing carbon footprint and saving the planet, but you are
              giving an African Child a better hope for tomorrow. Learn more on
              our sustainability take <Link to="/sustainability">here</Link>
            </div>
            <List>
              <li>
                <b>98%</b> Chance of clothes ending up in landfills avoided.
              </li>
              <li>
                <b>2,700L</b> of water saved for one person to drink for 900
                days. “sustainablecampus.fsu.edu”
              </li>
              <li>
                <b>10%</b> Co2 of global carbon emissions avoided.
              </li>
            </List>
          </div>
        </Row>
      </Section>
      <Section>
        <Row style={{ alignItems: "center" }} className="column">
          <div style={{ flex: "1" }}>
            <Globe height={size} width={size} />
          </div>
          <div style={{ flex: "2" }}>
            <CenHeader>
              <SubHeading>IT STARTS WITH LESS -</SubHeading>
              <SubHeading> MAKING IT BETTER FOR AFRICA</SubHeading>
              <SubHeading> +THE PLANET</SubHeading>
            </CenHeader>

            <List>
              <li>Think before you buy.</li>
              <li>
                Buy second-hand clothing from thrift stores, local markets, your
                family and friends or online like Repeddle.
              </li>
              <li>
                Discourage throw away culture, repair your damaged clothes
                instead of throwing them away. You can resale them on Repeddle
                App and Website.{" "}
              </li>
            </List>
          </div>
        </Row>
      </Section>

      <Section>
        <Row style={{ alignItems: "center" }} className="column">
          <div style={{ flex: "1" }}>
            <Leaf height={size} width={size} />
          </div>
          <div style={{ flex: "2" }}>
            <CenHeader>
              <SubHeading>UPCYLE. RECYCLE. REUSE. RESELL</SubHeading>
              <SubHeading>
                MAKING SUSTAINABILITY MORE IMPACTFUL IN THREE EASY WAYS
              </SubHeading>
              <SubHeading>THE REPEDDLE VIP SHIELD</SubHeading>
            </CenHeader>
            <List>
              <li>
                First, we advance the conversation of secondhand fashion as part
                of the solution for sustainable fashion, address the footprint
                and impact of fashion in Africa, our environment and the planet.
              </li>
              <li>
                Second we strive to take fashion waste off our environment by
                encouraging people to upcycle, recycle, rework, reuse and resell
                fashion by making fashion affordable and sustainable to avoid
                waste, landfills and carbon emission.
              </li>
              <li>
                Third, we offer the best and quality rare finds to Africa’s
                Pre-love fashion lovers and community on Repeddle, helping them
                to always think secondhand first.
                <Link to="/vipshield">
                  <b>REPEDDLE VIP SHIELD</b>
                </Link>
              </li>
            </List>
          </div>
        </Row>
      </Section>
    </Container>
  );
}
