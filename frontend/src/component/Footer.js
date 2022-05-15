import { faCopyright } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import '../style/Footer.css';
import Newletter from './Newletter';

export default function Footer() {
  return (
    <>
      <div className="footer_malon_top"></div>
      <div className="footer_orange_top">
        <Newletter />
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
              <i class="fa fa-facebook-official"></i>
            </div>
            <div className="footer_social_icon">
              <i class="fa fa-instagram"></i>
            </div>
            <div className="footer_social_icon">
              <i className="fa fa-whatsapp"></i>
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
      <div className="footer_copyright">
        <FontAwesomeIcon icon={faCopyright} /> All right reserved
      </div>
    </>
  );
}
