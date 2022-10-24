import React from "react";
import styled from "styled-components";

const Container = styled.div`
  padding: 30px;
`;
const Title = styled.div`
  font-weight: bold;
  font-size: 16;
  margin: 10px 0;
`;
const Content = styled.div``;
const SmallContent = styled.span`
  font-size: 11px;
`;
export default function Condition() {
  return (
    <Container>
      <h1 className="mb-3">Condition</h1>
      <Title>NEW WITH TAGs</Title>
      <Content>
        New with Tags: A preowned secondhand product that has never been worn or
        used. These products reflect no sign of use and has its original
        purchase tags on it (include a photo of the tag).{" "}
        <SmallContent>
          This product shows no alterations, no defects and comes with Original
          purchase tags.
        </SmallContent>
      </Content>
      <Title>NEW WITH NO TAGs</Title>
      <Content>
        A preowned secondhand product that has never been worn or use but
        doesn’t have original purchase tags.{" "}
        <SmallContent>
          This product should show no defects or alterations.
        </SmallContent>
      </Content>
      <Title>EXCELLENT CONDITION</Title>
      <Content>
        A preowned secondhand Product still in an excellent condition that has
        only been used or worn very slightly, (perhaps 1–3 times) and carefully
        maintained. These Product may reflect very minimal worn or usage sign.
        Please kindly take clear picture of the slight usage signs to be visible
        on the product Image.{" "}
        <SmallContent>
          Product must not have any damage on the fabric or material, no worn
          smell and no missing accessory, button or pieces.
        </SmallContent>
      </Content>
      <Title>GOOD CONDITION</Title>
      <Content>
        A preowned secondhand product in a very good condition which has been
        used or worn and properly maintained. No remarkable defects (Tear, Hole
        or Rust) expected. Any slight defect must be mentioned and indicated in
        the product description and photo.
      </Content>
      <Title>FAIR CONDITION</Title>
      <Content>
        A preowned secondhand product which has been frequently used or worn.
        Products may show reasonable defects signs, scratches, worn corners or
        interior wear.{" "}
        <SmallContent>
          Defects are to be shown on product photos and mentioned in
          description.
        </SmallContent>
      </Content>
    </Container>
  );
}
