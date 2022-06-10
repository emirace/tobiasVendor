import React from 'react';
import styled from 'styled-components';
import {
  faCalendarDays,
  faEnvelope,
  faLocationDot,
  faPhone,
  faUpload,
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
const Username = styled.span`
  margin-left: 10px;
`;
const Info = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  & svg {
    font-size: 14px;
  }
`;
const Left = styled.div``;
const Right = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const UpdateTitle = styled.span`
  font-size: 22px;
  font-weight: 600;
`;
const Form = styled.form`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;
const Item = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;
const Label = styled.label`
  margin-bottom: 5px;
  font-size: 14px;
`;
const TextInput = styled.input`
  border: none;
  width: 250px;
  height: 30px;
  border-bottom: 1px solid var(--dark-ev3);
  background: none;
  padding-left: 10px;
  color: var(--white-color);
  &:focus {
    outline: none;
    border-bottom: 1px solid var(--orange-color);
  }
  &::placeholder {
    font-size: 12px;
  }
`;
const Upload = styled.div`
  display: flex;
  align-items: center;
`;
const UploadImg = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  object-fit: cover;
  margin-right: 20px;
`;
const UploadInput = styled.input`
  display: none;
`;
const UploadLabel = styled.label`
  & svg {
    cursor: pointer;
  }
`;
const UploadButton = styled.button`
  border: none;
  border-radius: 0.2rem;
  cursor: pointer;
  padding: 5px;
  background: var(--orange-color);
  color: var(--white-color);
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
            <Image src="/images/men.png" alt="p" />
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
            <BottomTitle>Account Details</BottomTitle>

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
        <Update>
          <UpdateTitle>Edit</UpdateTitle>
          <Form>
            <Left>
              <Item>
                <Label>Full Name</Label>
                <TextInput placeholder="John Doe" />
              </Item>
              <Item>
                <Label>Email</Label>
                <TextInput placeholder="John@mail.com" />
              </Item>
              <Item>
                <Label>DOB</Label>
                <TextInput placeholder="02 Jan 2022" />
              </Item>
              <Item>
                <Label>Phone</Label>
                <TextInput placeholder="09012345678" />
              </Item>
              <Item>
                <Label>Address</Label>
                <TextInput placeholder="address" />
              </Item>
            </Left>
            <Right>
              <Upload>
                <UploadImg src="/images/men.png" alt="" />
                <UploadLabel htmlFor="file">
                  <FontAwesomeIcon icon={faUpload} />
                </UploadLabel>
                <UploadInput type="file" id="file" />
              </Upload>
              <UploadButton>Update</UploadButton>
            </Right>
          </Form>
        </Update>
      </UserContainer>
    </Container>
  );
}
