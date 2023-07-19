import React, { useState } from "react";
import styled from "styled-components";
import ArticleListScreen from "../articles/ArticleListScreen";
import CreateScreen from "../articles/CreateScreen";
import NewTopicScreen from "../articles/NewTopicScreen";
import EditorComponent from "../articles/EditorComponent";

const Container = styled.div`
  flex: 4;
  padding: 0 20px;
`;

export default function Articles() {
  const [currentScreen, setCurrentScreen] = useState("list");
  const [topic, setTopic] = useState("");
  const [question, setQuestion] = useState("");
  const [editId, setEditId] = useState(null);

  const switchScreen = (screen) => {
    setCurrentScreen(screen);
  };

  return (
    <Container>
      {currentScreen === "list" && (
        <ArticleListScreen
          switchScreen={switchScreen}
          setTopic={setTopic}
          setQuestion={setQuestion}
          setEditId={setEditId}
        />
      )}
      {currentScreen === "create" && (
        <CreateScreen switchScreen={switchScreen} />
      )}
      {currentScreen === "newtopic" && (
        <NewTopicScreen
          switchScreen={switchScreen}
          topic={topic}
          setTopic={setTopic}
          question={question}
          setQuestion={setQuestion}
          editId={editId}
        />
      )}
      {currentScreen === "new" && (
        <EditorComponent
          switchScreen={switchScreen}
          topic={topic}
          question={question}
          editId={editId}
        />
      )}
    </Container>
  );
}
