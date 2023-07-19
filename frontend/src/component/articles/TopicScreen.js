import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
`;

const TopicsList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const TopicItem = styled.h3`
  font-size: 20px;
  margin-bottom: 10px;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 2px 2px 10px -2px grey;
  text-align: center;
  text-transform: capitalize;
  &:hover {
    color: var(--orange-color);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
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
export default function TopicScreen({ switchScreen, setTopic }) {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const { data } = await axios.get('/api/articles/topics');
        setTopics(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTopics();
  }, []);

  const handleClick = (topic) => {
    setTopic(topic);
    switchScreen('newtopic');
  };

  const handleCancel = () => {
    switchScreen('create');
  };

  return (
    <Container>
      <Title>Topics</Title>
      <TopicsList>
        {topics.map((topic) => (
          <TopicItem onClick={() => handleClick(topic)}>{topic}</TopicItem>
        ))}
      </TopicsList>

      <ButtonGroup>
        <CancelButton onClick={handleCancel}>Back</CancelButton>
      </ButtonGroup>
    </Container>
  );
}
