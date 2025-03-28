import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { format } from "timeago.js";
import { createHtmlFromObjects, getError } from "../utils";
import MessageImage from "./MessageImage";
import { Link } from "react-router-dom";

const RecievedChat = styled.div`
  display: flex;
  justify-content: start;
  margin-bottom: 15px;
  margin-top: 15px;
`;
const SendChat = styled.div`
  display: flex;
  justify-content: end;
  margin-top: 15px;
`;
const InlineR = styled.div`
  display: inline-block;
  padding: 10px;
  background: var(--malon-color);
  color: #fff;
  border-radius: 0.2rem;
  @media (max-width: 992px) {
    padding: 5px !important;
  }
`;
const InlineS = styled.div`
  display: inline-block;
  padding: 10px;
  background: var(--orange-color);
  color: #fff;
  border-radius: 0.2rem;
  @media (max-width: 992px) {
    padding: 5px !important;
  }
`;
const TimeR = styled.div`
  text-align: left;
  font-size: 13px;
`;
const TimeS = styled.div`
  text-align: right;
  font-size: 13px;
`;
const Reporting = styled.div`
  text-align: right;
`;
export default function Messages({ message, own, report, product, support }) {
  const [user, setUser] = useState();
  console.log(message);
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (report) {
  //       try {
  //         const { data: dataUser } = await axios.get(
  //           `/api/users/seller/${message.reportedUser}`
  //         );
  //         setUser(dataUser);
  //       } catch (err) {
  //         console.log(getError(err));
  //       }
  //     }
  //   };
  //   fetchData();
  // }, [message, report]);
  return (
    <>
      {own ? (
        <>
          <SendChat>
            <div>
              <InlineS style={{ padding: support ? "10px" : "20px" }}>
                {message.type === "email" ? (
                  createHtmlFromObjects(message.emailMessages)
                ) : (
                  <div>
                    {message.image && <MessageImage url={message.image} />}
                    {message.text}
                  </div>
                )}
              </InlineS>
              <TimeS>{format(message.createdAt)}</TimeS>
            </div>
          </SendChat>
          {/* {report && user && !message.admin && (
            <Reporting>Reporting: {product ? product : user.name}</Reporting>
          )} */}
        </>
      ) : (
        <RecievedChat>
          <div>
            <InlineR style={{ padding: support ? "10px" : "20px" }}>
              {message.type === "email" ? (
                createHtmlFromObjects(message.emailMessages)
              ) : (
                <div>
                  {message.image && <MessageImage url={message.image} />}
                  {message.text}
                </div>
              )}
            </InlineR>
            <TimeR>{format(message.createdAt)}</TimeR>
          </div>
        </RecievedChat>
      )}
    </>
  );
}
