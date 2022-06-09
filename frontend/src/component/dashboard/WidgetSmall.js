import { faEye } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  flex: 1;
  background: var(--dark-ev1);
  padding: 20px;
  margin-right: 20px;
  border-radius: 0.2rem;
`;
const Tittle = styled.div`
  font-size: 22px;
  font-weight: 600;
`;
const List = styled.ul``;
const ListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0;
`;
const Img = styled.img.attrs((props) => ({
  src: props.src,
  alt: props.alt,
}))`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;
const User = styled.div`
  display: flex;
  flex-direction: column;
`;
const Username = styled.span`
  font-weight: 600;
`;
const Role = styled.span`
  font-weight: 300;
`;
const Button = styled.button`
  display: flex;
  align-items: center;
  border: none;
  border-radius: 0.2rem;
  padding: 5px 10px;
  background: var(--orange-color);
  color: var(--white-color);
  cursor: pointer;
  & svg {
    font-size: 16px;
    margin-right: 5px;
  }
`;

export default function WidgetSmall() {
  return (
    <Container>
      <Tittle>New Join Members</Tittle>
      <List>
        <ListItem>
          <Img src="/images/men.png" alt="profile" />
          <User>
            <Username>John Doe</Username>
            <Role>Seller</Role>
          </User>
          <Button>
            <FontAwesomeIcon icon={faEye} /> Display
          </Button>
        </ListItem>
        <ListItem>
          <Img src="/images/men.png" alt="profile" />
          <User>
            <Username>John Doe</Username>
            <Role>Seller</Role>
          </User>
          <Button>
            <FontAwesomeIcon icon={faEye} /> Display
          </Button>
        </ListItem>
        <ListItem>
          <Img src="/images/men.png" alt="profile" />
          <User>
            <Username>John Doe</Username>
            <Role>Seller</Role>
          </User>
          <Button>
            <FontAwesomeIcon icon={faEye} /> Display
          </Button>
        </ListItem>
        <ListItem>
          <Img src="/images/men.png" alt="profile" />
          <User>
            <Username>John Doe</Username>
            <Role>Seller</Role>
          </User>
          <Button>
            <FontAwesomeIcon icon={faEye} /> Display
          </Button>
        </ListItem>
        <ListItem>
          <Img src="/images/men.png" alt="profile" />
          <User>
            <Username>John Doe</Username>
            <Role>Seller</Role>
          </User>
          <Button>
            <FontAwesomeIcon icon={faEye} /> Display
          </Button>
        </ListItem>
      </List>
    </Container>
  );
}
