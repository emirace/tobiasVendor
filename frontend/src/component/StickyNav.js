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

import { ReactComponent as Search } from "./../icons/search.svg";

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
  right: 20px;
  top: 5px;
  cursor: default;
`;
const Icon = styled.img`
  width: 25px;
  height: 25px;
`;
const IconColor = styled.div`
  fill: var(--malon-color);
  &.active {
    fill: var(--orange-color);
  }
`;
export default function StickyNav() {
  const { state, dispatxh: ctxDispatch } = useContext(Store);
  const { userInfo, mode, notifications } = state;

  const allNotification = notifications.filter((x) => x.read === false);
  const messageNotification = notifications.filter(
    (x) => x.notifyType === "message" && x.read === false
  );
  const purchaseNotification = notifications.filter(
    (x) => x.notifyType === "purchase" && x.read === false
  );
  const soldNotification = notifications.filter(
    (x) => x.notifyType === "sold" && x.read === false
  );

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
          <IconColor className={currentNav === "categories" && "active"}>
            <Search height={25} width={25} />
          </IconColor>
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
          {messageNotification.length > 0 && (
            <Badge>
              <span>{messageNotification.length}</span>
            </Badge>
          )}
        </Link>
        <Link
          onClick={() => setCurrentNav("profile")}
          to="/profilmenu"
          className={`sticky_item ${currentNav === "profile" && "active"}`}
        >
          <FontAwesomeIcon icon={faUser} />
          <div className="stickynav_text">Profile</div>
          {[...soldNotification, ...purchaseNotification].length > 0 && (
            <Badge>
              <span>
                {[...soldNotification, ...purchaseNotification].length}
              </span>
            </Badge>
          )}
        </Link>
      </div>
    </div>
  );
}
