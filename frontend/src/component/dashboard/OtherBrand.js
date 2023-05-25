import { faDotCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Store } from "../../Store";
import axios from "axios";
import { getError } from "../../utils";

const Container = styled.div`
  flex: 4;
  padding: 0 20px;
  margin-bottom: 20px;
`;
const Item = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  margin-right: 20px;
`;
const Label = styled.label`
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
`;
const ListTitle = styled.h3`
  max-width: 300px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  margin: 0;
  text-transform: capitalize;
  margin-bottom: 5px;
  & svg {
    color: var(--malon-color);
    font-size: 8px;
    margin-right: 10px;
  }
`;
const Delete = styled.button`
  border: 0;
  padding: 2px 5px;
  border-radius: 0.2rem;
  font-size: 14px;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "#211111" : "#f8d6d6"};
  color: var(--red-color);
`;
const Edit = styled.button`
  border: 0;
  padding: 2px 5px;
  font-size: 14px;
  margin-right: 10px;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev3)" : "#fcf0e0"};
  color: var(--orange-color);
`;

export default function OtherBrand() {
  const { state } = useContext(Store);
  const { mode, userInfo } = state;
  const [brands, setBrands] = useState([]);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    try {
      const fetchBrand = async () => {
        const { data } = await axios.get("/api/otherbrands", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setBrands(data);
      };
      fetchBrand();
    } catch (err) {
      console.log(getError(err));
    }
  }, [userInfo, refresh]);

  const handleSave = () => {};
  const deleteHandler = () => {};
  return (
    <Container>
      <Item>
        <Label>Categories List</Label>
      </Item>
      {brands.map((c, index) => (
        <ListTitle key={index}>
          <div>
            <FontAwesomeIcon icon={faDotCircle} />
            {c.name}
          </div>
          <div>
            <Edit mode={mode} onClick={() => handleSave(c)}>
              Save
            </Edit>
            <Delete mode={mode} onClick={() => deleteHandler(c)}>
              Delete
            </Delete>
          </div>
        </ListTitle>
      ))}
    </Container>
  );
}
