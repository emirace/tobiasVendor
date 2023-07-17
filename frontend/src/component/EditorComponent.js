import React, { useState } from "react";

export default function EditorComponent() {
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
      <button onClick={handleAddParagraph}>Add Paragraph</button>
      <button onClick={handleAddLink}>Add Link</button>
      <button onClick={handleAddImage}>Add Image</button>
      {/* Render the content state */}
      <pre>{JSON.stringify(content, null, 2)}</pre>
    </div>
  );
}
