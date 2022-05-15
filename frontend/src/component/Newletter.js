import React from 'react';
import '../style/Newsletter.css';

export default function Newletter() {
  return (
    <div className="newsletter_container">
      <div className="newsletter_desc">
        Get timely Update from your favorites product
      </div>
      <div className="newsletter_input">
        <input type={'text'} placeholder="Your Email"></input>
        <button className="">Send</button>
      </div>
    </div>
  );
}
