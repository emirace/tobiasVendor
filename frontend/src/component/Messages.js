import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { format } from "timeago.js";
import { getError } from "../utils";

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
  padding: 20px;
  background: var(--malon-color);
  color: #fff;
  border-radius: 10px;
`;
const InlineS = styled.div`
  display: inline-block;
  padding: 20px;
  background: var(--orange-color);
  color: #fff;
  border-radius: 10px;
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
export default function Messages({ message, own, report, product }) {
  const [user, setUser] = useState();
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
      {console.log("in msg", product)}
      {own ? (
        <>
          <SendChat>
            <div>
              <InlineS>
                {message.image && (
                  <img
                    style={{ maxWidth: "150px", display: "block" }}
                    src={message.image}
                    alt="msg"
                  />
                )}
                {message.text}
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
            {message.image && (
              <img
                src={message.image}
                alt="msg"
                style={{ maxWidth: "150px", display: "block" }}
              />
            )}

            <InlineR>{message.text}</InlineR>
            <TimeR>{format(message.createdAt)}</TimeR>
          </div>
        </RecievedChat>
      )}
    </>
  );
}
