// SupportArticles.js
import React from "react";
import styled from "styled-components";
import HeroHeader from "../component/supportArticles/HeroHeader";
import SupportGroups from "../component/supportArticles/SupportGroups";

const SupportArticlesWrapper = styled.div``;

// Assuming you have the support links data in an array like this:
export const supportLinksData = [
  {
    header: "BUYER'S KITS",
    links: [
      { displayName: "Buyer's Guide", url: "/buyersguide" },
      { displayName: "Re:Bundle", url: "/rebundle" },
      { displayName: "Re:Buindle Simplified", url: "/link3" },
      { displayName: "How to log a return", url: "/link3" },
      { displayName: "Product Condition", url: "/link3" },
      // Add more links here
    ],
  },
  {
    header: "SELLER'S KITS",
    links: [
      { displayName: "Commission Fee Structure", url: "/link1" },
      { displayName: "Product Condition", url: "/link2" },
      // Add more links here
    ],
  },
  {
    header: "SAFETY KITS",
    links: [
      { displayName: "Buyers & sellers Protection", url: "/link1" },
      // Add more links here
    ],
  },
  {
    header: "LEGAL STUFF",
    links: [
      { displayName: "Terms of use", url: "/terms" },
      { displayName: "Privacy Policy", url: "/privacypolicy" },
      { displayName: "Cookies Policy", url: "/link3" },
      { displayName: "Return & Refund", url: "/returns" },
      // Add more links here
    ],
  },
  // Add more groups here
];

const SupportArticles = () => {
  return (
    <SupportArticlesWrapper>
      <HeroHeader />
      <SupportGroups supportLinksData={supportLinksData} />
    </SupportArticlesWrapper>
  );
};

export default SupportArticles;
