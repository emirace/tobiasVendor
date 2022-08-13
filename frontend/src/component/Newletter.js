import React from "react";
import "../style/Newsletter.css";

export default function Newletter() {
  return (
    <div className="newsletter_container">
      <div className="newsletter_desc">
        <b>
          WANT TO GET EXCITING HOT DEALS, DISCOUNTS, AND TIMELY UPDATE FROM YOUR
          FAVOURITES STORE?
        </b>
      </div>
      <div className="newsletter_desc">Drop your email not to miss out!</div>
      <div className="newsletter_input">
        <input type={"text"} placeholder="Your Email"></input>
        <button className="">Send</button>
      </div>
      <div className="newsletter_desc">We prioritize your privacy</div>
    </div>
  );
}
