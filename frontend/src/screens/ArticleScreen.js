import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import LoadingBox from '../component/LoadingBox';
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

const Breadcrumbs = styled.div`
  font-size: 14px;
  margin-bottom: 10px;

  a {
    color: var(--orange-color);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
  @media (max-width: 768px) {
    width: 100%;
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

const Content = styled.div`
  font-size: 16px;
  line-height: 1.5;
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
    margin-bottom: 10px;
  }

  a {
    color: var(--orange-color);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
  img {
    max-width: 70%;
    margin-bottom: 10px;
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

const ArticleScreen = () => {
  const { state } = useContext(Store);
  const { mode } = state;
  const { id: articleId } = useParams();
  const [article, setArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const { data } = await axios.get(`/api/articles/${articleId}`);
        setArticle(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchArticle();
  }, [articleId]);

  if (!article) {
    return <LoadingBox />;
  }

  const renderContent = () => {
    let renderedContent = [];
    let isLinkCombined = false;

    for (let i = 0; i < article.content.length; i++) {
      const item = article.content[i];
      console.log(item);

      if (item.type === 'paragraph') {
        if (isLinkCombined) {
          // If the link was combined with the previous paragraph, skip this paragraph
          isLinkCombined = false;
          continue;
        }
        renderedContent.push(<p key={i}>{item.content}</p>);
      } else if (item.type === 'link') {
        let linkContent = item.content;
        // Check if the previous item and next item are paragraphs
        const prevItem = article.content[i - 1];
        const nextItem = article.content[i + 1];
        if (
          prevItem &&
          prevItem.type === 'paragraph' &&
          nextItem &&
          nextItem.type === 'paragraph'
        ) {
          isLinkCombined = true;
          // Add the link content within the previous paragraph
          renderedContent[renderedContent.length - 1] = (
            <p key={i}>
              {prevItem.content}{' '}
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {linkContent}
              </a>{' '}
              {nextItem.content}
            </p>
          );
        } else if (
          prevItem &&
          prevItem.type === 'paragraph' &&
          nextItem &&
          nextItem.type !== 'paragraph'
        ) {
          // Add the link content within the previous paragraph
          renderedContent[renderedContent.length - 1] = (
            <p key={i}>
              {prevItem.content}{' '}
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {linkContent}
              </a>{' '}
              {/* {nextItem ? nextItem.content : ""} */}
            </p>
          );
        } else {
          // Render the link as a separate paragraph
          renderedContent.push(
            <p key={i}>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {linkContent}
              </a>
            </p>
          );
        }
      } else if (item.type === 'image') {
        renderedContent.push(<img key={i} src={item.content} alt={item.id} />);
      }
    }

    return renderedContent;
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
        <Breadcrumbs>
          <Link to="/">Home</Link> / <Link to="/articles">Articles</Link> /{' '}
          {article.topic}
        </Breadcrumbs>
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
      <Title>{article.question}</Title>
      <Content>{renderContent()}</Content>
    </Container>
  );
};

export default ArticleScreen;
