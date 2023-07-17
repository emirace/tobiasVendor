import React, { useState } from "react";
import styled from "styled-components";
import {
  faImage,
  faLink,
  faParagraph,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Button = styled.button`
  /* Add your button styles here */
  background-color: #e6e6e6;
  color: #333;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  margin-right: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:hover {
    background-color: #ccc;
  }

  svg {
    margin-right: 8px;
  }
`;

const EditorComponent = () => {
  const [content, setContent] = useState([]);

  const handleAddParagraph = () => {
    const newContent = [...content];
    newContent.push({
      type: "paragraph",
      content: "",
      id: Date.now().toString(),
    });
    setContent(newContent);
  };

  const handleAddLink = () => {
    const newContent = [...content];
    newContent.push({
      type: "link",
      content: "",
      id: Date.now().toString(),
    });
    setContent(newContent);
  };

  const handleAddImage = () => {
    const newContent = [...content];
    newContent.push({
      type: "image",
      content: "",
      id: Date.now().toString(),
    });
    setContent(newContent);
  };

  return (
    <div>
      <Button onClick={handleAddParagraph}>
        <FontAwesomeIcon icon={faParagraph} /> Add Paragraph
      </Button>
      <Button onClick={handleAddLink}>
        <FontAwesomeIcon icon={faLink} /> Add Link
      </Button>
      <Button onClick={handleAddImage}>
        <FontAwesomeIcon icon={faImage} /> Add Image
      </Button>
      {/* Render the content state */}
      <pre>{JSON.stringify(content, null, 2)}</pre>
    </div>
  );
};

export default EditorComponent;
