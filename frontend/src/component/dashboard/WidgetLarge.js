import React, { useContext } from 'react';
import styled from 'styled-components';
import { Store } from '../../Store';

const Container = styled.div`
  flex: 2;
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev1)' : 'var(--light-ev1)'};
  padding: 20px;
  border-radius: 0.2rem;
`;
const Tittle = styled.div`
  font-size: 22px;
  font-weight: 600;
`;
const Table = styled.table`
  width: 100%;
  border-spacing: 20px;
`;
const Th = styled.th`
  text-align: left;
  padding: 20px 0;
`;
const Tr = styled.tr``;
const User = styled.td`
  display: flex;
  align-items: center;
  padding: 20px 0;
`;
const Img = styled.img.attrs((props) => ({
  src: props.src,
  alt: props.src,
}))`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
`;
const Name = styled.span``;
const Date = styled.td`
  font-weight: 300;
`;
const Amount = styled.td`
  font-weight: 300;
`;
const Status = styled.td``;
const Button = styled.button`
  padding: 5px 7px;
  border: 0;
  border-radius: 0.2rem;
  &.Approved {
    background: ${(props) =>
      props.mode === 'pagebodydark' ? '#112014' : '#d6f5dc'};
    color: var(--green-color);
  }
  &.Declined {
    background: ${(props) =>
      props.mode === 'pagebodydark' ? '#211111' : '#f8d6d6'};
    color: var(--red-color);
  }
  &.Pending {
    background: ${(props) =>
      props.mode === 'pagebodydark' ? 'var(--dark-ev3)' : '#fcf0e0'};
    color: var(--orange-color);
  }
`;

export default function WidgetLarge() {
  const { state } = useContext(Store);
  const { mode } = state;

  const actionButton = (type) => {
    return <Button className={type}>{type}</Button>;
  };

  return (
    <Container mode={mode}>
      <Tittle>Latest transactions</Tittle>
      <Table>
        <Tr>
          <Th>User</Th>
          <Th>Date</Th>
          <Th>Amount</Th>
          <Th>Status</Th>
        </Tr>
        <Tr>
          <User>
            <Img src="/images/pimage.png"></Img>
            <Name>Susan Alex</Name>
          </User>
          <Date>2 June 2022</Date>
          <Amount>$334.56</Amount>
          <Status>{actionButton('Approved')}</Status>
        </Tr>
        <Tr>
          <User>
            <Img src="/images/pimage.png"></Img>
            <Name>Susan Alex</Name>
          </User>
          <Date>2 June 2022</Date>
          <Amount>$334.56</Amount>
          <Status>{actionButton('Pending')}</Status>
        </Tr>
        <Tr>
          <User>
            <Img src="/images/pimage.png"></Img>
            <Name>Susan Alex</Name>
          </User>
          <Date>2 June 2022</Date>
          <Amount>$334.56</Amount>
          <Status>{actionButton('Declined')}</Status>
        </Tr>
        <Tr>
          <User>
            <Img src="/images/pimage.png"></Img>
            <Name>Susan Alex</Name>
          </User>
          <Date>2 June 2022</Date>
          <Amount>$334.56</Amount>
          <Status>{actionButton('Approved')}</Status>
        </Tr>
      </Table>
    </Container>
  );
}
