import axios from 'axios';
import React, { useContext, useState } from 'react';
import {
  EmailShareButton,
  WhatsappShareButton,
  TwitterShareButton,
  TelegramShareButton,
  FacebookShareButton,
  PinterestShareButton,
  LinkedinShareButton,
  EmailIcon,
  FacebookIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
  PinterestIcon,
  LinkedinIcon,
} from 'react-share';
import styled, { keyframes } from 'styled-components';
import { socket } from '../App';
import { Store } from '../Store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShareNodes } from '@fortawesome/free-solid-svg-icons';
import IconsTooltips from './IconsTooltips';
import { MD5 } from 'crypto-js';

const Container = styled.div`
  position: relative;
`;

const Dropdown = styled.div`
  position: absolute;
  top: 30px;
  right: 0;
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev1)' : 'var(--light-ev1)'};
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  padding: 5px;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  z-index: 100;

  ${({ isOpen }) =>
    isOpen &&
    `
    max-height: 300px;
  `}
  @media (min-width: 768px) {
    top: 60px;
  }
`;

const Button = styled.button`
  background-color: #3b5998;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
`;

const ShareButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 5px;
`;

const ShareButton = styled.button`
  background: none;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background: ${(props) =>
      props.mode === 'pagebodydark' ? 'var(--dark-ev2)' : 'var(--light-ev2)'};
  }
  & svg {
    margin-right: 0;
    margin-top: 0;
  }
`;

const ShareButtonText = styled.span`
  margin-left: 8px;
  color: ${(props) =>
    props.mode === 'pagebodylight'
      ? 'var(--black-color)'
      : 'var(--white-color)'};
`;

const ShareButtonAnimation = keyframes`
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
`;

const ShareIcon = styled.img`
  width: 24px;
  height: 24px;
  animation: ${ShareButtonAnimation} 0.3s ease;
`;
const Background = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`;
const IconContainer = styled.div`
  position: relative;
  margin-right: 30px;
  &:hover div {
    opacity: 1;
  }
`;

const ShareModal = ({ url: shareUrl, product, dispatch }) => {
  const { state } = useContext(Store);
  const { userInfo, mode } = state;

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleShare = async () => {
    const userAgent = navigator.userAgent;
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    // Concatenate and hash the device information
    const combinedInfo = userAgent + screenWidth + screenHeight;

    const hashed = MD5(combinedInfo).toString();
    console.log(hashed);
    try {
      const { data } = await axios.put(
        `/api/products/${product._id}/shares`,
        { hashed },
        {
          headers: userInfo
            ? { Authorization: `Bearer ${userInfo.token}` }
            : undefined,
        }
      );
      dispatch({ type: 'REFRESH_PRODUCT', payload: data.product });
      if (userInfo) {
        socket.emit('post_data', {
          userId: product.seller._id,
          itemId: product._id,
          notifyType: 'share',
          msg: `${userInfo.username} shared your product`,
          link: `/product/${product.slug}`,
          mobile: { path: 'Product', id: product.slug },
          userImage: userInfo.image,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleShare2 = async () => {
    try {
      await navigator.share({
        title: 'Repeddle',
        text: 'See what I found on Africa’s leading social marketplace for secondhand Pre-loved fashion & items',
        url: shareUrl,
      });
      console.log('Shared successfully');
      handleShare();
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const shareButtons = [
    {
      platform: 'Facebook',
      button: (
        <FacebookShareButton
          quote="See what I found on Africa’s leading social marketplace for secondhand Pre-loved fashion & items"
          hashtag="#Repeddle"
          url={shareUrl}
          onShareWindowClose={handleShare}
        >
          <ShareButton mode={mode}>
            <FacebookIcon size={25} round={true} />
            <ShareButtonText mode={mode}>Facebook</ShareButtonText>
          </ShareButton>
        </FacebookShareButton>
      ),
    },
    {
      platform: 'Email',
      button: (
        <EmailShareButton
          subject="Repeddle"
          body="See what I found on Africa’s leading social marketplace for secondhand Pre-loved fashion & items"
          url={shareUrl}
          onShareWindowClose={handleShare}
        >
          <ShareButton onClick={handleShare} mode={mode}>
            <EmailIcon size={25} round={true} />
            <ShareButtonText mode={mode}>Email</ShareButtonText>
          </ShareButton>
        </EmailShareButton>
      ),
    },
    {
      platform: 'WhatsApp',
      button: (
        <WhatsappShareButton
          url={shareUrl}
          title="See what I found on Africa’s leading social marketplace for secondhand Pre-loved fashion & items"
          onShareWindowClose={handleShare}
        >
          <ShareButton mode={mode}>
            <WhatsappIcon size={25} round={true} />
            <ShareButtonText mode={mode}>WhatsApp</ShareButtonText>
          </ShareButton>
        </WhatsappShareButton>
      ),
    },
    {
      platform: 'Twitter',
      button: (
        <TwitterShareButton
          title="See what I found on Africa’s leading social marketplace for secondhand Pre-loved fashion & items"
          hashtags={['Repeddle']}
          url={shareUrl}
          onShareWindowClose={handleShare}
        >
          <ShareButton mode={mode}>
            <TwitterIcon size={25} round={true} />
            <ShareButtonText mode={mode}>Twitter</ShareButtonText>
          </ShareButton>
        </TwitterShareButton>
      ),
    },
    {
      platform: 'Telegram',
      button: (
        <TelegramShareButton
          url={shareUrl}
          title="See what I found on Africa’s leading social marketplace for secondhand Pre-loved fashion & items"
          onShareWindowClose={handleShare}
        >
          <ShareButton mode={mode}>
            <TelegramIcon size={25} round={true} />
            <ShareButtonText mode={mode}>Telegram</ShareButtonText>
          </ShareButton>
        </TelegramShareButton>
      ),
    },
    {
      platform: 'Pinterest',
      button: (
        <PinterestShareButton
          url={shareUrl}
          media={product.image}
          onShareWindowClose={handleShare}
          description="See what I found on Africa’s leading social marketplace for secondhand Pre-loved fashion & items"
        >
          <ShareButton mode={mode}>
            <PinterestIcon size={25} round={true} />
            <ShareButtonText mode={mode}>Pinterest</ShareButtonText>
          </ShareButton>
        </PinterestShareButton>
      ),
    },
    {
      platform: 'LinkedIn',
      button: (
        <LinkedinShareButton
          title="Repeddle"
          url={shareUrl}
          source={shareUrl}
          summary="See what I found on Africa’s leading social marketplace for secondhand Pre-loved fashion & items"
          description="See what I found on Africa’s leading social marketplace for secondhand Pre-loved fashion & items"
          onShareWindowClose={handleShare}
        >
          <ShareButton mode={mode}>
            <LinkedinIcon size={25} round={true} />
            <ShareButtonText mode={mode}>LinkedIn</ShareButtonText>
          </ShareButton>
        </LinkedinShareButton>
      ),
    },
  ];

  return (
    <Container>
      <IconContainer>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {product.shares.length}
          <FontAwesomeIcon
            onClick={toggleDropdown}
            icon={faShareNodes}
            style={{ marginLeft: '5px' }}
          />
        </div>
        <IconsTooltips className="tiptools" tips="Share " />
      </IconContainer>
      {isDropdownOpen && <Background onClick={toggleDropdown} />}
      {isDropdownOpen && (
        <Dropdown mode={mode} isOpen={isDropdownOpen}>
          <ShareButtonsContainer>
            {shareButtons.map(({ button }) => (
              <>{button}</>
            ))}
            <ShareButton onClick={handleShare2} mode={mode}>
              <FontAwesomeIcon icon={faShareNodes} size={25} />
              <ShareButtonText mode={mode}>More...</ShareButtonText>
            </ShareButton>
          </ShareButtonsContainer>
        </Dropdown>
      )}
    </Container>
  );
};

export default ShareModal;
