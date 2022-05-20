import axios from 'axios';                                            import React, { useContext, useReducer, useState } from 'react';      import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';                              import { Helmet } from 'react-helmet-async';                          import { toast } from 'react-toastify';                               import { Store } from '../Store';
import { getError } from '../utils';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';                                                               import {
  faBagShopping,                                                  faCircleHalfStroke,                                             faEnvelope,
  faGear,
  faHeart,                                                        faRightFromBracket,
	faTag,
	faBasketShopping,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import Rating from '../component/Rating';


const reducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_REQUEST':                                                  return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };

    default:                                                                return state;                                                     }
};

const Container = styled.div`
margin:30px;
display:flex;
`;

const Left = styled.div`
flex:1;

`;

const Right = styled.div`
flex:3;
padding:5px 20px;

`;
const Menu = styled.div`
padding:0 20px;
border:1px solid #ddd;
`;
const MenuItem = styled.div`
margin-bottom:10px;
border-bottom:1px solid #ddd;
position:relative;
padding:5px;
&:hover{
background:var(--orange-color);
color:var(--malon-color);
}
& svg{
margin-right:10px;
}
&:last-child{
border-bottom:0;
}
`;
const Profile = styled.div`
display:flex;
padding:0 10px;
`;
const Status = styled.div``;
const Action = styled.div``;
const Image = styled.img.attrs(props=>({
	src:props.src,
	alt:props.alt,
}))`
width:100px;
height:100px;
border-radius:50%;
object-fit:cover;
`
const Detail = styled.div`
display:flex;
flex-direction:column;
margin:0 15px;
justify-content:center;

`;
const Name = styled.div`
font-weight:bold;
text-transform:capitalize;
`;
const Location = styled.div`
text-transform:capitalize;
`;
const  Sold = styled.div``;
const Online = styled.div``;

export default function MyAccountScreen () {

	return (
		
		<Container>
		<Left>
		<Menu>
			<MenuItem>
		<FontAwesomeIcon icon={faUser}/>
		Account</MenuItem>
			<MenuItem>
			<FontAwesomeIcon icon={faBagShopping}/>
			Orders</MenuItem>
			<MenuItem>
		<FontAwesomeIcon icon={faEnvelope}/>
		Inbox</MenuItem>
			<MenuItem>
		<FontAwesomeIcon icon={faBasketShopping}/>
		Product</MenuItem>
		<MenuItem>
                <FontAwesomeIcon icon={faRightFromBracket}/>
                Logout</MenuItem>
		</Menu>
		</Left>
		<Right><Profile><Image alt='profile' src='/images/pimage.png'/><Detail><Name>john doe</Name><Location>Benin, Nigeria</Location><Rating rating={5} /></Detail></Profile>
		<Status><Sold>
		<FontAwesomeIcon icon={faTag} />51</Sold><Online>Online</Online></Status>
		<Action></Action>
		</Right>
		</Container>

	)}
