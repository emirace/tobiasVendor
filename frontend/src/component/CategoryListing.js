import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import "../style/CategoryListing.css";

const Img = styled.img`
  &.bottom {
    object-fit: cover;
    object-position: bottom;
  }
`;
export default function CategoryListing(props) {
  const { image, title, link, bottom } = props;
  return (
    <div className="catelisting_container">
      <div className="categorylisting_img">
        <Img src={image} className={bottom ? "bottom" : ""} alt="img" />
        <Link to={link}>
          <div className="categorylisting_title">{title}</div>
        </Link>
      </div>
    </div>
  );
}
