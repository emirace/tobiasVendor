import {
  faArrowLeft,
  faArrowRight,
  faChartColumn,
  faCircle,
  faGlobe,
  faMessage,
  faMoneyBill,
  faShield,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Store } from "../Store";

const Container = styled.div`
  margin: 0 10vw;
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
const SubHeadingMalon = styled.h4`
  margin: 0 5px;
  font-weight: bold;
  color: var(--malon-color);
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
const SubHeadingOrange = styled.h4`
  margin: 0 5px;
  font-weight: bold;
  color: var(--orange-color);
`;

const MainImage = styled.img`
  width: 100%;
  margin: 10px 0;
`;

const Step = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  height: 200px;
  margin: 30px;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev2)"};

  padding: 10px;
`;
const Text = styled.div`
  text-align: center;
  font-size: 16px;
  margin-bottom: 10px;
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
const Button = styled.div`
  background: var(--orange-color);
  cursor: pointer;
  color: #fff;
  text-transform: uppercase;
  border-radius: 0.2rem;
  padding: 5px 20px;
  margin: 10px;
  &:hover {
    background: var(--malon-color);
  }
`;
const Imagesqr = styled.img`
  width: 220px;
  height: 220px;
  object-fit: cover;
  margin-top: 20px;
`;
const PhoneImg = styled.img`
  width: 350px;
  margin-bottom: 20px;
`;
const InputCont = styled.div`
  border: 1px solid;
  border-radius: 0.2rem;
  height: 40px;
  width: 100%;
  align-items: center;
  padding: 0 5px;
  display: flex;
`;
const Input = styled.input`
  flex: 10;
  border: 0;
  height: 100%;
  background: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--black-color)"
      : "var(--white-color)"};
  &:focus-visible {
    outline: none;
  }
`;

const RebatchImg = styled.img`
  margin: 20px 20px 20px 0;
  flex: 1;
  width: 50%;
`;
export default function SellScreen() {
  const { state } = useContext(Store);
  const { mode } = state;
  return (
    <Container>
      <Header>THE THRILL! START SELLING</Header>
      <Section>
        <SubHeading>LET YOUR WARDROBE LIVE IN YOUR POCKET. ITS FAST</SubHeading>
        <Row>
          <SubHeadingMalon>CAN'T DO IT IN REAL LIFE?</SubHeadingMalon>
          <SubHeadingOrange>DO IT ON REPEDDLE</SubHeadingOrange>
        </Row>
        <MainImage
          src="https://res.cloudinary.com/emirace/image/upload/v1660101682/tamara-bellis-HPvN6rs86F0-unsplash_xxx1k0.jpg"
          alt="main Image"
        />
      </Section>
      <Section className="back" mode={mode}>
        <Row>
          <SubHeading>
            <FontAwesomeIcon icon={faArrowLeft} />
          </SubHeading>
          <Header2>THREE EASY STEPS</Header2>
          <SubHeading>
            <FontAwesomeIcon icon={faArrowRight} />
          </SubHeading>
        </Row>
        <Row>
          <SubHeadingMalon>SNAP</SubHeadingMalon>
          <SubHeading> - LIST - </SubHeading>
          <SubHeadingOrange>CASH-OUT.</SubHeadingOrange>
        </Row>
        <Row style={{}}>
          <Step mode={mode}>
            <SubHeading>1. TAKE A PICS</SubHeading>
            <Text>
              Your wardrobe getting cluttered or Storage keeps pillig up? Don't
              panic, we got you! Just take <b>nice</b> pics using a good source
              of natural lighting. Always remember "Great quality pictures sale
              fast"
            </Text>
          </Step>
          <Step mode={mode}>
            <SubHeading>2. LIST & SHARE</SubHeading>
            <Text>
              Listing is easier than you think. With <b>10,400 brand</b> names
              to choose from our database, it's just a click away! List and
              describe your item with all information buyer needs to know, set
              your price and share to help buyers discover your listing.{" "}
            </Text>
          </Step>
          <Step mode={mode}>
            <SubHeading>3. CASH OUT</SubHeading>
            <Text>
              When your item is sold, ship your item with the prefered selected
              delivery method, once the buyer receives your item, you cash out
            </Text>
          </Step>
        </Row>
        <Header2>SELL FOR FREE</Header2>
      </Section>
      <Section>
        <Row className="gap">
          <PhoneImg
            src="https://res.cloudinary.com/emirace/image/upload/v1660107093/phonescreen_opkx9a.png"
            alt="imag"
          />
          <div>
            <SubHeading>
              THRIFT - BUY - SELL - CHAT - CASH OUT - REPEAT
            </SubHeading>
            <Row>
              <FontAwesomeIcon icon={faCircle} />
              <Header2 style={{ color: "var(--malon-color)" }}>ALL IN</Header2>
              <Header2>ONE</Header2>
              <Header2 style={{ color: "var(--orange-color)" }}>PLACE</Header2>
              <FontAwesomeIcon icon={faCircle} />
            </Row>
          </div>
        </Row>
      </Section>
      <Section className="back" mode={mode}>
        <SubHeading>WHAT TO SELL?</SubHeading>
        <Text>
          FASHION - BEAUTY - FINE JEWLERY - HOME & ARTS - PET CARE & GROOMING -
          GADGETS
        </Text>
        <Text>
          We accept all your pre-loved precious Items, our communitu are
          constantly looking for,willing to love, and give a warm home.{" "}
        </Text>
        <Button>Start Selling</Button>
        <Row className="gap">
          <Imagesqr
            src="https://res.cloudinary.com/emirace/image/upload/v1660109775/james-ree-ZmeFtu11Hpc-unsplash_mwt5xp.jpg"
            alt="img"
          />
          <Imagesqr
            src="https://res.cloudinary.com/emirace/image/upload/v1660109774/Screen_Shot_2022-08-06_at_2.16.31_PM_hyotfb.png"
            alt="img"
          />
          <Imagesqr
            src="https://res.cloudinary.com/emirace/image/upload/v1660109804/john-torcasio-TJrkkhdB39E-unsplash_h7uh9y.jpg"
            alt="img"
          />
          <Imagesqr
            src="https://res.cloudinary.com/emirace/image/upload/v1660109783/arno-senoner-ZT16YkAYueo-unsplash_paebl8.jpg"
            alt="img"
          />
          <Imagesqr
            src="https://res.cloudinary.com/emirace/image/upload/v1660109780/aditya-chinchure-jMh1p7EiV8Q-unsplash_itxtcy.jpg"
            alt="img"
          />
        </Row>
      </Section>
      <Section>
        <Header2>RE:BATCH</Header2>
        <div style={{ maxWidth: "100%" }}>
          <Text style={{ textAlign: "left" }}>
            Repeddle Batch is a consignment option that offers a personalized
            service to our community members that wish to transfer their
            pre-loved items to a new loving home but don’t like the admin.
          </Text>
          <Text style={{ textAlign: "left" }}>
            Consigning your garment is part of the steps you take to reduce
            fashion foot print on our environment. Serve our planet by recycling
            garments instead of dumping them to landfills.
          </Text>
          <Text style={{ textAlign: "left" }}>
            Repeddle BULK n SLOT offers opportunity to either retailers who are
            clearing out a large amount of items as clearance or wholesalers who
            are selling items in bulk or slots, also known as BALES. These
            option gives you the benefit to list a minimum of ten items in a
            bag/box and you can list as much items as you are able to deliver.
          </Text>
          <Row>
            <RebatchImg
              src="https://res.cloudinary.com/emirace/image/upload/v1660106381/derick-anies-hDJT_ERrB-w-unsplash_r196go.jpg"
              alt="img"
            />
            <div>
              <SubHeading style={{ fontSize: "18px" }}>
                COMING SOON!!!
              </SubHeading>

              <SubHeading style={{ fontSize: "18px" }}>
                WANTS TO CONSIGN WITH US?
              </SubHeading>
              <Text style={{ textAlign: "left" }}>
                Drop Your email and we will let you know once we start accepting
                consignment
              </Text>

              <InputCont>
                <Input mode={mode} placeholder="Email:" />
                <div style={{ cursor: "pointer", flex: 1 }}>SUBMIT</div>
              </InputCont>
            </div>
          </Row>
        </div>
      </Section>
      <Section>
        <Header2>BULK n SLOT</Header2>
        <MainImage
          style={{ width: "100%" }}
          src={
            mode === "pagebodylight"
              ? "https://res.cloudinary.com/emirace/image/upload/v1660128407/For_Dark_Theme_yeyaca.png"
              : "https://res.cloudinary.com/emirace/image/upload/v1660128410/For_Light_Theme_nivosx.png"
          }
          alt="image"
        />
        <Text style={{ textAlign: "left" }}>
          Repeddle BULK n SLOT offers opportunity to either retailers who are
          clearing out a large amount of items as clearance or wholesalers who
          are selling items in bulk or slots, also known as BALES. These option
          gives you the benefit to list a minimum of ten items in a bag/box and
          you can list as much items as you are able to deliver.
        </Text>
        <Text style={{ textAlign: "left" }}>
          We initiated this solution to provide a self B2B services to our
          community members who may be in need to buy in bulk from fellow
          community members. If you’re a retailer and would prefer to buy items
          online that you can also resale online; these service carters for you,
          and if you are a wholesaler that prefer to sell your BALES online,
          this service is also tailored made for you.
        </Text>
        <SubHeading>THREE EASY STEPS TO USE BULK n SLOT</SubHeading>
        <Row style={{ alignItems: "flex-start" }}>
          <b style={{ marginRight: "10px" }}>1.</b>
          <Text style={{ textAlign: "left" }}>
            <b>TAKE A PIC/VIDEO:</b> Make sure to pack up to Ten (10) items
            minimum, you want to sell in a bag/box, snap a photo of your Bulk or
            Slot bag/box and take extra clear detailed photos or make a short
            video of items with any visible and reasonable tear & wear.
            Uploading video is optional, but strongly advised to make things
            easy for you and buyer.
          </Text>
        </Row>

        <Row style={{ alignItems: "flex-start" }}>
          <b style={{ marginRight: "10px" }}>2.</b>
          <Text style={{ textAlign: "left" }}>
            <b>LIST:</b> Ensure to describe in details the conditions of your
            items as per our condition guidelines before listing your Bulk or
            Slot bag/box, give full details of items in the description and if
            your bag/box contains more than 10 items, be sure to state how many
            items it contains while listing. Please provide as much information
            as possible in description, this information will help buyers make
            better informed purchase decision. Any misleading information or not
            providing information buyer needs to know about your items before
            purchase may result to return and refund.
          </Text>
        </Row>

        <Row style={{ alignItems: "flex-start" }}>
          <b style={{ marginRight: "10px" }}>3.</b>
          <Text style={{ textAlign: "left" }}>
            <b>SHARE AND CASH OUT:</b> After a successful upload, be sure to
            share your listing both on Repeddle’s platforms and social medias to
            help buyers discover your items. You can cash out by either
            withdrawing your cash from your Repeddle’s wallet to your bank
            account or you can decide to further trade with it, buying more
            goods to sell, as soon as your item sale and buyer receives your
            shipment.
          </Text>
        </Row>
        <Button>
          <Header2>GET STARTED FREE</Header2>
        </Button>
      </Section>
      <Section mode={mode}>
        <Header2>WHY SELL WITH REPEDDLE</Header2>
        <Row style={{ width: "90vw" }}>
          <Step mode={mode} style={{ margin: "10px", height: "250px" }}>
            <SubHeading>MAKE A CHANGE</SubHeading>
            <Text>
              We’re changing the way (secondhand) fashion is perceived in Africa
              and the way fashion is used in general which contributes to
              enormous landfills that destroy our environments, making the
              environment almost unlivable. By selling with us, you’re joining
              this great cause.
            </Text>
          </Step>
          <Step mode={mode} style={{ margin: "10px", height: "250px" }}>
            <SubHeading>EASY SELLING & ORDER MANAGEMENT</SubHeading>
            <Text>
              Over 10,400 pre-installed popular designer brands to choose from,
              Automated selling and order management tools, Invoicing and sale
              analytics to make selling experience and engagement effortless.
            </Text>
          </Step>
          <Step mode={mode} style={{ margin: "10px", height: "250px" }}>
            <SubHeading>EASY DELIVERY OPTIONS</SubHeading>
            <Text>
              Variety of delivery options to choose from. Base on your
              preference and convenient, just click and choose the delivery
              option you would like to offer buyers. All within your control.
            </Text>
          </Step>
          <Step mode={mode} style={{ margin: "10px", height: "250px" }}>
            <SubHeading>GROWING COMMUNINTY</SubHeading>
            <Text>
              Access to a vast community of open minded, yet environmentally
              conscious individuals who enjoys the thrills of thrifting, likes
              to have fun with their listing, and being creative while making
              quick cash on social commerce platform.
            </Text>
          </Step>
        </Row>
      </Section>
      <Section
        mode={mode}
        style={{ marginLeft: "-5vw", width: "90vw" }}
        className="back"
      >
        <Header2>WHAT YOU WILL GET</Header2>
        <Row style={{ width: "80vw" }}>
          <Step mode={mode} style={{ margin: "10px", height: "220px" }}>
            <FontAwesomeIcon
              size="4x"
              icon={faMessage}
              color={"var(--orange-color)"}
            />
            <Text>
              Real-time notification on transactions, Repeddle community
              engagements with{" "}
              <b style={{ color: "var(--malon-color)" }}>
                DIRECT IN APP/MESSAGE SYSTEM
              </b>{" "}
              for you and your buyers to make sale communication easy and fast.
            </Text>
          </Step>
          <Step mode={mode} style={{ margin: "10px", height: "220px" }}>
            <FontAwesomeIcon
              size="4x"
              icon={faShield}
              color={"var(--orange-color)"}
            />
            <Text>
              Protected transactions for sellers and buyers with (
              <b style={{ color: "var(--malon-color)" }}>
                REPEDDLE BUYER & SELLERS PROTECTION
              </b>
              ), a personalized wallet and world class secured payment system.
            </Text>
          </Step>
          <Step mode={mode} style={{ margin: "10px", height: "220px" }}>
            <FontAwesomeIcon
              size="4x"
              icon={faMoneyBill}
              color={"var(--orange-color)"}
            />
            <Text>
              Coupons and campaigns:{" "}
              <b style={{ color: "var(--malon-color)" }}>
                ACCESS TO DISCOUNT, GIFT CARD, PROMOTION AND FREE DELIVERY
              </b>{" "}
              offering creating tools to drive sales for your store.
            </Text>
          </Step>
          <Step mode={mode} style={{ margin: "10px", height: "220px" }}>
            <FontAwesomeIcon
              size="4x"
              icon={faChartColumn}
              color={"var(--orange-color)"}
            />
            <Text>
              Customized marketing tools and algorithm to help your listing get
              the popularity it needs and sell fast, including{" "}
              <b style={{ color: "var(--malon-color)" }}>
                REPEDDLE VIP VERIFICATION SHIELD.
              </b>
            </Text>
          </Step>
        </Row>

        <Button>
          <Header2>SELL FREE NOW</Header2>
        </Button>
      </Section>

      <Section>
        <Text>
          <b>WONDERING WHAT TO BUY?</b>
        </Text>
        <Link to="/search">
          <Button>
            <Header2>SHOP NOW</Header2>
          </Button>
        </Link>
      </Section>
    </Container>
  );
}
