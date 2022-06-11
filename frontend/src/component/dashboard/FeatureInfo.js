import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
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
  flex: 1;
  padding: 30px;
  border-radius: 0.2rem;
  cursor: pointer;
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev1)' : 'var(--light-ev1)'};
`;
const Left = styled.div``;
const Right = styled.div``;

const Title = styled.span`
  font-size: 20px;
`;
const Counter = styled.span``;
const Links = styled.span``;
const Percentage = styled.div`
  & svg {
    font-size: 12px;
    margin-left: 5px;
    color: green;
    &.negative {
      color: red;
    }
  }
`;
const MoneyContainer = styled.span`
  margin: 10px 0;
  display: flex;
  align-items: center;
`;
const Money = styled.span`
  font-size: 30px;
  font-weight: 600;
`;
const MoneyRate = styled.span`
  display: flex;
  align-items: center;
  margin-left: 20px;
  & svg {
    font-size: 12px;
    margin-left: 5px;
    color: green;
    &.negative {
      color: red;
    }
  }
`;
const Sub = styled.div``;

export default function FeatureInfo() {
  const { state } = useContext(Store);
  const { mode } = state;
  return (
    <Container>
      <Item mode={mode}>
        <Left>
          <Title>USERS</Title>
          <Counter>123456</Counter>
          <Links>See all users</Links>
        </Left>
        <Right>
          <Percentage>
            <FontAwesomeIcon className="negative" icon={faArrowDown} />
            20%
          </Percentage>
        </Right>

        <MoneyContainer>
          <Money>$24.54</Money>
          <MoneyRate>-2.45</MoneyRate>
        </MoneyContainer>
        <Sub>Compared to last moonth</Sub>
      </Item>
      {/*<Item mode={mode}>
        <Title>Sales</Title>
        <MoneyContainer>
          <Money>$56.54</Money>
          <MoneyRate>
            -14.45
            <FontAwesomeIcon className="negative" icon={faArrowDown} />
          </MoneyRate>
        </MoneyContainer>
        <Sub>Compared to last moonth</Sub>
      </Item>
      <Item mode={mode}>
        <Title>Cost</Title>
        <MoneyContainer>
          <Money>$13.54</Money>
          <MoneyRate>
            +2.45
            <FontAwesomeIcon icon={faArrowUp} />
          </MoneyRate>
        </MoneyContainer>
        <Sub>Compared to last moonth</Sub>
      </Item> */}
    </Container>
  );
}
