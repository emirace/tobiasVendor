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
import styled from 'styled-components';

const Switch = styled.input.attrs({ type: 'checkbox', role: 'switch' })`
  position: relative;
  width: 40px;
  height: 15px;
  -webkit-appearance: none;
  background: #fff;
  border-radius: 20px;
  outline: none;
  transition: 0.5s;
  @media (max-width: 992px) {
    display: none;
  }
  &:checked {
    background: #000;
    &:before {
      left: 25px;
    }
  }
  &:before {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    background: var(--malon-color);
    transition: 0.5s;
  }
`;

export default function StickyNav() {
  const { state, dispatxh: ctxDispatch } = useContext(Store);
  const { userInfo, mode } = state;

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
        <Link to="/profilmenu" className="sticky_item">
          <FontAwesomeIcon icon={faUser} />
          <div className="stickynav_text">Profile</div>
        </Link>
      </div>
    </div>
  );
}
