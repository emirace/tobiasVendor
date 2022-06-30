import {
  faCirclePlus,
  faMoneyBillTransfer,
  faPlus,
  faReceipt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import styled from 'styled-components';
import { Store } from '../../Store';
import WidgetLarge from './WidgetLarge';
const Container = styled.div`
  flex: 4;
  margin-left: 20px;
  padding: 20px;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev1)' : 'var(--light-ev1)'};
  @media (max-width: 992px) {
    padding: 10px;
    margin: 0;
  }
`;
const BannerImage = styled.div`
  background: var(--orange-color);
  height: 200px;

  display: flex;
  justify-content: center;

  padding: 20px;
  position: relative;
`;
const Text = styled.div`
  font-weight: 600;
  font-size: 35px;
`;
const Content = styled.div`
  margin-top: 150px;
  display: flex;
  justify-content: center;
`;
const Detail = styled.div`
  padding: 20px;
  position: absolute;
  left: 50%;
  width: 80%;
  border-radius: 0.2rem;
  bottom: -150px;
  transform: translateX(-50%);
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev2)' : 'var(--light-ev2)'};
`;
const Top = styled.div`
  display: flex;
  justify-content: space-around;
  font-size: 20px;
  font-weight: 300;
`;
const Left = styled.div``;
const DateTop = styled.div``;
const DateBottom = styled.div``;
const Right = styled.div`
  display: flex;
  flex-direction: column;
  align-items: end;
`;
const Balance = styled.div`
  font-weight: bold;
`;
const Currency = styled.div`
  font-size: 15px;
`;
const Bottom = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 30px 120px 10px 120px;
`;
const Action = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  & svg {
    font-size: 45px;
    margin-bottom: 10px;
  }
`;
const TextSmall = styled.div`
  font-size: 20px;
  font-weight: 300;
`;
export default function Transactions() {
  const { state } = useContext(Store);
  const { mode } = state;
  return (
    <Container mode={mode}>
      <BannerImage>
        <Text>Wallet</Text>
        <Detail mode={mode}>
          <Top>
            <Left>
              <DateTop>Monday</DateTop>
              <DateBottom>23 Sep 2022</DateBottom>
            </Left>
            <Right>
              <Balance>$30</Balance>
              <Currency>Repeddle Balance</Currency>
            </Right>
          </Top>
          <Bottom>
            <Action>
              <FontAwesomeIcon icon={faCirclePlus} />
              <TextSmall>Top Up</TextSmall>
            </Action>
            <Action>
              <FontAwesomeIcon icon={faReceipt} />
              <TextSmall>Withdral</TextSmall>
            </Action>
            <Action>
              <FontAwesomeIcon icon={faMoneyBillTransfer} />
              <TextSmall>Top Up</TextSmall>
            </Action>
          </Bottom>
        </Detail>
      </BannerImage>
      <Content>
        <WidgetLarge />
      </Content>
    </Container>
  );
}
