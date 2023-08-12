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
      { displayName: "Re:Bundle Simplified", url: "/RebundleSimplify" },
      { displayName: "How to log a return", url: "/howtologreturn" },
      { displayName: "Product Condition", url: "/condition" },
      // Add more links here
    ],
  },
  {
    header: "SELLER'S KITS",
    links: [
      { displayName: "Commission Fee Structure", url: "/feestructure" },
      { displayName: "Product Condition", url: "/condition" },
      // Add more links here
    ],
  },
  {
    header: "SAFETY KITS",
    links: [
      { displayName: "Buyers & sellers Protection", url: "/buyerprotection" },
      // Add more links here
    ],
  },
  {
    header: "LEGAL STUFF",
    links: [
      { displayName: "Terms of use", url: "/terms" },
      { displayName: "Privacy Policy", url: "/privacypolicy" },
      { displayName: "Cookies Policy", url: "/privacypolicy?cookies" },
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
