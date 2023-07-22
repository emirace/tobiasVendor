import React from "react";
import styled from "styled-components";

const SuccessContainer = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
`;

const SuccessHeading = styled.h2`
  color: #4caf50;
`;

const BackToHomeLink = styled.a`
  display: inline-block;
  margin-top: 20px;
  text-decoration: none;
  color: #007bff;
  border: 1px solid #007bff;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;

  &:hover {
    background-color: #007bff;
    color: #fff;
  }
`;

const ContactSuccess = () => {
  return (
    <SuccessContainer>
      <SuccessHeading>Message Successfully Sent!</SuccessHeading>
      <p>
        Thank you for contacting us. Your message has been successfully sent.
      </p>
      <p>We will get back to you as soon as possible.</p>
      <BackToHomeLink href="/">Back to Home</BackToHomeLink>
    </SuccessContainer>
  );
};

export default ContactSuccess;
