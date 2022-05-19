import React from 'react';
import '../style/CategoryListing.css';

export default function CategoryListing(props) {
  const { image, title } = props;
  return (
    <div className="catelisting_container">
      <div className="categorylisting_img">
        <img src={image} alt="" />
        <div className="categorylisting_title">{title}</div>
      </div>
    </div>
  );
}
