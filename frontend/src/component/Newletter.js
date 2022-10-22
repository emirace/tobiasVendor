import React, { useContext, useState } from "react";
import { Store } from "../Store";
import "../style/Newsletter.css";

export default function Newletter() {
  const { dispatch: ctxDispatch } = useContext(Store);
  const [input, setInput] = useState("");
  const handlesubmit = () => {
    if (!input) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Please enter your email to get live updates",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
  };
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
        <input
          type={"text"}
          placeholder="Your Email"
          onChange={(e) => setInput(e.target.value)}
        ></input>
        <button className="" onClick={handlesubmit}>
          Send
        </button>
      </div>
      <div className="newsletter_desc">We prioritize your privacy</div>
    </div>
  );
}
