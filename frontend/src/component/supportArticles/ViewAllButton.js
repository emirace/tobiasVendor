// ViewAllButton.js
import React from "react";
import styled from "styled-components";

const Button = styled.button`
  color: var(--orange-color);
  padding: 5px 0;
  border: none;
  cursor: pointer;
  background: none;
`;

const ViewAllButton = ({ hiddenLinksCount, showAll, onClick }) => {
  return (
    <Button onClick={onClick}>
      {showAll ? "Show Less" : "View All"} ({hiddenLinksCount})
    </Button>
  );
};

export default ViewAllButton;
