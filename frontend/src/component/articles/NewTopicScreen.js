import React, { useContext, useState } from "react";
import styled from "styled-components";
import { Store } from "../../Store";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 16px;
  margin-bottom: 8px;
`;

const Input = styled.input`
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 12px;
  transition: border-color 0.3s ease-in-out;

  &:focus {
    outline: none;
    border-color: var(--orange-color);
    box-shadow: 0 0 0 2px var(--orange-color);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CreateButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: var(--orange-color);
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 20px;

  &:hover {
    background-color: var(--malon-color);
  }
`;

const CancelButton = styled.div`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #fff;
  color: var(--malon-color);
  border: 1px solid var(--malon-color);
  border-radius: 4px;
  cursor: pointer;
`;

const NewTopicScreen = ({
  switchScreen,
  topic,
  setTopic,
  question,
  setQuestion,
  editId,
  setEditId,
}) => {
  const { dispatch: ctxDispatch } = useContext(Store);
  const handleTitleChange = (e) => {
    setTopic(e.target.value);
  };

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!topic || !question) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Fill all fields",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    // Save the new topic and perform necessary actions
    // Redirect to the desired screen
    switchScreen("new");
  };

  const handleCancel = () => {
    if (editId) {
      setTopic("");
      setQuestion("");
      setEditId(null);
      switchScreen("list");
    } else {
      switchScreen("create");
    }
  };

  return (
    <Container>
      <Title>Create Article</Title>
      <Form onSubmit={handleSubmit}>
        <Label>Topic</Label>
        <Input
          type="text"
          value={topic}
          onChange={handleTitleChange}
          placeholder="Enter the topic this article belongs to"
        />
        <Label>Question</Label>
        <Input
          type="text"
          value={question}
          onChange={handleQuestionChange}
          placeholder="Enter the question you are about to answer"
        />
        <ButtonGroup>
          <CreateButton type="submit">Continue</CreateButton>
          <CancelButton onClick={handleCancel}>Back</CancelButton>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

export default NewTopicScreen;
