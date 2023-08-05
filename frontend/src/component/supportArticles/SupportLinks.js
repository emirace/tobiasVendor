// SupportLinks.js
import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import ViewAllButton from "./ViewAllButton";

const LinksList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const LinkItem = styled.li`
  margin-bottom: 5px;
  color: gray;
  &:hover {
    color: var(--orange-color);
  }
`;

const SupportLinks = ({ links }) => {
  const [showAll, setShowAll] = useState(false);

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const hiddenLinksCount = links.length - 5;

  return (
    <>
      <LinksList>
        {showAll
          ? links.map((link, index) => (
              <LinkItem key={index}>
                <Link to={link.url}>{link.displayName}</Link>
              </LinkItem>
            ))
          : links.slice(0, 5).map((link, index) => (
              <LinkItem key={index}>
                <Link to={link.url}>{link.displayName}</Link>
              </LinkItem>
            ))}
      </LinksList>
      {links.length > 5 && (
        <ViewAllButton
          hiddenLinksCount={hiddenLinksCount}
          showAll={showAll}
          onClick={toggleShowAll}
        />
      )}
    </>
  );
};

export default SupportLinks;
