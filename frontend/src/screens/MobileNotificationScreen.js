import moment from "moment";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { socket } from "../App";
import { Badge } from "../component/Navbar";
import { Store } from "../Store";

const Container = styled.div``;
const NotificationMenu = styled.div`
  padding: 10px;
  max-height: 100vh;
  overflow-y: auto;
  background: ${(props) => (props.mode === "pagebodydark" ? "black" : "white")};
`;
const Title = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
  color: ${(props) => (props.mode === "pagebodydark" ? "white" : "black")};
`;
const NotItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  position: relative;
  padding: 3px;
  &:hover {
    background: ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  }
`;
const NotImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;
const NotDetail = styled.div`
  font-size: 14px;
  margin-left: 5px;
`;
const NotText = styled.div`
  color: ${(props) => (props.mode === "pagebodydark" ? "white" : "black")};
`;
const Time = styled.div`
  color: var(--orange-color);
`;
export default function MobileNotificationScreen() {
  const { state } = useContext(Store);
  const { mode, notifications } = state;
  const navigate = useNavigate();

  const handleOnClick = (not) => {
    console.log("not", not);
    socket.emit("remove_id_notifications", not._id);
    navigate(not.link);
  };
  return (
    <Container>
      <NotificationMenu mode={mode}>
        <Title mode={mode}>Notifications</Title>
        {notifications.length < 0 ? (
          <b>No Notification</b>
        ) : (
          notifications.map((not) => (
            <NotItem
              mode={mode}
              key={not._id}
              onClick={() => handleOnClick(not)}
            >
              <NotImage src={not.userImage} alt="img" />
              <NotDetail>
                <NotText mode={mode}>{not.msg}</NotText>
                <Time>{moment(not.createdAt).fromNow()}</Time>
              </NotDetail>
              {!not.read && (
                <Badge
                  style={{
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                />
              )}
            </NotItem>
          ))
        )}
      </NotificationMenu>
    </Container>
  );
}
