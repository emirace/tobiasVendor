import React from "react";
import styled from "styled-components";

const DropdownWrapper = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 5px;
  z-index: 10;
`;

const ResultItem = styled.div`
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const SearchDropdown = ({ results, onItemClick }) => {
  if (!results || results.length === 0) {
    return null;
  }

  return (
    <DropdownWrapper>
      {results.map((result, index) => (
        <ResultItem key={index} onClick={() => onItemClick(result)}>
          {result.displayName}
        </ResultItem>
      ))}
    </DropdownWrapper>
  );
};

export default SearchDropdown;
