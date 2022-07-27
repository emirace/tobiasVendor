import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import SearchBox from "../component/SearchBox";
import { Store } from "../Store";
import { getError } from "../utils";

const Container = styled.div`
  position: fixed;
  top: 0;
  bottom: -55px;
  left: 0;
  right: 0;
  background: ${(props) => (!props.bg ? "#000" : "#fff")};
  z-index: 7;
  overflow: auto;
  padding: 10px;
`;

const Search = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--orange-color);
  margin: 15px 0;
  border-radius: 0.2rem;
  padding: 3px;
  color: #fff;
`;
const Searchcont = styled.div`
  margin-bottom: 15px;
`;

const CateContainer = styled.div`
  & .active {
    height: auto;
  }
`;
const CateTitle = styled.div`
  padding-top: 10px;
  text-transform: capitalize;
  margin-bottom: 20px;
  padding-bottom: 10px;
  padding-left: 10px;
  border: 1px solid rgba(99, 91, 91, 0.2);
  border-radius: 5px;
  position: relative;
  &:before {
    content: "+";
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
  }
`;
const CateItemContainer = styled.div`
  padding-left: 20px;
  overflow: hidden;
  height: 0;
`;
const CateItem = styled.div`
  position: relative;
  margin-bottom: 5px;
  transition: 0.5s;
  text-transform: capitalize;
`;

export default function CategoryMobileScreen() {
  const { state } = useContext(Store);
  const { mode, userInfo } = state;
  const [categories, setCategories] = useState(null);
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
  }, [userInfo]);

  const backMode = (mode) => {
    if (mode === "pagebodydark") {
      mode = false;
    } else {
      mode = true;
    }
    return mode;
  };
  const footerMode = backMode(mode);
  const [display, setDisplay] = useState();

  return (
    <>
      <Container bg={footerMode}>
        <Search>Let's help you find what you are looking for</Search>
        <Searchcont>
          <SearchBox />
        </Searchcont>

        <CateContainer>
          {categories &&
            categories.map((c) => (
              <>
                <CateTitle
                  onClick={() => {
                    display === c.name ? setDisplay("") : setDisplay(c.name);
                  }}
                >
                  {c.name}
                </CateTitle>
                <CateItemContainer
                  className={display === c.name ? "active" : ""}
                >
                  {c.subCategories.length > 0 &&
                    c.subCategories.map((s) => (
                      <Link to="/search">
                        <CateItem>{s.name}</CateItem>
                      </Link>
                    ))}
                </CateItemContainer>
              </>
            ))}
        </CateContainer>
      </Container>
    </>
  );
}
