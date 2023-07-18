import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Link } from "react-router-dom";
import { Store } from "../Store";

const Container = styled.div``;

const Hero = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 80px;
  padding-bottom: 80px;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev2)"};

  @media (max-width: 768px) {
    padding-top: 40px;
    padding-bottom: 40px;
  }
`;

const HeroText = styled.h1`
  font-size: 60px;
  margin-bottom: 20px;
  font-weight: bold;
  @media (max-width: 768px) {
    font-size: 30px;
  }
`;

const SearchInput = styled.input`
  padding: 10px;
  font-size: 16px;
  width: 100%;
  max-width: 650px;
  border: 1px solid #ddd;
  border-radius: 30px;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    max-width: 300px;
  }
  &:focus {
    outline: none;
    border-color: var(--orange-color);
  }
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 30px;
  text-align: center;
  font-weight: bold;
`;

const ArticleItem = styled.div`
  margin-bottom: 20px;
`;

const Topic = styled.h3`
  font-size: 20px;
  margin-bottom: 10px;
`;

const Content = styled.p`
  font-size: 16px;
`;

const TopicsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const TopicItem = styled.li`
  font-size: 16px;
  margin-bottom: 10px;

  a {
    color: #007bff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;
const Section = styled.div`
  margin: 0 auto;
  max-width: 800px;
  padding: 20px;
`;

const ArticleItemContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ArticleListScreen = () => {
  const { state } = useContext(Store);
  const { mode } = state;
  const [articles, setArticles] = useState([]);
  const [topics, setTopics] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data } = await axios.get("/api/articles");
        setArticles(data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchTopics = async () => {
      try {
        const { data } = await axios.get("/api/articles/topics");
        setTopics(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchArticles();
    fetchTopics();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredArticles = articles.filter((article) =>
    article.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFirstParagraphContent = (content) => {
    const paragraph = content.find((item) => item.type === "paragraph");
    if (paragraph) {
      return paragraph.content.substring(0, 100);
    }
    return "";
  };

  return (
    <Container>
      <Hero mode={mode}>
        <HeroText>How can we help?</HeroText>
        <SearchInput
          type="text"
          placeholder="Search articles by topic"
          value={searchTerm}
          onChange={handleSearch}
        />
      </Hero>
      <Section>
        <SectionTitle>Popular Questions</SectionTitle>
        <ArticleItemContainer>
          {filteredArticles.map((article) => (
            <ArticleItem key={article._id}>
              <Link to={`/articles/${article._id}`}>
                <Topic>{article.question}</Topic>
                <Content>
                  {getFirstParagraphContent(article.content)}...
                </Content>
              </Link>
            </ArticleItem>
          ))}
        </ArticleItemContainer>
        <SectionTitle>All Topics</SectionTitle>
        <TopicsList>
          {topics.map((topic) => (
            <TopicItem key={topic}>
              <Link to={`/topics/${topic}`}>{topic}</Link>
            </TopicItem>
          ))}
        </TopicsList>
      </Section>
    </Container>
  );
};

export default ArticleListScreen;
