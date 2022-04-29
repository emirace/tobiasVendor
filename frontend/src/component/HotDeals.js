import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import '../style/button.css';

export default function HotDeals() {
  return (
    <Row className="hot-deals-row mb-3">
      <Col md={5} className="px-0 hot-deals">
        <img
          src="/images/profile.jpg"
          alt="deals"
          className="hot-deals-img bg-danger img-fluid"
        ></img>
      </Col>
      <Col md={7}>
        <div className="hot-deal-detail">
          <div className="hot-deal-name">Nike Shirt</div>
          <div className="hot-deal-description">
            looked up one of the more obscure
          </div>
          <div className="hot-deal-price">
            <div className="hot-deal-initial-amt">
              $20
              <button class="small-button">$33</button>
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
}
