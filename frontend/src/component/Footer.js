import {
  faCopyright,
  faCreditCard,
  faHashtag,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import styled from "styled-components";
import { Store } from "../Store";
import "../style/Footer.css";
import Newletter from "./Newletter";

const CopyRight = styled.div`
  background: ${(props) => (props.back ? "#000" : "#fff")};
  display: flex;
  justify-content: center;
  color: ${(props) => (props.back ? "#fff" : "#000")};
  height: 50px;
  align-items: center;
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
  height: ${(props) => (props.show ? "120px" : 0)};
  overflow: hidden;
  transition: 0.5s;
  @media (max-width: 992px) {
    display: block;
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
  }

  @media (max-width: 992px) {
    display: flex;
    font-size: 18px;
    font-weight: bold;
    align-items: center;
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
          <div className="container ">
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
                    Free Shipping Method
                  </SmTitle>
                  <SmDetail show={shipMethod1}>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s,
                  </SmDetail>
                  <h6 className="d-none d-lg-block">Free Shipping Method</h6>
                  <p className="d-none d-lg-block">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s,
                  </p>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="single-method">
                  <FontAwesomeIcon
                    icon={faTruckFast}
                    className="d-none d-lg-block"
                  />
                  <SmTitle
                    show={shipMethod2}
                    onClick={() => toggleCollapse("shipMethod2")}
                  >
                    <FontAwesomeIcon icon={faTruckFast} />
                    Free Shipping Method
                  </SmTitle>
                  <SmDetail show={shipMethod2}>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s,
                  </SmDetail>
                  <h6 className="d-none d-lg-block">Free Shipping Method</h6>
                  <p className="d-none d-lg-block">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s,
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
                    show={shipMethod3}
                    onClick={() => toggleCollapse("shipMethod3")}
                  >
                    <FontAwesomeIcon icon={faCreditCard} />
                    Easy Payment Method
                  </SmTitle>
                  <SmDetail show={shipMethod3}>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s,
                  </SmDetail>
                  <h6 className="d-none d-lg-block">Easy Payment Method</h6>
                  <p className="d-none d-lg-block">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s,
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
          <h1 className="footer_logo">REPEDDLE</h1>
          <p className="footer_desc">
            The href attribute requires a valid value to be accessible. Provide
            a valid, navigable address as the href value. If you cannot provide
            a valid href, but still need the element to resemble a link, use a
            button and change it with appropriate styles. Learn more
          </p>
          <div className="footer_social">
            <div className="footer_social_icon">
              <FontAwesomeIcon icon={faHashtag} />
            </div>
            <div className="footer_social_icon">
              <FontAwesomeIcon icon={faHashtag} />
            </div>
            <div className="footer_social_icon">
              <FontAwesomeIcon icon={faHashtag} />
            </div>
          </div>
        </div>
        <div className="footer_center">
          <h3 className="footer_center_menu">Useful Links</h3>
          <ul className="footer_center_list">
            <li className="footer_center_listitem">
              <a href="/#">Home</a>
            </li>
            <li className="footer_center_listitem">
              <a href="/#">Cart</a>
            </li>
            <li className="footer_center_listitem">
              <a href="/#">Men Fashion</a>
            </li>
            <li className="footer_center_listitem">
              <a href="/#">Women Fashion</a>
            </li>
            <li className="footer_center_listitem">
              <a href="/#">Accessories</a>
            </li>
            <li className="footer_center_listitem">
              <a href="/#">My Account</a>
            </li>
            <li className="footer_center_listitem">
              <a href="/#">Order Tracking</a>
            </li>
            <li className="footer_center_listitem">
              <a href="/#">wishlist</a>
            </li>
            <li className="footer_center_listitem">
              <a href="/#">Terms</a>
            </li>
          </ul>
        </div>
        <div className="footer_right">
          <h3 className="footer_center_menu">Contact</h3>
          <div className="footer_contacts">
            <i className="fa fa-home"></i> 123 Creson, Califanion, USA
          </div>
          <div className="footer_contacts">
            <i className="fa fa-phone"></i> +1 234 56 78
          </div>
          <div className="footer_contacts">
            <i className="fa fa-envelope"></i> support@repeddle.com
          </div>
          <img
            src="https://i.ibb.co/Qfvn4z6/payment.png"
            alt=""
            className="footor_contact_payments"
          ></img>
        </div>
      </div>
      <CopyRight back={footerMode}>
        <FontAwesomeIcon icon={faCopyright} /> All right reserved
      </CopyRight>
    </>
  );
}
