import React from "react";
import styled from "styled-components";
import FeatureInfo from "../FeatureInfo";
import WidgetLarge from "../WidgetLarge";

const Container = styled.div`
  flex: 4;
  min-width: 0;
  padding: 0 20px;
`;

const Row = styled.div`
  display: flex;
`;

export default function Earning() {
  return (
    <Container>
      <Row>
        <FeatureInfo type="today" number={"565"} />
        <FeatureInfo type="earning" number={"565"} />
      </Row>
      <WidgetLarge />
    </Container>
  );
}
