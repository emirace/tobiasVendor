import React from "react";
import styled from "styled-components";
import EditorComponent from "../EditorComponent";

const Container = styled.div`
  flex: 4;
`;

export default function Articles() {
  return (
    <Container>
      <div>Articles</div>

      <EditorComponent />
    </Container>
  );
}
