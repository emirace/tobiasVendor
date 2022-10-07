import axios from "axios";
import React, { useContext } from "react";

import {
  EmailShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  TelegramShareButton,
  FacebookShareButton,
  PinterestShareButton,
  LinkedinShareButton,
  LinkedinIcon,
  PinterestIcon,
} from "react-share";
import {
  EmailIcon,
  FacebookIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import styled from "styled-components";
import { socket } from "../App";
import { Store } from "../Store";

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

export default function ShareButton({ url: shareUrl, product, dispatch }) {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const handleShare = async () => {
    if (userInfo) {
      try {
        const { data } = await axios.put(
          `/api/products/${product._id}/shares`,
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        dispatch({ type: "REFRESH_PRODUCT", payload: data.product });
        if (data.product) {
          socket.emit("post_data", {
            userId: product.seller._id,
            itemId: product._id,
            notifyType: "share",
            msg: `${userInfo.username} shared your product`,
            link: `/product/${product.slug}`,
            userImage: userInfo.image,
          });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <Container>
      {console.log("share", shareUrl)}
      <FacebookShareButton
        quote={"Hey! Look what I found on Repeddle"}
        hashtag={"#Repeddle"}
        url={shareUrl}
        onShareWindowClose={handleShare}
      >
        <FacebookIcon size={32} round={true} />
      </FacebookShareButton>
      <EmailShareButton
        subject="Repeddle"
        body="Hey! Look what i found at Repeddle"
        url={shareUrl}
        onShareWindowClose={handleShare}
      >
        <EmailIcon size={32} round={true} />
      </EmailShareButton>
      <WhatsappShareButton
        url={shareUrl}
        title={"Hey! Look what I found on Repeddle"}
        onShareWindowClose={handleShare}
      >
        <WhatsappIcon size={32} round={true} />
      </WhatsappShareButton>
      <TwitterShareButton
        title={"Hey! Look what I found on Repeddle"}
        hashtags={["Repeddle"]}
        url={shareUrl}
        onShareWindowClose={handleShare}
      >
        <TwitterIcon size={32} round={true} />
      </TwitterShareButton>
      <TelegramShareButton
        url={shareUrl}
        title={"Hey! Look what I found on Repeddle"}
        onShareWindowClose={handleShare}
      >
        <TelegramIcon size={32} round={true} />
      </TelegramShareButton>

      <PinterestShareButton>
        <PinterestIcon size={32} round={true} />
      </PinterestShareButton>
      <LinkedinShareButton>
        <LinkedinIcon size={32} round={true} />
      </LinkedinShareButton>
    </Container>
  );
}
