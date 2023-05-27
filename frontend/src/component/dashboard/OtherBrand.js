import {
  faCheck,
  faDotCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
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
const Save = styled.button`
  border: 0;
  padding: 2px 5px;
  font-size: 14px;
  margin-right: 10px;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev3)" : "#fcf0e0"};
  color: var(--orange-color);
`;
const Edit = styled.button`
  border: 0;
  padding: 2px 5px;
  font-size: 14px;
  margin-right: 10px;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev3)" : "#fcf0e0"};
  color: grey;
`;
const TextInput = styled.input`
  border: none;
  width: 250px;
  height: 30px;
  border: 1px solid
    ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev3)" : "var(--light-ev3)"};
  background: none;
  padding-left: 10px;
  color: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--white-color)"
      : "var(--black-color)"};
  &:focus {
    outline: none;
    border: 1px solid var(--orange-color);
  }
  &::placeholder {
    font-size: 12px;
  }
`;

export default function OtherBrand() {
  const { state } = useContext(Store);
  const { userInfo } = state;
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

  return (
    <Container>
      <Item>
        <Label>Brand List</Label>
      </Item>
      {brands.map((c, index) => (
        <OtherBrandRow
          key={index}
          brand={c}
          setRefresh={setRefresh}
          refresh={refresh}
        />
      ))}
    </Container>
  );
}

const OtherBrandRow = ({ brand, setRefresh, refresh }) => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo } = state;
  const [newName, setNewName] = useState(brand.name);
  const [isEdit, setIsEdit] = useState(false);
  console.log(brand);

  const handleEdit = () => {
    setIsEdit(true);
  };
  const handleEditClose = () => {
    setIsEdit(false);
  };

  const handleSubmit = async () => {
    try {
      await axios.put(
        `/api/otherbrands/${brand._id}`,
        { name: newName },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      setRefresh(!refresh);
      setIsEdit(false);
    } catch (err) {
      console.log(err);
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: getError(err),
          showStatus: true,
          state1: "visible1 error",
        },
      });
    }
  };

  const handleSave = async () => {
    try {
      if (brand.isAdded) {
        ctxDispatch({
          type: "SHOW_TOAST",
          payload: {
            message: "Brand name already added to brand list",
            showStatus: true,
            state1: "visible1 error",
          },
        });
        return;
      }
      await axios.put(
        `/api/otherbrands/save/${brand._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      setRefresh(!refresh);
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Brand name added to brand list",
          showStatus: true,
          state1: "visible1 success",
        },
      });
    } catch (err) {
      console.log(err);
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: getError(err),
          showStatus: true,
          state1: "visible1 error",
        },
      });
    }
  };

  const deleteHandler = async () => {
    const confirm = window.confirm(
      `Are you sure you want to delete ${brand.name} brand, this cannot be undo`
    );
    if (!confirm) {
      return;
    }
    try {
      await axios.delete(`/api/otherbrands/${brand._id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Categories deleted",
          showStatus: true,
          state1: "visible1 success",
        },
      });
      setRefresh(!refresh);
    } catch (err) {
      console.log(getError(err));
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: getError(err),
          showStatus: true,
          state1: "visible1 error",
        },
      });
    }
  };
  return (
    <ListTitle>
      {isEdit ? (
        <>
          <TextInput
            mode={mode}
            name="brand"
            type="text"
            onChange={(e) => setNewName(e.target.value)}
            value={newName}
          />
          <FontAwesomeIcon
            style={{ fontSize: "20px", marginLeft: "10px", cursor: "pointer" }}
            icon={faTimes}
            onClick={handleEditClose}
          />
          <FontAwesomeIcon
            style={{
              fontSize: "20px",
              color: "var(--orange-color)",
              marginLeft: "10px",
              cursor: "pointer",
            }}
            icon={faCheck}
            onClick={handleSubmit}
          />
        </>
      ) : (
        <>
          <div style={{ display: "flex", alignItems: "center" }}>
            <FontAwesomeIcon icon={faDotCircle} />
            <div
              style={
                brand.isAdded
                  ? {
                      color: "gray",
                      textDecoration: "line-through",
                    }
                  : {}
              }
            >
              {brand.name}
            </div>
          </div>
          <div>
            <Edit mode={mode} onClick={handleEdit}>
              Edit
            </Edit>
            <Save mode={mode} onClick={handleSave}>
              Save
            </Save>
            <Delete mode={mode} onClick={deleteHandler}>
              Delete
            </Delete>
          </div>{" "}
        </>
      )}
    </ListTitle>
  );
};
