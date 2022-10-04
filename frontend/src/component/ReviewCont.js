import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components';
import axios from "axios";
import Rating from "../component/Rating";
import LoadingBox from './LoadingBox';
import { Store } from '../Store';
import { getError } from '../utils';

const ListGroupI = styled.div`
  margin-left: 10px;
`;


export const ReviewCont = ({ review }) => {
  
  const [user,setUser]=useState(null)
useEffect(() => {
  const fetchData = async () => {
    try {
      const { data: dataUser } = await axios.get(
        `/api/users/seller/${review.user}`
      );
      setUser(dataUser);
    } catch (err) {
      console.log(getError(err));
    }
  };
  fetchData();
}, []);
    return (!user?<LoadingBox/>:
        <div className="single_product_seller m-4">
                <img
                  src={user.image}
                  alt="review"
                  id="single_product_seller_sq"
                  style={{width:'50px',height:'50px',borderRadius:'50%'}}
                />
                <ListGroupI>
                  <strong>@{review.name}</strong>
                  <p>
                    <Rating rating={review.rating} caption=" "></Rating>
                  </p>

                  <p>{review.comment}</p>
                  <p>
                    <small>{review.createdAt.substring(0, 10)}</small>
                  </p>
                </ListGroupI>
              </div>
    )
}
