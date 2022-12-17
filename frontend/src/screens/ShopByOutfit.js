import React, { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Card from "../component/Card";
import { Store } from "../Store";

const Container = styled.div`
  margin: 20px;
`;
const Name = styled.h1`
  font-weight: bold;
  text-transform: capitalize;
  display: flex;
  justify-content: center;
  padding-top: 20px;
`;
const Banner = styled.img`
  height: 350px;
  width: 100%;
  object-fit: cover;
`;
const Categories = styled.div`
  display: flex;
  margin: 20px 0;
`;
const SubCategories = styled.div`
  margin: 15px;
  padding: 5px 20px;
  border: 1px solid;
  border-radius: 15px;
  &.active {
    background: ${(props) =>
      props.mode === "pagebodydark"
        ? "var(--white-color)"
        : "var(--black-color)"};
    color: ${(props) =>
      props.mode === "pagebodydark"
        ? "var(--black-color)"
        : "var(--white-color)"};
  }
`;
const Content = styled.div`
  display: flex;
  gap: 20px;
  padding: 0 25px;
  flex-wrap: wrap;
  border: 1px solid;
`;
const CardCont = styled.div`
  width: 23%;
`;
const AdsCont = styled.div`
  display: flex;
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;
const AdsImage = styled.img`
  height: 600px;
`;
const Text = styled.div`
  flex: 1;
  margin: auto;
  text-align: center;
  font-size: 50px;

  font-weight: bold;
  @media (max-width: 992px) {
    font-size: 20px;
  }
`;
export default function ShopByOutfit() {
  const { state } = useContext(Store);
  const { mode } = state;

  return (
    <Container>
      <Helmet>
        <title>Shop By Outfit</title>
      </Helmet>
      <Name>Shop By Outfit</Name>
      {true ? (
        <AdsCont>
          <AdsImage
            src="https://res.cloudinary.com/emirace/image/upload/v1671258906/Picture2_gkly49.png"
            alt=""
          />
          <Text>Coming Soon</Text>
        </AdsCont>
      ) : (
        <>
          <Banner src="/images/p9.png" alt="outfit" />
          <Categories>
            <SubCategories mode={mode}>All</SubCategories>
            <SubCategories mode={mode}>At the Office</SubCategories>

            <SubCategories mode={mode}>
              <Link to="../createoutfits">Add Outfit</Link>
            </SubCategories>
          </Categories>
          <Content>
            <CardCont>
              <Card src="/images/women.png" name="johnnycage" />
            </CardCont>
            <CardCont>
              <Card src="/images/card1.png" name="indianajone" />
            </CardCont>
            <CardCont>
              <Card src="/images/card2.png" name="kareem" />
            </CardCont>
            <CardCont>
              <Card src="/images/p1.jpg" name="fanstatic" />
            </CardCont>
            <CardCont>
              <Card src="/images/card2.png" name="kareem" />
            </CardCont>
            <CardCont>
              <Card src="/images/p1.jpg" name="fanstatic" />
            </CardCont>
          </Content>
        </>
      )}
    </Container>
  );
}
