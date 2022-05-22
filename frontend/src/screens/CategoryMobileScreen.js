import React, {useState,useContext} from 'react';
import styled from 'styled-components';
import SearchBox from '../component/SearchBox';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Store } from '../Store';

const Container = styled.div`
position:fixed;
top:0;
bottom:-55px;
left:0;
right:0;
background:#fff;
z-index:7;
overflow:auto;
padding:10px;
`;

const Search = styled.div`
display:flex;
justify-content:center;
align-items:center;
background:var(--orange-color);
margin-bottom:10px;
color:#fff;
  
`;

const CateContainer = styled.div`
& .active{
height:auto;
}
 
`
const CateTitle = styled.div`
  padding-top: 10px;
  text-transform: capitalize;
  margin-bottom: 20px;
  padding-bottom:10px;
  border-bottom:1px solid #ddd;
  position: relative;
  &:before{
  content: '+';
  position: absolute;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  };
`
const CateItemContainer = styled.div`
padding-left:20px;
overflow:hidden;
height:0;

`
const CateItem = styled.div`
position: relative;
  margin-bottom:5px;
  transition: 0.5s;
  text-transform:capitalize;
`

const Switch = styled.input.attrs({                          type: 'checkbox',                                                role: 'switch',
})`                                                        position:relative;                                         width: 40px;                                               height: 15px;                                              -webkit-appearance: none;
  background: #fff;                                          border-radius: 20px;                                       outline: none;                                             transition: 0.5s;                                          @media (max-width: 992px) {                                                                          }                                                          &:checked {                                                  background: #000;                                          &:before {                                                   left: 25px;
    }                                                        }                                                          &:before {                                                   width: 15px;                                               height: 15px;                                              border-radius: 50%;
    content: '';                                               position: absolute;
    top: 0;
    left: 0;
    background: var(--malon-color);
    transition: 0.5s;
  }
`;

export default function CategoryMobileScreen() {

	const { state,dispatxh:ctxDispatch } = useContext(Store);  const { userInfo,mode } = state;

	const [display,setDisplay]=useState();
	const [display1,setDisplay1]=useState();
	const [display2,setDisplay2]=useState();
	const [display3,setDisplay3]=useState();
	const [display4,setDisplay4]=useState();

	const darkMode = (mode) => {                           if (mode) {                                                   ctxDispatch({type:'CHANGE_MODE',payload:'pagebodydark'});                                                       localStorage.setItem('mode', 'pagebodydark');         
	} else{                                                        ctxDispatch({type:'CHANGE_MODE',payload:'pagebodylight'});                                                   localStorage.setItem('mode', 'pagebodylight');           };                                                  };

  return (<>
	  <Container>
	  <Search>Let's help you find what you are looking for
          </Search>
	  <SearchBox />
	  
	  <CateContainer onClick={()=>setDisplay(!display)}>
	  <CateTitle>Women's wear
	  </CateTitle>
	  <CateItemContainer className={display?'active':''}>
	  <CateItem>Shirts</CateItem>
	  <CateItem>Jeans</CateItem>
	  <CateItem>pants</CateItem>
	  <CateItem>skirts</CateItem>
	  </CateItemContainer>
	  </CateContainer>
	  <CateContainer onClick={()=>setDisplay1(!display1)}>
          <CateTitle>Men's wear
          </CateTitle>
          <CateItemContainer className={display1?'active':''}>
          <CateItem>Shirts</CateItem>
          <CateItem>Jeans</CateItem>
          <CateItem>pants</CateItem>
          <CateItem>skirts</CateItem>
          </CateItemContainer>
          </CateContainer>
	  <CateContainer onClick={()=>setDisplay2(!display2)}>
          <CateTitle>Kids
          </CateTitle>
          <CateItemContainer className={display2?'active':''}>
          <CateItem>Shirts</CateItem>
          <CateItem>Jeans</CateItem>
          <CateItem>pants</CateItem>
          <CateItem>skirts</CateItem>
          </CateItemContainer>
          </CateContainer>
	  <CateContainer onClick={()=>setDisplay3(!display3)}>
          <CateTitle>Vacation
          </CateTitle>
          <CateItemContainer className={display3?'active':''}>
          <CateItem>Shirts</CateItem>
          <CateItem>Jeans</CateItem>
          <CateItem>pants</CateItem>
          <CateItem>skirts</CateItem>
          </CateItemContainer>
          </CateContainer>
	  <CateContainer onClick={()=>setDisplay4(!display4)}>
          <CateTitle>Summer
          </CateTitle>
          <CateItemContainer className={display4?'active':''}>
          <CateItem>Shirts</CateItem>
          <CateItem>Jeans</CateItem>
          <CateItem>pants</CateItem>
          <CateItem>skirts</CateItem>
          </CateItemContainer>
          </CateContainer>
	  <CateContainer>
	  <CateTitle>
	  <Switch                                                      checked={mode === 'pagebodydark'}                          onChange={(e) => darkMode(e.target.checked)}               />
	  hello
	  </CateTitle>
	  </CateContainer>
	  </Container>
	  </>

  )
	

}
