import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Store } from "../Store";
import LoadingBox from "./LoadingBox";

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

export default function PayFast({ amount, orderId, onApprovePayFast }) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [signature, setSignature] = useState("");

  const myData = {};
  // Merchant details
  myData["merchant_id"] = "10028147";
  myData["merchant_key"] = "s2mmqq737at89";
  myData["return_url"] = "http://www.repeddle.co.za/return_url";
  myData["cancel_url"] = "http://www.repeddle.co.za/cancel_url";
  myData["notify_url"] = "http://www.repeddle.co.za/api/orders/payfast/pay";
  // Buyer details
  myData["name_first"] = "First Name";
  myData["name_last"] = "Last Name";
  myData["email_address"] = "test@test.com";
  // Transaction details
  myData["m_payment_id"] = "1234";
  myData["amount"] = "100";
  myData["item_name"] = "orderId";

  const handleSubmit = async () => {
    const { data: identifier } = await axios.put(
      "/api/transactions/process",
      { myData },
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );
    if (identifier !== null) {
      window.payfast_do_onsite_payment(identifier, function (result) {
        if (result === true) {
          console.log(" Payment Completed");
          onApprovePayFast({ method: "payfast", myData });
        } else {
          console.log("Payment Window Closed");
        }
      });
    }
  };

  return <Button onClick={handleSubmit}>Proceed to Payment</Button>;
}
