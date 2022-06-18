import React from 'react';
import { Link } from 'react-router-dom';
import '../style/CategoryListing.css';

export default function CategoryListing(props) {
  const { image, title } = props;
  return (
    <div className="catelisting_container">
      <div className="categorylisting_img">
        <img src={image} alt="" />
        <Link to={`/category/${title}`}>
          <div className="categorylisting_title">{title}</div>
        </Link>
      </div>
    </div>
  );
}
