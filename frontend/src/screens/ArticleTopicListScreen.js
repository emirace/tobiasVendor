import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { Store } from '../Store';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Title = styled.h1`
  font-size: 45px;
  text-align: center;
  font-weight: bold;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    font-size: 30px;
  }
`;
const SearchBoxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 20px;
  overflow: hidden;
  width: 280px;
`;

const SearchIcon = styled(FontAwesomeIcon)`
  margin: 0 10px;
`;

const SearchBox = styled.input`
  padding: 8px;
  font-size: 14px;
  border: none;
  width: 100%;
  background: none;
  color: ${(props) => (props.mode === 'pagebodylight' ? 'black' : 'white')};

  @media (max-width: 768px) {
    width: auto;
    margin-bottom: 0;
    margin-left: 10px;
  }

  &:focus {
    outline: none;
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

const ArticleItem = styled.div`
  margin-bottom: 10px;
  &:hover {
    h3 {
      color: var(--orange-color);
    }
  }
`;

const Topic = styled.h3`
  font-size: 20px;
  margin-bottom: 10px;
`;

const Content = styled.p`
  font-size: 16px;
`;

export default function ArticleTopicListScreen() {
  const { state } = useContext(Store);
  const { mode } = state;
  const { topic } = useParams();
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data } = await axios.get(`/api/articles/topic/${topic}`);
        setArticles(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchArticles();
  }, [topic]);

  const getFirstParagraphContent = (content) => {
    const paragraph = content.find((item) => item.type === 'paragraph');
    if (paragraph) {
      return paragraph.content.substring(0, 100);
    }
    return '';
  };

  const handleSearch = (e) => {
    var key = e.keyCode || e.which;
    if (key === 13) {
      e.target.blur();
      navigate(`/articles?search=${searchTerm}`);
    }
  };

  return (
    <Container>
      <TopRow>
        <Title>{topic}</Title>
        <SearchBoxContainer>
          <SearchIcon icon={faSearch} />
          <SearchBox
            mode={mode}
            type="search"
            placeholder="Search articles"
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
          />
        </SearchBoxContainer>
      </TopRow>
      <ArticleItemContainer>
        {articles.map((article) => (
          <ArticleItem key={article._id}>
            <Link to={`/article/${article._id}`}>
              <Topic>{article.question}</Topic>
              <Content>{getFirstParagraphContent(article.content)}...</Content>
            </Link>
          </ArticleItem>
        ))}
      </ArticleItemContainer>
    </Container>
  );
}
