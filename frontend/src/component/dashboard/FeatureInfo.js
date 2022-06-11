import {
  faArrowDown,
  faArrowUp,
  faBagShopping,
  faFileInvoice,
  faMoneyBill,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { Store } from '../../Store';

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
const Item = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
  padding: 20px;
  border-radius: 0.2rem;
  cursor: pointer;
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev1)' : 'var(--light-ev1)'};
`;
const Left = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const Right = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  & .icon {
    font-size: 18px;
    padding: 5px;
    align-self: flex-end;
    border-radius: 0.2rem;
  }
`;

const Title = styled.span`
  font-size: 14px;
  font-weight: 600;
`;
const Counter = styled.span`
  font-size: 28px;
  font-weight: 300;
`;
const Links = styled.span`
  font-size: 12px;
  width: max-content;
  border-bottom: 1px solid
    ${(props) =>
      props.mode === 'pagebodydark' ? 'var(--dark-ev3)' : 'var(--light-ev3)'}; ;
`;
const Percentage = styled.div`
  display: flex;
  align-items: center;
  & svg {
    font-size: 12px;
    margin-right: 5px;
    color: green;
    &.negative {
      color: red;
    }
  }
`;

export default function FeatureInfo({ type }) {
  const { state } = useContext(Store);
  const { mode } = state;
  let data;

  switch (type) {
    case 'user':
      data = {
        title: 'USERS',
        isMoney: false,
        link: 'See all users',
        icon: (
          <FontAwesomeIcon
            style={{
              color: 'var(--malon-color)',
              background: `${mode === 'pagebodydark' ? '#332021' : '#ecdada'}`,
            }}
            className="icon"
            icon={faUser}
          />
        ),
      };
      break;
    case 'order':
      data = {
        title: 'ORDERS',
        isMoney: false,
        link: 'view all orders',
        icon: (
          <FontAwesomeIcon
            style={{
              color: 'var(--orange-color)',
              background: `${mode === 'pagebodydark' ? '#473527' : '#fcf0e0'}`,
            }}
            className="icon"
            icon={faBagShopping}
          />
        ),
      };
      break;
    case 'earning':
      data = {
        title: 'EARNINGS',
        isMoney: true,
        link: 'view all net earning',
        icon: (
          <FontAwesomeIcon
            className="icon"
            icon={faMoneyBill}
            style={{
              color: 'var(--green-color)',
              background: `${mode === 'pagebodydark' ? '#1d3b23' : '#d6f5dc'}`,
            }}
          />
        ),
      };
      break;
    case 'balance':
      data = {
        title: 'BALANCE',
        isMoney: true,
        link: 'See details',
        icon: (
          <FontAwesomeIcon
            style={{
              color: 'var(--white-color)',
              background: `${mode === 'pagebodydark' ? '#464646' : '#d9d9d9'}`,
            }}
            className="icon"
            icon={faFileInvoice}
          />
        ),
      };

      break;

    default:
      break;
  }

  return (
    <Container>
      <Item mode={mode}>
        <Left>
          <Title>{data.title}</Title>
          <Counter>{data.isMoney && '$'} 1254</Counter>
          <Links>{data.link}</Links>
        </Left>
        <Right>
          <Percentage>
            {<FontAwesomeIcon className="negative" icon={faArrowDown} />}
            20 %
          </Percentage>
          {data.icon}
        </Right>
      </Item>
    </Container>
  );
}
