import React from 'react';

import {
  EmailShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  TelegramShareButton,
  FacebookShareButton,
} from 'react-share';
import {
  EmailIcon,
  FacebookIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  position: absolute;

  transition: all 0.5s;
  bottom: -30px;
  left: 100%;
  & button svg {
    margin: 10px;
  }
  @media (max-width: 992px) {
    right: 0;
    left: auto;
    bottom: auto;
    top: -15px;
  }
`;

export default function ShareButton(props) {
  const shareUrl = props.url;
  return (
    <Container>
      <FacebookShareButton url={shareUrl}>
        <FacebookIcon size={32} round={true} />
      </FacebookShareButton>
      <EmailShareButton url={shareUrl}>
        <EmailIcon size={32} round={true} />
      </EmailShareButton>
      <WhatsappShareButton url={shareUrl}>
        <WhatsappIcon size={32} round={true} />
      </WhatsappShareButton>
      <TwitterShareButton url={shareUrl}>
        <TwitterIcon size={32} round={true} />
      </TwitterShareButton>
      <TelegramShareButton url={shareUrl}>
        <TelegramIcon size={32} round={true} />
      </TelegramShareButton>
    </Container>
  );
}
