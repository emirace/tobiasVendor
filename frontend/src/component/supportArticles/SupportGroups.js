// SupportGroups.js
import React from "react";
import styled from "styled-components";
import SupportLinks from "./SupportLinks";

const SupportGroupsWrapper = styled.div`
  max-width: 1200px;
  margin: 20px auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 0 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const GroupHeader = styled.h2`
  font-size: 20px;
  margin-bottom: 10px;
`;

const SupportGroups = ({ supportLinksData }) => {
  return (
    <SupportGroupsWrapper>
      {supportLinksData.map((group, index) => (
        <div key={index}>
          <GroupHeader>{group.header}</GroupHeader>
          <SupportLinks links={group.links} />
        </div>
      ))}
    </SupportGroupsWrapper>
  );
};

export default SupportGroups;
