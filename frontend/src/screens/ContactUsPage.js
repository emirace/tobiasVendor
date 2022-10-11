import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Content = styled.div`
  width: 70vw;
  height: 50vw;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  display: flex;
`;

const Col = styled.div`
  flex: 1;
`;

export default function ContactUsPage() {
  return (
    <Container>
      <Content>
        <Col>
          <h1>Get in Touch</h1>
        </Col>
        <Col></Col>
      </Content>
    </Container>
  );
}
