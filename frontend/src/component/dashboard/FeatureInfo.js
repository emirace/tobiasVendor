import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;
const Item = styled.div`
  flex: 1;
  margin: 0 20px;
  padding: 30px;
  border-radius: 0.2rem;
  cursor: pointer;
  background: var(--dark-ev1);
`;
const Title = styled.span`
  font-size: 20px;
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
  return (
    <Container>
      <Item>
        <Title>Revenue</Title>
        <MoneyContainer>
          <Money>$24.54</Money>
          <MoneyRate>
            -2.45
            <FontAwesomeIcon className="negative" icon={faArrowDown} />
          </MoneyRate>
        </MoneyContainer>
        <Sub>Compared to last moonth</Sub>
      </Item>
      <Item>
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
      <Item>
        <Title>Cost</Title>
        <MoneyContainer>
          <Money>$13.54</Money>
          <MoneyRate>
            +2.45
            <FontAwesomeIcon icon={faArrowUp} />
          </MoneyRate>
        </MoneyContainer>
        <Sub>Compared to last moonth</Sub>
      </Item>
    </Container>
  );
}
