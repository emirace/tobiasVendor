import React from 'react';
import styled from 'styled-components';
import {
  faCalendarDays,
  faEnvelope,
  faLocationDot,
  faPhone,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Container = styled.div`
  flex: 4;
  padding: 20px;
`;
const TitleCont = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Title = styled.h1``;
const AddButton = styled.button`
  width: 80px;
  border: none;
  padding: 5px;
  border-radius: 0.2rem;
  background: var(--green-color);
  color: var(--white-color);
`;
const UserContainer = styled.div`
  display: flex;
  margin-top: 20px;
`;
const Show = styled.div`
  flex: 1;
  padding: 20px;
  background: var(--dark-ev1);
  border-radius: 0.2rem;
`;
const Update = styled.div`
  flex: 2;
  padding: 20px;
  background: var(--dark-ev1);
  border-radius: 0.2rem;
  margin-left: 20px;
`;
const ShowTop = styled.div`
  display: flex;
  align-items: center;
`;
const Image = styled.img.attrs((props) => ({
  src: props.src,
  alt: props.alt,
}))`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;
const TopTitle = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
`;
const Name = styled.span`
  font-weight: 600;
`;
const UserTitle = styled.span`
  font-weight: 300;
`;
const ShowBottom = styled.div`
  margin-top: 20px;
`;
const BottomTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
`;
const Username = styled.span``;
const Info = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  & svg {
    font-size: 14px;
  }
`;

export default function User() {
  return (
    <Container>
      <TitleCont>
        <Title>Edit User</Title>
        <AddButton>Create</AddButton>
      </TitleCont>
      <UserContainer>
        <Show>
          <ShowTop>
            <Image src="/images/men.png" alt="" />
            <TopTitle>
              <Name>John Doe</Name>
              <UserTitle>Seller</UserTitle>
            </TopTitle>
          </ShowTop>
          <ShowBottom>
            <BottomTitle>Account Details</BottomTitle>
            <Info>
              <FontAwesomeIcon icon={faUser} />
              <Username>@Johndoe</Username>
            </Info>
            <Info>
              <FontAwesomeIcon icon={faCalendarDays} />
              <Username>02 Jan 2022</Username>
            </Info>
            <Info>
              <FontAwesomeIcon icon={faPhone} />
              <Username>08012345678</Username>
            </Info>
            <Info>
              <FontAwesomeIcon icon={faEnvelope} />
              <Username>example@email.com</Username>
            </Info>
            <Info>
              <FontAwesomeIcon icon={faLocationDot} />
              <Username>address</Username>
            </Info>
          </ShowBottom>
        </Show>
        <Update></Update>
      </UserContainer>
    </Container>
  );
}
