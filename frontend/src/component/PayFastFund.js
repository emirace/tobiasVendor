import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { socket } from "../App";
import { Store } from "../Store";
import { region } from "../utils";
import LoadingBox from "./LoadingBox";
const PAYFAST_ID = process.env.REACT_APP_PAYFAST_ID;
const PAYFAST_KEY = process.env.REACT_APP_PAYFAST_KEY;

const Button = styled.div`
  cursor: pointer;
  color: var(--white-color);
  background: var(--orange-color);
  width: 100%;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.2rem;
  height: 40px;
  &:hover {
    background: var(--malon-color);
  }
`;

export default function PayFastFund({
  totalPrice,
  setShowModel,
  setRefresh,
  refresh,
}) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const myData = {};
  // Merchant details
  myData["merchant_id"] = PAYFAST_ID;
  myData["merchant_key"] = PAYFAST_KEY;
  myData["return_url"] = "https://www.repeddle.co.za";
  myData["cancel_url"] = "https://www.repeddle.co.za";
  myData["notify_url"] = "https://www.repeddle.co.za/api/transactions/payfund";
  // Buyer details
  myData["name_first"] = userInfo.firstName;
  myData["name_last"] = userInfo.lastName;
  myData["email_address"] = userInfo.email;
  // Transaction details
  myData["m_payment_id"] = "1234";
  myData["amount"] = `${totalPrice}`;
  myData["item_name"] = `fundwallet`;

  //custom

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data: identifier } = await axios.put(
        "/api/transactions/process",
        { myData },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (identifier !== null) {
        setShowModel(false);

        window.payfast_do_onsite_payment(identifier, async function (result) {
          console.log(result);
          if (result === true) {
            console.log(" Payment Completed");
            setShowModel(false);
            setRefresh(!refresh);
          } else {
            console.log("Payment Window Closed");
          }
        });
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return loading ? (
    <LoadingBox />
  ) : (
    <Button onClick={handleSubmit}>Proceed to Payment</Button>
  );
}
