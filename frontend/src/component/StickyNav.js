import {
  faDashboard,
  faEnvelope,
  faHome,
  faSearch,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import '../style/StickyNav.css';

export default function StickyNav() {
  return (
    <div className="d-block d-lg-none">
      <div className="stickynav_contain ">
        <div className="sticky_item active">
          <FontAwesomeIcon icon={faHome} />
          <div className="stickynav_text ">Home</div>
        </div>
        <div className="sticky_item">
          <FontAwesomeIcon icon={faSearch} />
          <div className="stickynav_text">Search</div>
        </div>
        <div className="sticky_item">
          <FontAwesomeIcon icon={faDashboard} />
          <div className="stickynav_text">Categories</div>
        </div>
        <div className="sticky_item">
          <FontAwesomeIcon icon={faEnvelope} />
          <div className="stickynav_text">Message</div>
        </div>
        <div className="sticky_item">
          <FontAwesomeIcon icon={faUser} />
          <div className="stickynav_text">Profile</div>
        </div>
      </div>
    </div>
  );
}
