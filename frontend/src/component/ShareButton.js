import React from "react";

import {
    EmailShareButton,
    WhatsappShareButton,
    TwitterShareButton,
    TelegramShareButton,
    FacebookShareButton,
} from "react-share";
import {
    EmailIcon,
    FacebookIcon,
    TelegramIcon,
    TwitterIcon,
    WhatsappIcon,
} from "react-share";
import styled from "styled-components";

const Container = styled.div`
    display: flex;
    margin: 10px;
    & button:nth-child(1) {
        position: absolute;
        top: 50px;
        right: 50%;
        opacity: 0;
        transition: all 0.4s ease 0.1s;
    }
    & button:nth-child(2) {
        position: absolute;
        top: 50px;
        right: 50%;
        opacity: 0;
        transition: all 0.4s ease 0.15s;
    }
    & button:nth-child(3) {
        position: absolute;
        top: 50px;
        right: 50%;
        opacity: 0;
        transition: all 0.4s ease 0.2s;
    }
    & button:nth-child(4) {
        position: absolute;
        top: 50px;
        right: 50%;
        opacity: 0;
        transition: all 0.4s ease 0.25s;
    }
    & button:nth-child(5) {
        position: absolute;
        top: 50px;
        right: 50%;
        opacity: 0;
        transition: all 0.4s ease 0.3s;
    }

    @media (max-width: 992px) {
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
