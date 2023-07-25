// MessageListb.js
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import ContactMessageDetail from "./ContactMessageDetail";
import axios from "axios";
import { Store } from "../../Store";
import LoadingBox from "../LoadingBox";
import ModelLogin from "../ModelLogin";

const Container = styled.div`
  flex: 4;
  padding: 0 20px;
`;

const Title = styled.h1``;

const MessageContainer = styled.div`
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
`;

const ViewButton = styled.button`
  background-color: var(--orange-color);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
`;
const PaginationButtons = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const PaginationButton = styled.button`
  background-color: ${(props) =>
    props.disabled ? "gray" : "var(--orange-color)"};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: ${(props) => (props.disabled ? "default" : "pointer")};
  margin: 0 5px;

  &:hover {
    background-color: ${(props) =>
      props.disabled ? "gray" : "var(--orange-dark-color)"};
  }
`;

const ContactUs = () => {
  const { state } = useContext(Store);
  const { userInfo, mode } = state;
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showModel, setShowModel] = useState(false);
  const [loading, setLoading] = useState(true);

  const messagesPerPage = 5; // You can adjust this number according to your preference.
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = messages.slice(
    indexOfFirstMessage,
    indexOfLastMessage
  );

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const canGoPrev = currentPage > 1;
  const canGoNext = indexOfLastMessage < messages.length;

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get("/api/contacts", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setMessages(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchMessage();
  }, []);

  const handleViewDetails = (message) => {
    setSelectedMessage(message);
    setShowModel(true);
  };

  return (
    <Container>
      <Title>Contact Us</Title>
      {loading ? (
        <LoadingBox />
      ) : (
        <>
          {currentMessages.map((message, index) => (
            <MessageContainer mode={mode} key={index}>
              <p>Name: {message.name}</p>
              <p>Email: {message.email}</p>
              <p>Category: {message.category}</p>
              <p>Subject: {message.subject}</p>
              <ViewButton onClick={() => handleViewDetails(message)}>
                View
              </ViewButton>
            </MessageContainer>
          ))}
          <PaginationButtons>
            <PaginationButton onClick={handlePrevPage} disabled={!canGoPrev}>
              Prev
            </PaginationButton>
            <PaginationButton onClick={handleNextPage} disabled={!canGoNext}>
              Next
            </PaginationButton>
          </PaginationButtons>
          <ModelLogin setShowModel={setShowModel} showModel={showModel}>
            <ContactMessageDetail message={selectedMessage} />
          </ModelLogin>
        </>
      )}
    </Container>
  );
};

export default ContactUs;
