import React from "react";
import styled from "styled-components";

const SuccessContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  margin: 10px auto;
`;

const SuccessHeading = styled.h2`
  color: var(--orange-color);
`;

const BackToHomeLink = styled.a`
  display: inline-block;
  margin-top: 10px;
  text-decoration: none;
  color: var(--orange-color);
  border: 1px solid var(--orange-color);
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;

  &:hover {
    background-color: var(--orange-color);
    color: #fff;
  }
`;

const ContactSuccess = () => {
  return (
    <SuccessContainer>
      <SuccessHeading>Message Successfully Sent!</SuccessHeading>
      <p>Thank you for contacting us. Your message has been received.</p>
      <p>
        Our aim is to get back to you in lesss than 24 hours; however, it may
        take us a little longer during weekends, public holidays and evenings to
        respond.{" "}
      </p>
      <p>Thanks for your patience in advance.</p>
      <p>Have a great day!</p>
      <BackToHomeLink href="/">Back to Home</BackToHomeLink>
    </SuccessContainer>
  );
};

export default ContactSuccess;
