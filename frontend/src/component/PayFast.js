import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Store } from "../Store";
import LoadingBox from "./LoadingBox";

const Button = styled.button`
  cursor: pointer;
  color: var(--white-color);
  background: var(--malon-color);
  width: 100%;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.2rem;
  height: 40px;
  &:focus-visible {
    outline: none;
  }
`;

export default function PayFast({ amount, orderId }) {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [signature, setSignature] = useState("");

  const myData = {};
  // Merchant details
  myData["merchant_id"] = "10028147";
  myData["merchant_key"] = "s2mmqq737at89";
  // myData["return_url"] = "http://www.repeddle.co.za/return_url";
  // myData["cancel_url"] = "http://www.repeddle.co.za/cancel_url";
  // myData["notify_url"] = "http://www.repeddle.co.za/api/orders/payfast/pay";
  // Buyer details
  // myData["name_first"] = "First Name";
  // myData["name_last"] = "Last Name";
  // myData["email_address"] = "test@test.com";
  // Transaction details
  // myData["m_payment_id"] = "1234";
  myData["amount"] = 100;
  myData["item_name"] = "orderId";

  useEffect(() => {
    const getSignature = async () => {
      const { data } = await axios.post(
        "/api/transactions/signature",
        { myData },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      setSignature(data);
      myData["signature"] = data;
    };
    getSignature();
  }, []);
  const renderView = () => {
    return `<div>helle</div>`;
  };
  const handleSubmit = async () => {
    const { data: identifier } = await axios.put(
      "/api/transactions/process",
      { myData },
      {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      }
    );
    if (identifier !== null) {
      window.payfast_do_onsite_payment({ uuid: identifier }, function (result) {
        if (result === true) {
          console.log(" Payment Completed");
        } else {
          console.log("Payment Window Closed");
        }
      });
    }
  };

  return <div onClick={handleSubmit}>Pay now</div>;

  // return !signature ? (
  //   <LoadingBox />
  // ) : (
  //   <form action="https://sandbox.payfast.co.za​/eng/process" method="post">
  //     {console.log(myData.merchant_id)}
  //     <input type="hidden" name="merchant_id" value={myData["merchant_id"]} />
  //     <input type="hidden" name="merchant_key" value={myData["merchant_key"]} />
  //     <input type="hidden" name="amount" value={myData["amount"]} />
  //     <input type="hidden" name="item_name" value={myData["item_name"]}></input>
  //     <input
  //       type="hidden"
  //       name="name_first"
  //       value={myData["name_first"]}
  //     ></input>
  //     <input type="hidden" name="name_last" value={myData["name_last"]}></input>
  //     <input
  //       type="hidden"
  //       name="email_address"
  //       value={myData["email_address"]}
  //     ></input>
  //     <input
  //       type="hidden"
  //       name="m_payment_id"
  //       value={myData["m_payment_id"]}
  //     ></input>
  //     <input type="hidden" name="return_url" value={myData["return_url"]} />
  //     <input type="hidden" name="cancel_url" value={myData["cancel_url"]} />

  //     <input type="hidden" name="notify_url" value={myData["notify_url"]} />

  //     <Button type="submit">Proceed to payment</Button>
  //   </form>
  // );
}

const generateSignature = (data, passPhrase = null) => {
  // Create parameter string
  let pfOutput = "";
  for (let key in data) {
    if (data.hasOwnProperty(key)) {
      if (data[key] !== "") {
        pfOutput += `${key}=${encodeURIComponent(data[key].trim()).replace(
          /%20/g,
          "+"
        )}&`;
      }
    }
  }

  // Remove last ampersand
  let getString = pfOutput.slice(0, -1);
  if (passPhrase !== null) {
    getString += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(
      /%20/g,
      "+"
    )}`;
  }

  return crypto.createHash("md5").update(getString).digest("hex");
  //   return SHA256(getString).toString(enc.Hex);
};
