import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
`;

const Instructions = styled.p`
  font-size: 18px;
  margin-bottom: 20px;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const OptionButton = styled.button`
  position: relative;
  padding: 10px 20px;
  font-size: 16px;
  margin: 0 10px;
  background-color: ${({ selected }) =>
    selected ? "var(--malon-color)" : "#fff"};
  color: ${({ selected }) => (selected ? "#fff" : "var(--malon-color)")};
  border: 1px solid var(--malon-color);
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: var(--malon-color);
    color: #fff;
  }
`;

const OptionLabel = styled.div`
  font-weight: bold;
`;

const OptionDescription = styled.div`
  font-size: 14px;
  color: #888;
  margin-top: 4px;
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

const CancelButton = styled.button`
  padding: 10px 20px;
  font-size: 16px;
  background-color: #fff;
  color: var(--malon-color);
  border: 1px solid var(--malon-color);
  border-radius: 4px;
  cursor: pointer;
`;

const options = [
  {
    value: "new",
    label: "Create from New Topic",
    description: "Create a new article based on a completely new topic.",
    details:
      "Start from scratch and create an article on a topic that does not exist in the system.",
  },
  {
    value: "existing",
    label: "Create from Existing Topic",
    description: "Create a new article based on an existing topic.",
    details:
      "Choose a topic that already exists in the system and create an article related to it.",
  },
];

const CreateScreen = ({ switchScreen }) => {
  const [createOption, setCreateOption] = useState("");

  const handleOptionSelect = (option) => {
    setCreateOption(option);
  };

  const handleContinue = () => {
    if (createOption === "new") {
      switchScreen("newtopic");
    } else if (createOption === "existing") {
      switchScreen("selecttopic");
    }
  };

  const handleCancel = () => {
    switchScreen("list");
  };

  const renderOptionDetails = (option) => {
    return (
      <OptionDescription>
        <div>{option.description}</div>
        <div>{option.details}</div>
      </OptionDescription>
    );
  };

  return (
    <Container>
      <Title>Create Article</Title>
      <Instructions>Select an option to create the article:</Instructions>
      <ButtonGroup>
        {options.map((option) => (
          <OptionButton
            key={option.value}
            selected={createOption === option.value}
            onClick={() => handleOptionSelect(option.value)}
          >
            <OptionLabel>{option.label}</OptionLabel>
            {renderOptionDetails(option)}
          </OptionButton>
        ))}
      </ButtonGroup>
      <div>
        <CreateButton disabled={!createOption} onClick={handleContinue}>
          Continue
        </CreateButton>
        <CancelButton onClick={handleCancel}>Cancel</CancelButton>
      </div>
    </Container>
  );
};

export default CreateScreen;
