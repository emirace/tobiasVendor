// HeroHeader.js (updated)
import React, { useState } from "react";
import styled from "styled-components";
import SearchDropdown from "./SearchDropdown";
import { supportLinksData } from "../../screens/SupportArticles";

const HeroHeaderWrapper = styled.div`
  position: relative;
  background-color: #f0f0f0;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const Title = styled.h2`
  font-size: 20px;
  margin-bottom: 10px;
`;

const SearchInput = styled.input`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  max-width: 650px;
  width: 100%;
  @media (max-width: 768px) {
    max-width: 300px;
  }
  &:focus {
    outline: none;
    border-color: var(--orange-color);
  }
`;

const HeroHeader = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Perform the search here based on the query
    const results = supportLinksData.flatMap((group) =>
      group.links.filter((link) =>
        link.displayName.toLowerCase().includes(query.toLowerCase())
      )
    );

    setSearchResults(results);
  };

  const handleItemClick = (result) => {
    // Do something when a search result is clicked, like navigating to the link
    console.log("Clicked:", result);
  };

  return (
    <HeroHeaderWrapper>
      <Title>Support Articles</Title>
      <SearchInput
        type="text"
        placeholder="Search support articles"
        value={searchQuery}
        onChange={handleSearch}
      />
      {searchQuery && (
        <SearchDropdown results={searchResults} onItemClick={handleItemClick} />
      )}
    </HeroHeaderWrapper>
  );
};

export default HeroHeader;
