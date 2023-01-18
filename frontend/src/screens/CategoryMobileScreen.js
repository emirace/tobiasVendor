import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  bottom: 0;
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
  flex-shrink: 0;
  overflow: auto;
  padding-bottom: 50px;
`;
const Sidebaritem = styled.div`
  padding: 0.75em 1em;
  display: block;
  transition: background-color 0.15s;
  border-radius: 5px;
  &.open > .sidebar-title svg {
    transform: rotate(180deg);
  }
  &.open > .sidebar-content {
    height: auto;
  }
  &:hover {
    background-color: #eb9f4015;
  }
`;
const SidebarTitle = styled.div`
  display: flex;
  font-size: 1em;
  text-transform: capitalize;
  justify-content: space-between;
  & svg {
    transition: transform 0.3s;
  }
`;
const SidebarContent = styled.div`
  padding-top: 0.25em;
  height: 0;
  overflow: hidden;
`;
const SidebarItemPlain = styled.div`
  font-size: 1em;
  text-transform: capitalize;
  padding: 0.75em 1em;
  & a {
    font-weight: 500;
  }
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
            categories.map((item, index) => (
              <SidebarItem key={index} item={item} />
            ))}
        </CateContainer>
        <div style={{ height: "55px", width: "100%" }} />
      </Container>
    </>
  );
}

const SidebarItem = ({ item }) => {
  const [open, setOpen] = useState(false);

  if (item?.subCategories?.length > 0 || item?.items?.length > 0) {
    return (
      <Sidebaritem className={open ? "sidebar-item open" : "sidebar-item"}>
        <SidebarTitle className="sidebar-title" onClick={() => setOpen(!open)}>
          <span>{item.name}</span>
          <FontAwesomeIcon icon={faChevronDown} />
        </SidebarTitle>
        {item?.subCategories?.length > 0 && (
          <SidebarContent className="sidebar-content">
            {item.subCategories.map((child, index) => (
              <SidebarItem key={index} item={child} />
            ))}
          </SidebarContent>
        )}
        {item?.items?.length > 0 && (
          <SidebarContent className="sidebar-content">
            {item.items.map((child, index) => (
              <SidebarItemPlain key={index}>
                <Link to={`/search?query=${child}`}> {child}</Link>
              </SidebarItemPlain>
            ))}
          </SidebarContent>
        )}
      </Sidebaritem>
    );
  } else {
    return (
      <SidebarItemPlain>
        <Link to={`/search?query=${item.name}`}> {item.name}</Link>
      </SidebarItemPlain>
    );
  }
};
