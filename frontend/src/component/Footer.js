import { faCopyright, faHashtag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { Store } from '../Store';
import '../style/Footer.css';
import Newletter from './Newletter';

const CopyRight = styled.div`
  background: ${(props) => (props.back ? '#000' : '#fff')};
  display: flex;
  justify-content: center;
  color: ${(props) => (props.back ? '#fff' : '#000')};
  height: 50px;
  align-items: center;
  margin-bottom: 55px;
  & svg {
    margin-right: 10px;
    font-size: 20px;
  }
`;

export default function Footer() {
  const { state } = useContext(Store);
  const { mode } = state;
  const backMode = (mode) => {
    if (mode === 'pagebodydark') {
      mode = false;
    } else {
      mode = true;
    }
    return mode;
  };
  const footerMode = backMode(mode);
  return (
    <>
      <div className="curve_color">
        <img
          className="wave_img  bg_malon"
          src="images/wave23.png"
          alt=""
        ></img>
        <div className="footer_black_top"></div>
      </div>
      <div className="curve_color">
        <img className="wave_img bg_black" src="images/wave.png" alt=""></img>

        <div className="footer_orange_top">
          <Newletter />
        </div>
      </div>
      <div className="footer_container">
        <div className="footer_left">
          <h1 className="footer_logo">TOBIAS</h1>
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
            <i className="fa fa-envelope"></i> support@tobias.com
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
