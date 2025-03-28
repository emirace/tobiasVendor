import {
  faCopyright,
  faCreditCard,
  faGlobe,
  faHandshake,
  faHashtag,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import styled from "styled-components";
import { Store } from "../Store";
import "../style/Footer.css";
import Newletter from "./Newletter";
import { ReactComponent as FacebookIcon } from "./../icons/Icons-19.svg";
import { ReactComponent as Twitter } from "./../icons/Icons-21.svg";
import { ReactComponent as InstagramIcon } from "./../icons/Icons-20.svg";
import { Link } from "react-router-dom";
import { ReactComponent as Phone } from "./../icons/Icons-02.svg";
import { ReactComponent as Mail } from "./../icons/Icons-04.svg";

const CopyRight = styled.div`
  background: ${(props) => (props.back ? "#000" : "#fff")};
  display: flex;
  justify-content: center;
  color: ${(props) => (props.back ? "#fff" : "#000")};
  height: 50px;
  align-items: center;
  font-size: 14px;
  font-weight: bold;
  & svg {
    margin-right: 10px;
    font-size: 20px;
  }
  @media (max-width: 992px) {
    margin-bottom: 55px;
  }
`;
const SmDetail = styled.p`
  display: none;
  position: relative;
  height: ${(props) => (props.show ? "auto" : 0)};
  overflow: hidden;
  transition: 0.5s;
  @media (max-width: 992px) {
    display: block;
    font-size: 14px !important;
    margin-bottom: 15px;
  }
`;

const SmTitle = styled.div`
  text-transform: capitalize;
  display: none;
  position: relative;
  cursor: pointer;
  &::before {
    content: " ";
    width: 10px;
    height: 10px;
    border-bottom: 1px solid;
    border-left: 1px solid;
    transform: rotate(${(props) => (!props.show ? "-45deg" : "135deg")})
      translateY(-50%);
    position: absolute;
    top: 50%;
    right: 20px;
  }

  & svg {
    width: 40px;
    margin-right: 10px;
    margin-bottom: 0 !important;
    @media (max-width: 992px) {
      font-size: 20px !important;
    }
  }

  @media (max-width: 992px) {
    display: flex;
    font-size: 15px;
    margin: 5px 0;
    font-weight: bold;
    align-items: center;
  }
`;

const LogoImage = styled.img`
  width: 45%;
`;
const Logo = styled.div`
  width: 100%;
  @media (max-width: 992px) {
    & a {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`;

const Reserve = styled.div`
  margin: 5px 20vw;
  text-align: center;
  font-size: 12px;
  @media (max-width: 992px) {
    margin: 5px;
    text-align: center;
  }
`;
const MFooterCenter = styled.div`
  display: none;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  padding: 20px;
  margin: 10px 0;
  @media (max-width: 992px) {
    display: block;
  }
`;
const DFooterCenter = styled.div`
  display: flex;
  @media (max-width: 992px) {
    display: none;
  }
`;

const About = styled.p`
  @media (max-width: 992px) {
    background: ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  }
`;

const NavHeader = styled.h3`
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 2px;
  line-height: 1.83;
  margin-bottom: 15px;
  &::before {
    content: " ";
    width: 10px;
    height: 10px;
    border-bottom: 1px solid;
    border-left: 1px solid;
    transform: rotate(${(props) => (!props.show ? "-45deg" : "135deg")})
      translateY(-50%);
    position: absolute;
    right: 20px;
  }
`;

export default function Footer() {
  const { state } = useContext(Store);
  const { mode } = state;
  const backMode = (mode) => {
    if (mode === "pagebodydark") {
      mode = false;
    } else {
      mode = true;
    }
    return mode;
  };
  const footerMode = backMode(mode);

  const [shipMethod1, setShippingMethod1] = useState(false);
  const [shipMethod2, setShippingMethod2] = useState(false);
  const [shipMethod3, setShippingMethod3] = useState(false);
  const [shipMethod4, setShippingMethod4] = useState(false);

  const [footerLinks1, setFooterLinks1] = useState(false);
  const [footerLinks2, setFooterLinks2] = useState(false);
  const [footerLinks3, setFooterLinks3] = useState(false);
  const [footerLinks4, setFooterLinks4] = useState(false);

  const toggleCollapse = (type) => {
    switch (type) {
      case "shipMethod1":
        setShippingMethod1(!shipMethod1);
        break;
      case "shipMethod2":
        setShippingMethod2(!shipMethod2);
        break;
      case "shipMethod3":
        setShippingMethod3(!shipMethod3);
        break;
      case "shipMethod4":
        setShippingMethod4(!shipMethod4);
        break;
      default:
        break;
    }
  };
  return (
    <>
      <section className="shop-method-area">
        <img
          className="wave_img "
          src="https://res.cloudinary.com/emirace/image/upload/v1656370086/wave2_k9xnpv.png"
          alt=""
        ></img>
        <div className="bg_malon">
          <div className="container " style={{ margin: "5px 0" }}>
            <div className="row d-flex justify-content-between ">
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="single-method ">
                  <FontAwesomeIcon
                    icon={faTruckFast}
                    className="d-none d-lg-block"
                  />
                  <SmTitle
                    show={shipMethod1}
                    onClick={() => toggleCollapse("shipMethod1")}
                  >
                    <FontAwesomeIcon icon={faTruckFast} />
                    Free Shipping with RE:BUNDLE
                  </SmTitle>
                  <SmDetail show={shipMethod1}>
                    Get free shipping when you shop on Repeddle App or Website,
                    using Re:Bundle. Discover{" "}
                    <Link
                      to="rebundle"
                      style={{ color: "var(--orange-color)" }}
                    >
                      how
                    </Link>
                  </SmDetail>
                  <h6 className="d-none d-lg-block">
                    Free Shipping with RE:BUNDLE
                  </h6>
                  <p className="d-none d-lg-block">
                    Get free shipping when you shop on Repeddle App or Website,
                    using Re:Bundle. Discover{" "}
                    <Link
                      to="rebundle"
                      style={{ color: "var(--orange-color)" }}
                    >
                      how
                    </Link>
                  </p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="single-method">
                  <FontAwesomeIcon
                    icon={faCreditCard}
                    className="d-none d-lg-block"
                  />
                  <SmTitle
                    show={shipMethod2}
                    onClick={() => toggleCollapse("shipMethod2")}
                  >
                    <FontAwesomeIcon icon={faCreditCard} />
                    Secure, Easy and Protected Payments
                  </SmTitle>
                  <SmDetail show={shipMethod2}>
                    With every item you buy using the complete checkout on our
                    App or Website, you are guaranteed 100% money back. Find out{" "}
                    <Link
                      to="protections"
                      style={{ color: "var(--orange-color)" }}
                    >
                      more
                    </Link>
                  </SmDetail>
                  <h6 className="d-none d-lg-block">
                    Secure, Easy and Protected Payments
                  </h6>
                  <p className="d-none d-lg-block">
                    With every item you buy using the complete CHECKOUT on our
                    App or Website, you are guaranteed 100% money back. Find out{" "}
                    <Link
                      to="protections"
                      style={{ color: "var(--orange-color)" }}
                    >
                      more
                    </Link>
                  </p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="single-method">
                  <FontAwesomeIcon
                    icon={faHandshake}
                    className="d-none d-lg-block"
                  />
                  <SmTitle
                    show={shipMethod3}
                    onClick={() => toggleCollapse("shipMethod3")}
                  >
                    <FontAwesomeIcon icon={faHandshake} />
                    Community Engagement
                  </SmTitle>
                  <SmDetail show={shipMethod3}>
                    We are fostering a generation of conscious fashion
                    consumption in Africa, and we can only achieve it together
                    with our community. Using the in-built Chat/Message system,
                    our community remain engaged about fashion sustainability,
                    have access to easy communications tool, while participating
                    in seamless fair trade.
                  </SmDetail>
                  <h6 className="d-none d-lg-block">Community Engagement</h6>
                  <p className="d-none d-lg-block">
                    We are fostering a generation of conscious fashion
                    consumption in Africa, and we can only achieve it together
                    with our community. Using the in-built Chat/Message system,
                    our community remain engaged about fashion sustainability,
                    have access to easy communications tool, while participating
                    in seamless fair trade.
                  </p>
                </div>
              </div>

              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="single-method">
                  <FontAwesomeIcon
                    icon={faGlobe}
                    className="d-none d-lg-block"
                  />
                  <SmTitle
                    show={shipMethod3}
                    onClick={() => toggleCollapse("shipMethod4")}
                  >
                    <FontAwesomeIcon icon={faGlobe} />
                    Repeddle Sustainability Impact
                  </SmTitle>
                  <SmDetail show={shipMethod4}>
                    Fashion industry is the second most intense water consuming
                    and polluting industry in the world. With the help of our
                    community, we can drastically reduce this impact in Africa
                    and make our environment and planet, a more livable place.
                    Learn{" "}
                    <Link
                      to="/sustainability"
                      style={{ color: "var(--orange-color)" }}
                    >
                      more
                    </Link>
                  </SmDetail>
                  <h6 className="d-none d-lg-block">
                    Repeddle Sustainability Impact
                  </h6>
                  <p className="d-none d-lg-block">
                    Fashion industry is the second most intense water consuming
                    and polluting industry in the world. With the help of our
                    community, we can drastically reduce this impact in Africa
                    and make our environment and planet, a more livable place.
                    Learn{" "}
                    <Link
                      to="/sustainability"
                      style={{ color: "var(--orange-color)" }}
                    >
                      how
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="curve_color">
        <img
          className="wave_img  bg_malon"
          src="https://res.cloudinary.com/emirace/image/upload/v1656370275/wave23_htx1rw.png"
          alt=""
        ></img>
        <div className="footer_black_top">
          <img src="/images/gucci.png" alt="gucci" />
          <img src="/images/dg.png" alt="gucci" />
          <img src="/images/prada.png" alt="luis" />
          <img src="/images/luis.png" alt="luis" />
          <img src="/images/Versace.png" alt="luis" />
          <img src="/images/Chanel.png" alt="luis" />
        </div>
      </div>
      <div className="curve_color">
        <img
          className="wave_img bg_black"
          src="https://res.cloudinary.com/emirace/image/upload/v1656370086/wave_p4ujhx.png"
          alt=""
        ></img>

        <div className="footer_orange_top">
          <Newletter />
        </div>
      </div>
      <div className="footer_container">
        <div className="footer_left">
          <Logo>
            <Link to="/">
              <LogoImage
                src={
                  mode === "pagebodydark"
                    ? "https://res.cloudinary.com/emirace/image/upload/v1659377710/Repeddle-White_pani6a.gif"
                    : "https://res.cloudinary.com/emirace/image/upload/v1659377672/Repeddle-Black_eko2g5.gif"
                }
              />
            </Link>
          </Logo>
          <About mode={mode} className="footer_desc">
            Africa’s leading social marketplace for Pre-loved fashion/Items,
            Gen-Z, The Millennials, The Environment and Your Budget. By
            fostering a creative generation of conscious fashion consumers to
            better the planet and our environment, we approach solving Africa’s
            fashion waste crisis, crafting our story of a sustainable circular
            fashion in Africa, one garment at a time, one person at a time, and
            one loving home at a time. Let’s peddle and thrift.
          </About>
          <div className="footer_connect">
            <b style={{ textTransform: "uppercase" }}>Connect with us: </b>
            <span> We're Social, Let's Make It Media:</span>
          </div>
          <div className="footer_social">
            <div className="footer_social_icon">
              <a
                href="https://www.facebook.com/Repeddle?mibextid=ZbWKwL"
                alt="facebook"
              >
                <FacebookIcon height={25} width={25} />
              </a>
            </div>
            <div className="footer_social_icon">
              <a
                href="https://twitter.com/Repeddleapp?t=rOUSOjGxnzW0tDyzRiUSnQ&s=09"
                alt="twitter"
              >
                <Twitter height={25} width={25} />
              </a>
            </div>
            <div className="footer_social_icon">
              <a
                href="https://instagram.com/repeddleapp?igshid=YmMyMTA2M2Y="
                alt="instagram"
              >
                <InstagramIcon height={25} width={25} />
              </a>
            </div>
          </div>
        </div>
        <DFooterCenter className="footer_center">
          <div style={{ flex: 1 }}>
            <h3 className="footer_center_menu">Customer Care</h3>
            <ul className="footer_center_list">
              <li className="footer_center_listitem">
                <Link to="/articles">Support Center</Link>
              </li>
              <li className="footer_center_listitem">
                <Link to="/returns">Returns & Refund</Link>
              </li>
              <li className="footer_center_listitem">
                <Link to="/privacypolicy">Privacy Policy</Link>
              </li>
              <li className="footer_center_listitem">
                <Link to="/terms">Terms of Use</Link>
              </li>
            </ul>
          </div>
          <div style={{ flex: 1 }}>
            <h3 className="footer_center_menu">Our Company</h3>
            <ul className="footer_center_list">
              <li className="footer_center_listitem">
                <Link to="/about">About Us</Link>
              </li>
              <li className="footer_center_listitem">
                <Link to="/sustainability">Sustainability</Link>
              </li>
              <li className="footer_center_listitem">
                <Link to="/vipshield">Vip Shield</Link>
              </li>
              <li className="footer_center_listitem">
                <Link to="/">Blog and News</Link>
              </li>
              <li className="footer_center_listitem">
                <Link to="/rebundle">Re:Bundle</Link>
              </li>
              <li className="footer_center_listitem">
                <Link to="/" href="/#">
                  Wholesale
                </Link>
              </li>
            </ul>
          </div>
          <div style={{ flex: 1 }}>
            <h3 className="footer_center_menu">Categories</h3>

            <ul className="footer_center_list">
              <li className="footer_center_listitem">
                <Link to="/category/women">Women</Link>
              </li>
              <li className="footer_center_listitem">
                <Link to="/category/men">Men</Link>
              </li>
              <li className="footer_center_listitem">
                <Link to="/category/kids">Kids</Link>
              </li>
              <li className="footer_center_listitem">
                <Link to="/category/home">Home</Link>
              </li>
              <li className="footer_center_listitem">
                <Link to="/search">More</Link>
              </li>
              <li className="footer_center_listitem">
                <Link to="/recurated">Re:Curated</Link>
              </li>
            </ul>
          </div>
          <div style={{ flex: 1 }}>
            <h3 className="footer_center_menu">Top Brands</h3>

            <ul className="footer_center_list">
              <li className="footer_center_listitem">
                <Link to="/search?query=adidas">Adidas</Link>
              </li>
              <li className="footer_center_listitem">
                <Link to="/search?query=alexandermcquen">
                  Alexander Mcqueen
                </Link>
              </li>
              <li className="footer_center_listitem">
                <Link to="/search?query=adidas">Balanciaga</Link>
              </li>
              <li className="footer_center_listitem">
                <Link to="/search?query=adidas">Gucci</Link>
              </li>
              <li className="footer_center_listitem">
                <Link to="/search?query=adidas">Patagonia</Link>
              </li>
            </ul>
          </div>
        </DFooterCenter>
        <MFooterCenter mode={mode} className="footer_center">
          <div style={{ flex: 1 }}>
            <NavHeader
              mode={mode}
              show={footerLinks1}
              className="footer_center_menu"
              onClick={() => setFooterLinks1(!footerLinks1)}
            >
              Customer Care
            </NavHeader>
            {footerLinks1 && (
              <ul className="footer_center_list">
                <li className="footer_center_listitem">
                  <Link to="/articles">Support Center</Link>
                </li>
                <li className="footer_center_listitem">
                  <Link to="/returns">Returns & Refund</Link>
                </li>
                <li className="footer_center_listitem">
                  <Link to="/privacypolicy">Privacy Policy</Link>
                </li>
                <li className="footer_center_listitem">
                  <Link to="/terms">Terms of Use</Link>
                </li>
              </ul>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <NavHeader
              mode={mode}
              show={footerLinks2}
              className="footer_center_menu"
              onClick={() => setFooterLinks2(!footerLinks2)}
            >
              Our Company
            </NavHeader>
            {footerLinks2 && (
              <ul className="footer_center_list">
                <li className="footer_center_listitem">
                  <Link to="/about">About Us</Link>
                </li>
                <li className="footer_center_listitem">
                  <Link to="/sustainability">Sustainability</Link>
                </li>
                <li className="footer_center_listitem">
                  <Link to="/vipshield">Vip Shield</Link>
                </li>
                <li className="footer_center_listitem">
                  <Link to="/">Blog and News</Link>
                </li>
                <li className="footer_center_listitem">
                  <Link to="/rebundle">Re:Bundle</Link>
                </li>
                <li className="footer_center_listitem">
                  <Link to="/rebundle">Wholesale</Link>
                </li>
              </ul>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <NavHeader
              mode={mode}
              show={footerLinks3}
              className="footer_center_menu"
              onClick={() => setFooterLinks3(!footerLinks3)}
            >
              Categories
            </NavHeader>

            {footerLinks3 && (
              <ul className="footer_center_list">
                <li className="footer_center_listitem">
                  <Link to="/search?query=women">Women</Link>
                </li>
                <li className="footer_center_listitem">
                  <Link to="/search?query=men">Men</Link>
                </li>
                <li className="footer_center_listitem">
                  <Link to="/search?query=kids">Kids</Link>
                </li>
                <li className="footer_center_listitem">
                  <Link to="/search?query=home">Home</Link>
                </li>
                <li className="footer_center_listitem">
                  <Link to="/search">More</Link>
                </li>
                <li className="footer_center_listitem">
                  <Link to="/recurated">Re:Curated</Link>
                </li>
              </ul>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <NavHeader
              mode={mode}
              show={footerLinks4}
              className="footer_center_menu"
              onClick={() => setFooterLinks4(!footerLinks4)}
            >
              Top Brands
            </NavHeader>

            {footerLinks4 && (
              <ul className="footer_center_list">
                <li className="footer_center_listitem">
                  <Link to="/search?brand=adidas">Adidas</Link>
                </li>
                <li className="footer_center_listitem">
                  <Link to="/search?brand=alexander mcqueen">
                    Alexander Mcqueen
                  </Link>
                </li>
                <li className="footer_center_listitem">
                  <Link to="/search?brand=balanciags">Balanciaga</Link>
                </li>
                <li className="footer_center_listitem">
                  <Link to="/search?brand=gucci">Gucci</Link>
                </li>
                <li className="footer_center_listitem">
                  <Link to="/search?brand=patagonia">Patagonia</Link>
                </li>
              </ul>
            )}
          </div>
        </MFooterCenter>
      </div>
      <Reserve>
        All third party logos and brand names appearing on our App, Websites or
        any of our Platforms are independent trademarks of their respective
        owners. Except otherwise mentioned, Repeddle has no affiliation,
        endorsement or endorses any trademark displayed on it online or physical
        platforms.
      </Reserve>
      <CopyRight back={footerMode}>
        <FontAwesomeIcon icon={faCopyright} /> 2023 Repeddle. All Right
        Reserved.
      </CopyRight>
    </>
  );
}
