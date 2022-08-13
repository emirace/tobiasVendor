import { faCircle } from "@fortawesome/free-solid-svg-icons";
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
const Header2 = styled.h2`
  font-size: 20px;
  color: var(--malon-color);
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
const PhoneImg = styled.img`
  width: 350px;
  margin-bottom: 10px;
  margin-top: 20px;
`;
const Center = styled.div`
  display: flex;
  gap: 50px;
`;
export default function Bundle() {
  return (
    <Container>
      <Section>
        <Header>RE: BUNDLE</Header>
        <p>
          <b>
            Something great caught your eye? Wondering if you could buy them
            together using one delivery fee? <b>Yes, you can!</b>
          </b>
        </p>
      </Section>
      <Section>
        <Header>HOW IT WORKS</Header> <Header2>BUYER</Header2>
        <p>
          Shopping for something on the App or Website and see item(s) you can’t
          let go from the same seller profile/shop? You can shop them all and
          pay for <b>one delivery fee.</b>
        </p>{" "}
        <p>
          It’s simple; When you purchase an item using a preferred delivery
          method as offered by the seller, and the seller enabled “Re:Bundle”
          option for their profile, you have <b>Two Hours</b> window circle to
          make more additional purchase. By so; You only pay for the first
          delivery, and the rest items you buy from the same seller within the
          open two hours’ window will be eligible for free delivery.
        </p>
        <p>
          {" "}
          This means the seller will ship all items in one package (including
          the first purchase) so you have bought multiple items, paid for one
          delivery, and get free delivery for the other items.
        </p>
        <Header2>SELLER</Header2>
        <p>
          {" "}
          Care about your customers/fans enough to give them the opportunity to
          spend less on delivery cost? This also means more earnings for you.
        </p>
        <p>
          {" "}
          Enabling <b>Re:Bundle</b> option in your profile/shop gives a buyer
          the opportunity to pay for one delivery fee, buy various items for the
          next <b>two hours</b> and get <b>free delivery</b> for the rest items
          they buy within that two hours window after they pay for the first
          delivery cost.
        </p>
        <p>
          When a seller enables Re:Bundle Option in their profile/shop, they
          will package all items as one package, (
          <i>including the first purchase</i>) to other purchases the same buyer
          has made within two hours window and ship as one.
        </p>
      </Section>
      <Section>
        <Header>LET’S BREAK IT DOWN</Header> <Header2>AS A BUYER:</Header2>
        <List>
          <li>
            <FontAwesomeIcon icon={faCircle} /> You add the first item to your
            cart.{" "}
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} /> You check out and pay for the
            first item + the preferred offered delivery fee.{" "}
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} />
            Within two hours from the first purchase, you are eligible for free
            delivery for other items you buy from the same seller/shop because
            they have enabled the Re:Bundle option on their shop.{" "}
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} />
            The free delivery elapses after two hours you made the first
            purchase.
          </li>
        </List>
        <Header2> AS A SELLER:</Header2>
        <List>
          <li>
            <FontAwesomeIcon icon={faCircle} /> You activate Re:Bundle on your
            profile/shop.{" "}
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} /> Buyers will pay for delivery
            only on the first purchase, and within two hours from that first
            purchase, they will be able to buy more items from your shop and get
            free delivery for the rest items they bought within the two hours’
            window.{" "}
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} /> When the two hours’ window ends,
            you will package all items the buyer purchased (including the first
            item purchased) and ship them as one package.{" "}
          </li>
          <li>
            <FontAwesomeIcon icon={faCircle} /> This means more sale and more
            earnings for you.
          </li>
        </List>
        <div> See sample image bellow</div>
        <Center>
          <div>
            <PhoneImg
              src="https://res.cloudinary.com/emirace/image/upload/v1660107093/phonescreen_opkx9a.png"
              alt="imag"
            />
            <div>
              <b>Purchase No 1</b> - Free delivery option is visible but grayed
              out
            </div>
          </div>
          <div>
            <PhoneImg
              src="https://res.cloudinary.com/emirace/image/upload/v1660107093/phonescreen_opkx9a.png"
              alt="imag"
            />
            <div>
              <b>Purchase No 2</b> - Free delivery is enabled and can be chosen
            </div>
          </div>
        </Center>
      </Section>
      <Section>
        <Header>Happy Thrifting!</Header>
        <Link to="/rebundle">Shopping guide???</Link>
        <div>
          <Link to="/rebundle">Earn more with Free Delivery message???</Link>
        </div>
      </Section>
    </Container>
  );
}
