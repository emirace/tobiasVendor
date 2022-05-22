import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import SearchBox from '../component/SearchBox';
import { Store } from '../Store';

const Container = styled.div`
  position: fixed;
  top: 0;
  bottom: -55px;
  left: 0;
  right: 0;
  background: ${(props) => (!props.bg ? '#000' : '#fff')};
  z-index: 7;
  overflow: auto;
  padding: 10px;
`;

const Search = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--orange-color);
  margin-bottom: 10px;
  color: #fff;
`;

const CateContainer = styled.div`
  & .active {
    height: auto;
  }
`;
const CateTitle = styled.div`
  padding-top: 10px;
  text-transform: capitalize;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
  position: relative;
  &:before {
    content: '+';
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
  }
`;
const CateItemContainer = styled.div`
  padding-left: 20px;
  overflow: hidden;
  height: 0;
`;
const CateItem = styled.div`
  position: relative;
  margin-bottom: 5px;
  transition: 0.5s;
  text-transform: capitalize;
`;

export default function CategoryMobileScreen() {
  const { state } = useContext(Store);
  const { mode } = state;
  const backMode = (mode) => {
    if (mode === 'pagebodydark') {
      mode = false;
    } else {
      mode = true;
    }
    return mode;
  };
  const footerMode = backMode(mode);
  const [display, setDisplay] = useState();
  const [display1, setDisplay1] = useState();
  const [display2, setDisplay2] = useState();
  const [display3, setDisplay3] = useState();
  const [display4, setDisplay4] = useState();

  return (
    <>
      <Container bg={footerMode}>
        <Search>Let's help you find what you are looking for</Search>
        <SearchBox />

        <CateContainer onClick={() => setDisplay(!display)}>
          <CateTitle>Women's wear</CateTitle>
          <CateItemContainer className={display ? 'active' : ''}>
            <CateItem>Shirts</CateItem>
            <CateItem>Jeans</CateItem>
            <CateItem>pants</CateItem>
            <CateItem>skirts</CateItem>
          </CateItemContainer>
        </CateContainer>
        <CateContainer onClick={() => setDisplay1(!display1)}>
          <CateTitle>Men's wear</CateTitle>
          <CateItemContainer className={display1 ? 'active' : ''}>
            <CateItem>Shirts</CateItem>
            <CateItem>Jeans</CateItem>
            <CateItem>pants</CateItem>
            <CateItem>skirts</CateItem>
          </CateItemContainer>
        </CateContainer>
        <CateContainer onClick={() => setDisplay2(!display2)}>
          <CateTitle>Kids</CateTitle>
          <CateItemContainer className={display2 ? 'active' : ''}>
            <CateItem>Shirts</CateItem>
            <CateItem>Jeans</CateItem>
            <CateItem>pants</CateItem>
            <CateItem>skirts</CateItem>
          </CateItemContainer>
        </CateContainer>
        <CateContainer onClick={() => setDisplay3(!display3)}>
          <CateTitle>Vacation</CateTitle>
          <CateItemContainer className={display3 ? 'active' : ''}>
            <CateItem>Shirts</CateItem>
            <CateItem>Jeans</CateItem>
            <CateItem>pants</CateItem>
            <CateItem>skirts</CateItem>
          </CateItemContainer>
        </CateContainer>
        <CateContainer onClick={() => setDisplay4(!display4)}>
          <CateTitle>Summer</CateTitle>
          <CateItemContainer className={display4 ? 'active' : ''}>
            <CateItem>Shirts</CateItem>
            <CateItem>Jeans</CateItem>
            <CateItem>pants</CateItem>
            <CateItem>skirts</CateItem>
          </CateItemContainer>
        </CateContainer>
      </Container>
    </>
  );
}
