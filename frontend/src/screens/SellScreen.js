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
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Store } from "../Store";

const Container = styled.div`
  margin: 0 10vw;
  @media (max-width: 992px) {
    margin: 0 5vw;
  }
`;
const Header = styled.h1`
  font-weight: bold;
  position: absolute;
  max-width: 300px;
  text-shadow: #000 1px 0 10px;
  font-size: 80px;
  top: 50%;
  left: 10%;
  color: white;
  transform: translateY(-50%);
  @media (max-width: 992px) {
    font-size: 30px;
    top: 80%;
    text-align: center;
  }
`;
const Header2 = styled.h2`
  display: flex;
  text-align: center;
  justify-content: center;
  font-weight: bold;
  margin: 0 5px;
  @media (max-width: 992px) {
    font-size: 15px !important;
  }
`;
const SubHeading = styled.h4`
  margin: 0 5px;
  font-weight: bold;
  text-align: center;
  &.mobileshow {
    display: none;
  }
  @media (max-width: 992px) {
    font-size: 12px !important;
    &.nomobileshow {
      display: none;
    }
    &.mobileshow {
      display: block;
    }
  }
`;
const SubHeadingMalon = styled.h4`
  margin: 0 5px;
  font-weight: bold;
  color: var(--malon-color);
  @media (max-width: 992px) {
    font-size: 12px;
  }
`;
const Row = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;

  @media (max-width: 992px) {
    &.mobile {
      flex-direction: column;
    }
    &.scroll {
      overflow-x: auto;
      justify-content: start;
    }
    &.width {
      width: auto !important;
    }
  }
  &.gap {
    gap: 10px;
  }
`;

const Sides = styled.div`
  margin: 10px 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SubHeadingOrange = styled.h4`
  margin: 0 5px;
  font-weight: bold;
  @media (max-width: 992px) {
    font-size: 12px;
  }
  color: var(--orange-color);
`;

const ImageCont = styled.div`
  position: relative;
  width: 100%;
  height: 70vh;
  @media (max-width: 992px) {
    height: auto;
  }
`;
const MainImage = styled.img`
  width: 100%;
  margin: 10px 0;
  object-fit: cover;
  height: 100%;
`;

const Step = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  height: 200px;
  margin: 20px;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev2)"};

  padding: 10px;
  &.small {
    width: 350px;
  }
  @media (max-width: 992px) {
    margin: 10px 20px;
    &.small {
      width: 300px;
      margin: 10px 10px;
    }
  }
`;
const Text = styled.div`
  text-align: center;
  font-size: 16px;
  margin-bottom: 10px;
  @media (max-width: 992px) {
    font-size: 14px;
  }
`;
const Section = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 40px 0;
  &.back {
    background: ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
    padding: 20px;
    border-radius: 0.2rem;
  }
  @media (max-width: 992px) {
    margin: 20px 0;
    &.bottom {
      margin-bottom: 10px;
    }
    &.top {
      margin-top: 20px;
    }
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
  @media (max-width: 992px) {
    margin-bottom: 10px;
    width: 200px;
  }
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
  color: ${(props) =>
    props.mode === "pagebodylight"
      ? "var(--black-color)"
      : "var(--white-color)"};
  &:focus-visible {
    outline: none;
  }
`;

const RebatchImg = styled.img`
  margin: 20px 20px 20px 0;
  flex: 1;
  height: 500px;
  @media (max-width: 992px) {
    margin: 10px 0 10px 0;
    width: 200px;
  }
`;

const GetStart = styled.div`
  font-size: 40px;
  font-weight: bold;
  position: absolute;
  left: 55%;
  bottom: 10%;
  transform: translateX(-50%);
  @media (max-width: 992px) {
    font-size: 13px;
  }
`;
const Line = styled.div`
  display: none;
  opacity: 0.2;
  background: ${(props) => (props.mode === "pagebodydark" ? "white" : "black")};
  width: 100%;
  height: 1px;
  @media (max-width: 992px) {
    display: block;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  padding: 10px;
  border-radius: 0.2rem;
  z-index: 9;
  @media screen {
    padding: 5px;
    flex-direction: column;
  }
`;

const ButtonShow = styled.div`
  background: var(--orange-color);
  cursor: pointer;
  color: #fff;
  text-transform: uppercase;
  border-radius: 0.2rem;
  padding: 5px 10px;
  margin: 20px 10px 0 10px;
  &:hover {
    background: var(--malon-color);
  }
  @media (max-width: 992px) {
    margin-left: auto;
  }
`;
const Wondering = styled.div`
  color: white;
  font-size: 25px;
  font-weight: bold;
  @media (max-width: 992px) {
    font-size: 13px;
  }
`;

const ButtonText = styled.div`
  font-weight: bold;
  font-size: 25px;
  @media (max-width: 992px) {
    font-size: 13px;
  }
`;

export default function SellScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo } = state;

  const navigate = useNavigate();

  const [input, setInput] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (userInfo && userInfo.isSeller) {
      navigate("/newProduct");
    }
  }, [navigate, userInfo]);
  const handlesubmit = async () => {
    if (!input.length) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Please enter your email to get updates",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    try {
      const { data } = await axios.post("/api/newsletters/", {
        email: input,
        emailType: "Rebatch",
      });
      setInput("");
      setSent(true);
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: " Thank You For Submiting Your Email",
          showStatus: true,
          state1: "visible1 success",
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container>
      <Section>
        <Header2 style={{ fontSize: "30px" }}>
          LET YOUR WARDROBE LIVE IN YOUR POCKET, ITS FAST
        </Header2>
        <Row>
          <SubHeadingMalon>"CAN'T DO IT IN REAL LIFE?</SubHeadingMalon>
          <SubHeadingOrange>DO IT ON REPEDDLE"</SubHeadingOrange>
        </Row>
        <ImageCont>
          <MainImage
            src="https://res.cloudinary.com/emirace/image/upload/v1661221993/tamara-bellis-HPvN6rs86F0-unsplash_q78awc.webp"
            alt="main Image"
          />
          <Header>THE THRILL! START SELLING</Header>
        </ImageCont>
      </Section>
      <Section mode={mode}>
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
          <SubHeading style={{ fontSize: "1.5rem", margin: "0px" }}>
            - LIST -
          </SubHeading>
          <SubHeadingOrange>CASH-OUT.</SubHeadingOrange>
        </Row>
        <Row className="mobile" style={{ width: "80%" }}>
          <Sides>
            <PhoneImg
              src="https://res.cloudinary.com/emirace/image/upload/v1660107093/phonescreen_opkx9a.png"
              alt="imag"
            />
          </Sides>
          <Sides>
            <Step mode={mode} className="small">
              <SubHeading>1. TAKE A PICS</SubHeading>
              <Text>
                Your wardrobe getting cluttered or Storage keeps pilling up?
                Don't panic, we got you! Just take <b>nice</b> pics using a good
                source of natural lighting. Always remember "Great quality
                pictures sale fast"
              </Text>
            </Step>
            <Step mode={mode} className="small">
              <SubHeading>2. LIST & SHARE</SubHeading>
              <Text>
                Listing is easier than you think. With <b>10,400 brand</b> names
                to choose from our database, it's just a click away! List and
                describe your item with all information buyer needs to know, set
                your price and share to help buyers discover your listing.{" "}
              </Text>
            </Step>
            <Step mode={mode} className="small">
              <SubHeading>3. CASH-OUT</SubHeading>
              <Text>
                When your item is sold, ship your item with the prefered
                selected delivery method, once the buyer receives your item, you
                cash-out.
              </Text>
            </Step>
            <Link to="/newproduct">
              <Button>
                <Header2>SELL NOW</Header2>
              </Button>
            </Link>
          </Sides>
        </Row>

        <div>
          <SubHeading>THRIFT - BUY - SELL - CHAT - CASHOUT - REPEAT</SubHeading>
          <Row>
            <FontAwesomeIcon icon={faCircle} />
            <Header2 style={{ color: "var(--malon-color)" }}>ALL IN</Header2>
            <Header2>ONE</Header2>
            <Header2 style={{ color: "var(--orange-color)" }}>PLACE</Header2>
            <FontAwesomeIcon icon={faCircle} />
          </Row>
        </div>
      </Section>
      <Section className="back" mode={mode} style={{ padding: "10px" }}>
        <SubHeading>WHAT TO SELL?</SubHeading>
        <Text>
          FASHION - BEAUTY - FINE JEWLERY - HOME & ARTS - PET - CARE & GROOMING
          - GADGETS
        </Text>
        <Text>
          We accept all your pre-loved precious Items our community are
          constantly looking for, willing to love, and give a warm home.{" "}
        </Text>

        <Row className="gap scroll">
          <Imagesqr
            src="https://res.cloudinary.com/emirace/image/upload/v1661221989/james-ree-ZmeFtu11Hpc-unsplash_xzwcxb.webp"
            alt="img"
          />
          <Imagesqr
            src="https://res.cloudinary.com/emirace/image/upload/v1661221989/Screen_Shot_2022-08-06_at_2.16.31_PM_obdxfj.webp"
            alt="img"
          />
          <Imagesqr
            src="https://res.cloudinary.com/emirace/image/upload/v1661221989/john-torcasio-TJrkkhdB39E-unsplash_gjmphx.webp"
            alt="img"
          />
          <Imagesqr
            src="https://res.cloudinary.com/emirace/image/upload/v1661221989/arno-senoner-ZT16YkAYueo-unsplash_mhdyxh.webp"
            alt="img"
          />
          <Imagesqr
            src="https://res.cloudinary.com/emirace/image/upload/v1661221989/aditya-chinchure-jMh1p7EiV8Q-unsplash_1_dqffwg.webp"
            alt="img"
          />
        </Row>

        <Link to="/newproduct">
          <Button>
            <Header2>Start Selling</Header2>
          </Button>
        </Link>
      </Section>
      <Section>
        <Header2>RE:BATCH</Header2>
        <Row className="mobile width" style={{ width: "70%" }}>
          <SubHeading className="mobileshow" style={{ fontSize: "18px" }}>
            COMING SOON!!!
          </SubHeading>
          <SubHeading className="mobileshow" style={{ fontSize: "18px" }}>
            WANTS TO CONSIGN WITH US?
          </SubHeading>
          <RebatchImg
            src="https://res.cloudinary.com/emirace/image/upload/v1661221991/derick-anies-hDJT_ERrB-w-unsplash_tty8rb.webp"
            alt="img"
          />
          <div>
            <Text style={{ textAlign: "left", textAlign: "justify" }}>
              Repeddle Batch is a consignment option that offers a personalized
              service to our community members that wish to transfer their
              pre-loved items to a new loving home but don’t like the admin.
            </Text>
            <Text style={{ textAlign: "left", textAlign: "justify" }}>
              Consigning your garment is part of the steps you take to reduce
              fashion foot print on our environment. Save our planet by
              recycling garments instead of dumping them to landfills.
            </Text>
            {/* <div style={{ height: "30px" }} /> */}
            <SubHeading className="nomobileshow" style={{ fontSize: "18px" }}>
              COMING SOON!!!
            </SubHeading>
            <SubHeading className="nomobileshow" style={{ fontSize: "18px" }}>
              WANTS TO CONSIGN WITH US?
            </SubHeading>
            <Text style={{ textAlign: "left" }}>
              Drop Your email and we will let you know once we start accepting
              consignment
            </Text>

            <InputCont>
              <Input
                mode={mode}
                value={input}
                placeholder="Email:"
                onChange={(e) => setInput(e.target.value)}
              />
              <div
                style={{ cursor: "pointer", flex: 1 }}
                onClick={handlesubmit}
              >
                SUBMIT
              </div>
            </InputCont>
          </div>
        </Row>
      </Section>
      <Section className="bottom">
        <Header2>BULK n SLOT</Header2>
        <div style={{ position: "relative" }}>
          <MainImage
            style={{ width: "100%" }}
            src={
              mode === "pagebodylight"
                ? "https://res.cloudinary.com/emirace/image/upload/v1665979415/png_20221014_165106_0000_288__pg6wxw.webp"
                : "https://res.cloudinary.com/emirace/image/upload/v1665979442/png_20221014_164522_0000_287__vlarrx.webp"
            }
            alt="image"
          />
          <Link to="/sell">
            <GetStart>GET STARTED</GetStart>
          </Link>
        </div>
        <Text style={{ textAlign: "justify" }}>
          Repeddle BULK n SLOT offers opportunity to either retailers who are
          clearing out a large amount of items as clearance, or wholesalers who
          are selling items in bulk or slots also known as BALES. These option
          gives you the benefit to list a minimum of ten items in a bag/box and
          you can list as much items as you are able to deliver.
        </Text>
        <Text style={{ textAlign: "justify" }}>
          We initiated this solution to provide a self <b>B2B</b> services to
          our community members who may be in need to buy in bulk from fellow
          community members. If you’re a retailer and would prefer to buy items
          online that you can also resale online; these service carters for you,
          and if you are a wholesaler that prefer to sell your BALES online,
          this service is also tailored made for you.
        </Text>
        <SubHeading>THREE EASY STEPS TO USE BULK n SLOT</SubHeading>
        <Row style={{ alignItems: "flex-start", marginTop: "10px" }}>
          <b style={{ marginRight: "10px" }}>1.</b>
          <Text style={{ textAlign: "justify" }}>
            <b>TAKE A PIC/VIDEO:</b> Make sure to pack up to Ten (10) minimum
            items, you want to sell in a bag/box, snap a photo of your Bulk or
            Slot bag/box and take extra clear detailed photos or make a short
            video of items with any visible and reasonable tear & wear.
            Uploading video is optional, but strongly advised to make things
            easy for you and buyer.
          </Text>
        </Row>

        <Row style={{ alignItems: "flex-start" }}>
          <b style={{ marginRight: "10px" }}>2.</b>
          <Text style={{ textAlign: "justify" }}>
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
          <Text style={{ textAlign: "justify" }}>
            <b>SHARE AND CASH-OUT:</b> After a successful upload, be sure to
            share your listing, both on Repeddle’s platforms and social medias
            to help buyers discover your items. You can cash-out by either
            withdrawing your cash from your Repeddle’s wallet to your bank
            account or you can decide to further trade with it, buying more
            goods to sell, as soon as your item sale and buyer receives your
            shipment.
          </Text>
        </Row>
        <Button>
          <Header2>GET STARTED</Header2>
        </Button>
      </Section>
      <Line />
      <Section mode={mode} className="top">
        <Header2>WHY SELL WITH REPEDDLE?</Header2>
        <Row style={{ width: "90vw" }} className="mobile">
          <Step mode={mode} style={{ margin: "10px", height: "220px" }}>
            <SubHeading>MAKE A CHANGE</SubHeading>
            <Text>
              We’re changing the way (secondhand) fashion is perceived in Africa
              and the way fashion is used in general which contributes to
              enormous landfills that destroy our environments, making the
              environment almost unlivable. By selling with us, you’re joining
              this great cause.
            </Text>
          </Step>
          <Step mode={mode} style={{ margin: "10px", height: "220px" }}>
            <SubHeading style={{ textAlign: "center" }}>
              EASY SELLING & ORDER MANAGEMENT
            </SubHeading>
            <Text>
              Over 10,400 pre-installed popular designer brands to choose from,
              Automated selling and order management tools, Invoicing and sale
              analytics to make selling experience and engagement effortless.
            </Text>
          </Step>
          <Step mode={mode} style={{ margin: "10px", height: "220px" }}>
            <SubHeading>EASY DELIVERY OPTIONS</SubHeading>
            <Text>
              Variety of delivery options to choose from. Base on your
              preference and convenient, just click and choose the delivery
              option you would like to offer buyers. All within your control.
            </Text>
          </Step>
          <Step mode={mode} style={{ margin: "10px", height: "220px" }}>
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
      <Section mode={mode}>
        <Header2>WHAT YOU WILL GET</Header2>
        <Row style={{ width: "80vw" }} className="mobile">
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
                ACCESS TO DISCOUNT, GIFT CARD, PROMOTION AND FREE DELIVERY.
              </b>{" "}
              Offering creating tools to drive sales for your store.
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
        <Link to="/newproduct">
          <Button>
            <Header2>SELL NOW</Header2>
          </Button>
        </Link>
      </Section>

      <Section
        style={{
          backgroundImage:
            "url(https://res.cloudinary.com/emirace/image/upload/v1666772704/charlesdeluvio-1-nx1QR5dTE-unsplash_dzdawl.jpg)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center center",
          position: "relative",
        }}
      >
        <ButtonRow>
          <Wondering>WONDERING WHAT TO BUY?</Wondering>
          <Link to="/search" style={{ marginLeft: "auto" }}>
            <ButtonShow style={{ background: "var(--malon-color)" }}>
              <ButtonText>SHOP NOW</ButtonText>
            </ButtonShow>
          </Link>
        </ButtonRow>
        <div
          style={{
            position: "absolute",
            left: "0",
            top: "0",
            opacity: "0.4",
            background: "var(--malon-color)",
            width: "100%",
            height: "100%",
          }}
        ></div>
      </Section>
    </Container>
  );
}
