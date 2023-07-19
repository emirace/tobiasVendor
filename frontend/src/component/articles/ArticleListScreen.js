import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Store } from "../../Store";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getError } from "../../utils";

const Container = styled.div`
  margin: 0 auto;
  padding: 20px;
  max-width: 800px;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
`;

const CreateButton = styled.div`
  display: inline-block;
  padding: 10px 20px;
  background-color: var(--orange-color);
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  font-size: 16px;
  margin-bottom: 20px;
  cursor: pointer;

  &:hover {
    background-color: var(--malon-color);
    color: #fff;
  }
`;

const ArticleItemContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Topic = styled.h3`
  font-size: 20px;
  margin-bottom: 10px;
`;

const Content = styled.p`
  font-size: 16px;
`;

const IconButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: var(--gray-color);
  transition: color 0.3s ease-in-out;

  &:hover {
    color: var(--red-color);
  }

  svg {
    margin-right: 4px;
  }
`;

const ArticleItem = styled.div`
  margin-bottom: 20px;
  cursor: pointer;
`;

const ArticleContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const ArticleListScreen = ({
  switchScreen,
  setTopic,
  setQuestion,
  setEditId,
}) => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [articles, setArticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data } = await axios.get("/api/articles", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        console.log(data);
        setArticles(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchArticles();
  }, [userInfo]);

  const getFirstParagraphContent = (content) => {
    const paragraph = content.find((item) => item.type === "paragraph");
    if (paragraph) {
      return paragraph.content.substring(0, 100);
    }
    return "";
  };

  const handleArticleClick = (articleId) => {
    navigate(`/article/${articleId}`);
  };

  const handleEditClick = (article) => {
    // Handle edit logic
    setEditId(article);
    setTopic(article.topic);
    setQuestion(article.question);
    switchScreen("newtopic");
  };

  const handleDeleteClick = async (articleId) => {
    // Handle delete logic
    const confirmed = window.confirm(
      "Are you sure you want to delete this article?"
    );
    if (confirmed) {
      try {
        await axios.delete(`/api/articles/${articleId}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        ctxDispatch({
          type: "SHOW_TOAST",
          payload: {
            message: "Article deleted Successfully",
            showStatus: true,
            state1: "visible1 success",
          },
        });
        // Remove the deleted article from the state
        setArticles((prevArticles) =>
          prevArticles.filter((article) => article._id !== articleId)
        );
      } catch (error) {
        console.log(error);
        ctxDispatch({
          type: "SHOW_TOAST",
          payload: {
            message: getError(error),
            showStatus: true,
            state1: "visible1 error",
          },
        });
      }
    }
  };

  return (
    <Container>
      <Title>Article List</Title>
      <CreateButton onClick={() => switchScreen("create")}>
        Create New Article
      </CreateButton>
      <ArticleItemContainer>
        {articles.map((article) => (
          <ArticleItem key={article._id}>
            <ArticleContent onClick={() => handleArticleClick(article._id)}>
              <Topic>{article.question}</Topic>
              <Content>{getFirstParagraphContent(article.content)}...</Content>
            </ArticleContent>
            <ButtonGroup>
              <IconButton onClick={(e) => handleEditClick(article, e)}>
                <FaEdit />
                Edit
              </IconButton>
              <IconButton onClick={(e) => handleDeleteClick(article._id, e)}>
                <FaTrash />
                Delete
              </IconButton>
            </ButtonGroup>
          </ArticleItem>
        ))}
      </ArticleItemContainer>
    </Container>
  );
};

export default ArticleListScreen;
