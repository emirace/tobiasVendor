import {
  faList,
  faEnvelope,
  faHome,
  faSearch,
  faUser,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState } from "react";
import { Store } from "../Store";
import "../style/StickyNav.css";
import styled from "styled-components";

const Switch = styled.input.attrs({ type: "checkbox", role: "switch" })`
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
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    background: var(--malon-color);
    transition: 0.5s;
  }
`;

export const Badge = styled.span`
  width: 12px;
  height: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--orange-color);
  color: #fff;
  font-size: 10px;
  border-radius: 50%;
  position: absolute;
  right: 0;
  top: 0;
  cursor: default;
`;
export default function StickyNav() {
  const { state, dispatxh: ctxDispatch } = useContext(Store);
  const { userInfo, mode, notifications } = state;

  const allNotification = notifications.filter((x) => x.read === false);

  const [currentNav, setCurrentNav] = useState("home");

  return (
    <div className="d-block d-lg-none">
      <div className="stickynav_contain ">
        <Link
          onClick={() => setCurrentNav("home")}
          to="/"
          className={`sticky_item ${currentNav === "home" && "active"}`}
        >
          <FontAwesomeIcon icon={faHome} />
          <div className="stickynav_text ">Home</div>
        </Link>
        <Link
          to="/categories"
          onClick={() => setCurrentNav("categories")}
          className={`sticky_item ${currentNav === "categories" && "active"}`}
        >
          <FontAwesomeIcon icon={faList} />
          <div className="stickynav_text">Categories</div>
        </Link>
        <Link
          to="/notifications"
          onClick={() => setCurrentNav("notifications")}
          className={`sticky_item ${
            currentNav === "notifications" && "active"
          }`}
        >
          <div style={{ position: "relative" }}>
            <FontAwesomeIcon icon={faBell} />
          </div>
          <div className="stickynav_text">Notifications</div>
          {allNotification.length > 0 && (
            <Badge>
              <span>{allNotification.length}</span>
            </Badge>
          )}
        </Link>
        <Link
          to="/messages"
          onClick={() => setCurrentNav("message")}
          className={`sticky_item ${currentNav === "message" && "active"}`}
        >
          <FontAwesomeIcon icon={faEnvelope} />
          <div className="stickynav_text">Message</div>
        </Link>
        <Link
          onClick={() => setCurrentNav("profile")}
          to="/profilmenu"
          className={`sticky_item ${currentNav === "profile" && "active"}`}
        >
          <FontAwesomeIcon icon={faUser} />
          <div className="stickynav_text">Profile</div>
        </Link>
      </div>
    </div>
  );
}
