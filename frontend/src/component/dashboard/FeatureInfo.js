import React from 'react';
import styled from 'styled-components';

const Container = styled.div``;
const Item = styled.div``;
const Title = styled.span``;
const MoneyContainer = styled.span``;
const Money = styled.span``;
const MoneyRate = styled.span``;

export default function FeatureInfo() {
  return (
    <Container>
      <Item>
        <Title>Revenue</Title>
        <MoneyContainer>
          <Money>$24.54</Money>
          <MoneyRate>$2.45</MoneyRate>
        </MoneyContainer>
      </Item>
    </Container>
  );
}
