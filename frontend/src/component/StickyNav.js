import {
  faList,
  faEnvelope,
  faHome,
  faSearch,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { Store } from '../Store';
import '../style/StickyNav.css';

export default function StickyNav() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  return (
    <div className="d-block d-lg-none">
      <div className="stickynav_contain ">
        <Link to="/" className="sticky_item active">
          <FontAwesomeIcon icon={faHome} />
          <div className="stickynav_text ">Home</div>
        </Link>
        <Link to="/categories" className="sticky_item">
          <FontAwesomeIcon icon={faList} />
          <div className="stickynav_text">Categories</div>
        </Link>
        <Link to="/messages" className="sticky_item">
          <FontAwesomeIcon icon={faEnvelope} />
          <div className="stickynav_text">Message</div>
        </Link>
        <Link to="/account/" className="sticky_item">
          <FontAwesomeIcon icon={faUser} />
          <div className="stickynav_text">Profile</div>
        </Link>
      </div>
    </div>
  );
}
