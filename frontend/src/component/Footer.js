import React from 'react';
import '../style/Footer.css';

export default function Footer() {
  return (
    <div className="footer_container">
      <div className="footer_left">
        <h1 className="footer_logo">TOBIAS</h1>
        <p className="footer_desc">
          The href attribute requires a valid value to be accessible. Provide a
          valid, navigable address as the href value. If you cannot provide a
          valid href, but still need the element to resemble a link, use a
          button and change it with appropriate styles. Learn more
        </p>
        <div className="footer_social">
          <div className="footer_social_icon">
            <i class="fa fa-facebook-official" aria-hidden="true"></i>
          </div>
          <div className="footer_social_icon">
            <i class="fa fa-instagram" aria-hidden="true"></i>
          </div>
          <div className="footer_social_icon">
            <i class="fa fa-whatsapp" aria-hidden="true"></i>
          </div>
        </div>
      </div>
      <div className="footer_center">
        <h3 className="footer_menu"></h3>
      </div>
      <div className="footer_right"></div>
    </div>
  );
}
