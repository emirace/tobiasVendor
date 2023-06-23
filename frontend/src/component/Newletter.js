import axios from 'axios';
import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { Store } from '../Store';
import '../style/Newsletter.css';
import { region } from '../utils';

const Sent = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  @media (max-width: 992px) {
    padding: 0 10px;
    text-align: center;
  }
`;

export default function Newletter() {
  const { dispatch: ctxDispatch } = useContext(Store);
  const [input, setInput] = useState('');
  const [sent, setSent] = useState(false);
  const handlesubmit = async () => {
    if (!input) {
      ctxDispatch({
        type: 'SHOW_TOAST',
        payload: {
          message: 'Please enter your email to get live updates',
          showStatus: true,
          state1: 'visible1 error',
        },
      });
      return;
    }
    try {
      const { data } = await axios.post(`/api/newsletters/${region()}`, {
        email: input,
        emailType: 'Newsletter',
      });
      setInput('');
      setSent(true);
    } catch (err) {
      console.log(err);
    }
  };
  return sent ? (
    <Sent>
      Great! Welcome to the Repeddle Tribe. We've sent you an email to confirm
      your subscription.
    </Sent>
  ) : (
    <div className="newsletter_container">
      <div className="newsletter_desc">
        <b>
          WANT TO GET EXCITING HOT DEALS, DISCOUNTS, AND TIMELY UPDATE FROM YOUR
          FAVOURITES STORE?
        </b>
      </div>
      <div className="newsletter_desc malon">
        Drop your email not to miss out!
      </div>
      <div className="newsletter_input">
        <input
          type={'text'}
          placeholder="Your Email"
          onChange={(e) => setInput(e.target.value)}
        ></input>
        <button className="" onClick={handlesubmit}>
          Send
        </button>
      </div>
      <div className="newsletter_desc" style={{ marginTop: '5px' }}>
        We prioritize your privacy
      </div>
    </div>
  );
}
