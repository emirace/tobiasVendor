import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Store } from "../Store";
import { getError } from "../utils";

const Container = styled.div`
  display: none;
  overflow-x: auto;
  padding: 10px 0;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none;
  }
  @media (max-width: 992px) {
    display: flex;
  }
`;
const Box = styled.div`
  border: 1px solid;
  border-radius: 0.2rem;
  padding: 5px 10px;
  font-weight: bold;
  margin: 10px;
  text-transform: uppercase;
  @media (max-width: 992px) {
    &:hover {
      background: var(--orange-color);
      border-color: var(--orange-color);
    }
  }
`;

// const categories = ["Men", "Women", "Kid", "Parties", "Accessories", "Bags"];
export default function CategoriesLinksButtons() {
  const { state } = useContext(Store);
  const { mode } = state;
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    try {
      const fetchCategories = async () => {
        const { data } = await axios.get("/api/categories");
        setCategories(data);
      };
      fetchCategories();
    } catch (err) {
      console.log(getError(err));
    }
  }, []);

  return (
    <Container mode={mode}>
      {categories?.map((cat) => (
        <Box>{cat.name}</Box>
      ))}
    </Container>
  );
}
