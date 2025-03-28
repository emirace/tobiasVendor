import {
  faDotCircle,
  faLink,
  faPen,
  faPlus,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Store } from "../../Store";
import { compressImageUpload, getError } from "../../utils";
import LoadingBox from "../LoadingBox";

const Container = styled.div`
  flex: 4;
  padding: 0 20px;
  margin-bottom: 20px;
`;
const Title = styled.h1``;
const Left = styled.div`
  border-radius: 0.2rem;
  flex: 1;
  padding: 20px;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  & .icon {
    margin-left: 10px;
  }
`;
const Right = styled.div`
  border-radius: 0.2rem;
  flex: 1;
  padding: 20px;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
`;
const Content = styled.div`
  display: flex;
  gap: 20px;
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;
const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
`;
const Item = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  margin-right: 20px;
  padding: 10px;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev2)"};
`;
const Label = styled.label`
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
`;
const Input = styled.input`
  background: none;
  color: ${(props) =>
    props.mode === "pagebodydark" ? "var(--white-color)" : "var(--dark-color)"};
  border: 1px solid
    ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev3)" : "var(--light-ev3)"};
  border-radius: 0.2rem;
  height: 40px;
  padding: 10px;
  &:focus-visible {
    outline: 1px solid var(--orange-color);
  }
`;
const Textarea = styled.textarea`
  background: none;
  color: ${(props) =>
    props.mode === "pagebodydark" ? "var(--white-color)" : "var(--dark-color)"};
  border: 1px solid
    ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev3)" : "var(--light-ev3)"};
  border-radius: 0.2rem;
  width: 80%;
  height: 80px;
  padding: 10px;
  &:focus-visible {
    outline: 1px solid var(--orange-color);
  }
`;

const Button = styled.button`
  width: 200px;
  border: none;
  background: var(--orange-color);
  color: var(--white-color);
  padding: 5px 10px;
  border-radius: 0.2rem;
  cursor: pointer;
  margin: 10px 0;
  &.add {
    margin-top: 0;
    width: 80px;
    background: ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev3)" : "#fcf0e0"};
    color: var(--orange-color);
  }
`;
const ItemCont = styled.div`
  padding: 0 10px;
  border-radius: 0.2rem;
  margin-bottom: 5px;
  cursor: pointer;
  background: ${(props) =>
    props.selected
      ? props.mode === "pagebodydark"
        ? "var(--dark-ev3)"
        : "#fcf0e0"
      : ""};

  border: ${(props) => (props.selected ? "1px solid var(--orange-color)" : "")};
`;
const InputCont = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const InputContIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;
const CatList = styled.div`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  margin: 5px;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev2)"};
`;
const SubCat = styled.div`
  display: flex;
  align-items: center;
  & svg {
    margin-left: 5px;
    font-size: 13px;
    cursor: pointer;
  }
`;

const SubCont = styled.div`
  display: flex;
  flex-wrap: wrap;
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
const UploadImage = styled.label`
  border: 1px solid var(--malon-color);
  padding: 2px 5px;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
  margin-top: 5px;
  border-radius: 0.2rem;
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  position: relative;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 18px;
  cursor: pointer;
`;

const Form1 = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Path = styled.div`
  font-size: 10px;
  font-style: italic;
  margin-top: -5px;
`;

const Checkbox = styled.input`
  /* margin-bottom: 10px; */
  margin-right: 10px;
  cursor: pointer;
  &::after {
    width: 15px;
    height: 15px;
    content: "";
    display: inline-block;
    visibility: visible;
    position: relative;
    top: -2px;
    left: -1px;
    background-color: ${(props) =>
      props.mode === "pagebodydark"
        ? "var(--black-color)"
        : "var(--white-color)"};
    border: 1px solid var(--orange-color);
  }
  &:checked::after {
    width: 15px;
    height: 15px;
    content: "";
    display: inline-block;
    visibility: visible;
    position: relative;
    top: -2px;
    left: -1px;
    background-color: var(--orange-color);
    border: 1px solid var(--malon-color);
  }
`;
export default function Categories() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo } = state;

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState({
    name: "",
    isCategory: true,
    path: "",
  });
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubcategoryIndex, setSelectedSubcategoryIndex] =
    useState(null);
  const [itemIndex, setItemIndex] = useState(null);
  const [editCat, setEditCat] = useState(false);
  const [editCurrentCat, setEditCurrentCat] = useState(null);

  const [refresh, setrefresh] = useState(false);

  const handleCategoryNameChange = (name, value) => {
    setCategory((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryPathChange = (name, isCategory, path) => {
    const newCategory = {
      name,
      isCategory,
      path,
    };
    setCategory(newCategory);
  };

  const handleAddSubcategory = (name, isCategory, path) => {
    const newSubcategory = {
      name,
      isCategory,
      path,
    };
    setSubCategories([...subCategories, newSubcategory]);
  };

  const handleAddItem = (subcategoryIndex, name, isCategory, path) => {
    const newSubCategories = subCategories.map((subcategory, index) => {
      if (index === subcategoryIndex) {
        const updatedItems = [
          ...(subcategory.items || []),
          { name, isCategory, path },
        ];

        return {
          ...subcategory,
          items: updatedItems,
        };
      }
      return subcategory;
    });

    setSubCategories(newSubCategories);
  };

  const handleSubcategoryChange = (index, name, isCategory, path) => {
    const updatedSubCategories = [...subCategories];
    updatedSubCategories[index].name = name;
    updatedSubCategories[index].isCategory = isCategory;
    updatedSubCategories[index].path = path;
    setSubCategories(updatedSubCategories);
  };

  const handleDeleteSubcategory = (subcategoryIndex) => {
    const newSubCategories = subCategories.filter(
      (_, index) => index !== subcategoryIndex
    );
    setSubCategories(newSubCategories);
  };

  const handleItemChange = (
    subcategoryIndex,
    itemIndex,
    name,
    isCategory,
    path
  ) => {
    console.log(name, isCategory, path);
    const updatedSubCategories = [...subCategories];
    updatedSubCategories[subcategoryIndex].items[itemIndex].name = name;
    updatedSubCategories[subcategoryIndex].items[itemIndex].isCategory =
      isCategory;
    updatedSubCategories[subcategoryIndex].items[itemIndex].path = path;
    setSubCategories(updatedSubCategories);
  };

  const handleDeleteItem = (subcategoryIndex, itemIndex) => {
    const newSubCategories = subCategories.map((subcategory, index) => {
      if (index === subcategoryIndex) {
        const updatedItems = subcategory.items.filter(
          (item, idx) => idx !== itemIndex
        );

        return {
          ...subcategory,
          items: updatedItems,
        };
      }
      return subcategory;
    });

    setSubCategories(newSubCategories);
  };

  const handleSelectSubcategory = (index) => {
    setSelectedSubcategoryIndex(index);
  };

  const [modal, setModal] = useState({
    addNameLink: false,
    addLink: false,
    addNameLink2: false,
  });

  const openModal = (modalName) => {
    setModal((prevModal) => ({
      ...prevModal,
      [modalName]: true,
    }));
  };

  const closeModal = (modalName) => {
    setModal((prevModal) => ({
      ...prevModal,
      [modalName]: false,
    }));
  };

  useEffect(() => {
    try {
      const fetchCategory = async () => {
        const { data } = await axios.get("/api/categories", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setCategories(data);
      };
      fetchCategory();
    } catch (err) {
      console.log(getError(err));
    }
  }, [userInfo, refresh]);

  const handleEdit = (cat) => {
    setEditCat(true);
    setEditCurrentCat(cat);
    setCategory({ name: cat.name, path: cat.ath });
    setImageUpload({
      loading: false,
      image: cat.image,
      error: "",
    });
    setSubCategories(cat.subCategories);
  };

  const cancelEdit = () => {
    setEditCat(false);
    setEditCurrentCat(null);
    setCategory({ name: "", path: "" });
    setSubCategories([]);
    setImageUpload({
      loading: false,
      image: "",
      error: "",
    });
  };

  const submitHandler = async () => {
    try {
      if (!editCat) {
        const exist = categories.some((e) => e.name === category.name);
        if (exist) {
          ctxDispatch({
            type: "SHOW_TOAST",
            payload: {
              message: "Categories name already exist",
              showStatus: true,
              state1: "visible1 error",
            },
          });
          return;
        }
        if (!category.name) {
          ctxDispatch({
            type: "SHOW_TOAST",
            payload: {
              message: "Enter a valid category name",
              showStatus: true,
              state1: "visible1 error",
            },
          });
          return;
        }

        if (!imageUpload.image) {
          ctxDispatch({
            type: "SHOW_TOAST",
            payload: {
              message: "Upload a category image",
              showStatus: true,
              state1: "visible1 error",
            },
          });
          return;
        }
        await axios.post(
          "/api/categories",
          {
            category,
            subCategories,
            image: imageUpload.image,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        ctxDispatch({
          type: "SHOW_TOAST",
          payload: {
            message: "Categories Added",
            showStatus: true,
            state1: "visible1 success",
          },
        });
      } else {
        await axios.put(
          "/api/categories",
          {
            id: editCurrentCat._id,
            category,
            subCategories,
            image: imageUpload.image,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        ctxDispatch({
          type: "SHOW_TOAST",
          payload: {
            message: "Categories Updated",
            showStatus: true,
            state1: "visible1 success",
          },
        });
        setEditCat(false);
      }

      setCategory({ name: "", path: "" });
      setSubCategories([]);
      setEditCurrentCat(null);
      setImageUpload({ loading: false, image: "", error: "" });
      setrefresh(!refresh);
    } catch (err) {
      console.log(getError(err));
    }
  };

  const deleteHandler = async (c) => {
    const confirm = window.confirm(
      `Are you sure you want to delete ${c.name} category, this cannot be undo`
    );
    if (!confirm) {
      return;
    }
    try {
      await axios.delete(`/api/categories/${c._id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Categories deleted",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      setrefresh(!refresh);
    } catch (err) {
      console.log(getError(err));
    }
  };

  const [imageUpload, setImageUpload] = useState({
    loading: false,
    image: "",
    error: "",
  });
  const uploadImageHandler = async (e) => {
    try {
      setImageUpload((prev) => ({ ...prev, loading: true }));
      const imageUrl = await compressImageUpload(
        e.target.files[0],
        1024,
        userInfo.token
      );
      setImageUpload((prev) => ({
        ...prev,
        loading: false,
        error: "",
        image: imageUrl,
      }));
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Image Uploaded",
          showStatus: true,
          state1: "visible1 success",
        },
      });
    } catch (err) {
      setImageUpload((prev) => ({
        ...prev,
        loading: false,
        error: getError(err),
      }));
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Failed uploading image",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      console.log(getError(err));
    }
  };

  console.log(category, subCategories);

  return (
    <Container>
      <Title>Categories</Title>
      <Content>
        <Left mode={mode}>
          <Item mode={mode}>
            <Label>Category Name</Label>
            <InputCont>
              <Input
                mode={mode}
                onChange={(e) =>
                  handleCategoryNameChange("name", e.target.value)
                }
                type="text"
                value={category.name}
                placeholder="Enter category name"
              />
              <FontAwesomeIcon
                icon={faLink}
                style={{ cursor: "pointer" }}
                onClick={() => openModal("addLink")}
              />
            </InputCont>
            <Path>{category.path}</Path>
          </Item>
          <Item mode={mode}>
            <Label>Category Image</Label>
            {imageUpload.loading ? (
              <LoadingBox />
            ) : imageUpload.error ? (
              <div style={{ color: "red" }}>{imageUpload.error}</div>
            ) : imageUpload.image ? (
              <img
                src={imageUpload.image}
                alt="imageupload"
                style={{ height: 200, objectFit: "contain", width: 200 }}
              />
            ) : (
              ""
            )}
            <input
              mode={mode}
              id="uploadimage"
              style={{ display: "none" }}
              type="file"
              onChange={uploadImageHandler}
            />
            <UploadImage htmlFor="uploadimage">Upload</UploadImage>
          </Item>
          <Item mode={mode}>
            <InputCont>
              <Label>Sub Categories</Label>
              <Button
                mode={mode}
                className="add"
                onClick={() => {
                  setSelectedSubcategoryIndex(null);
                  setItemIndex(null);
                  openModal("addNameLink2");
                }}
              >
                <FontAwesomeIcon icon={faPlus} color="var(--orange-color)" />
              </Button>
            </InputCont>
            {subCategories.map((subcategory, subcategoryIndex) => (
              <ItemCont
                onClick={() => setSelectedSubcategoryIndex(subcategoryIndex)}
                selected={selectedSubcategoryIndex === subcategoryIndex}
              >
                <InputCont>
                  <div style={{ display: "flex", alignItems: "start" }}>
                    <FontAwesomeIcon
                      icon={faDotCircle}
                      style={{
                        fontSize: "10px",
                        display: "flex",
                        marginRight: "10px",
                        marginTop: "8px",
                      }}
                    />
                    <div
                      onPress={() => handleSelectSubcategory(subcategoryIndex)}
                    >
                      {subcategory.name}
                      <Path>{subcategory.path}</Path>
                    </div>
                  </div>
                  <InputContIcon>
                    <FontAwesomeIcon
                      icon={faPen}
                      style={{ cursor: "pointer", fontSize: "10px" }}
                      onClick={() => {
                        setSelectedSubcategoryIndex(subcategoryIndex);
                        openModal("addNameLink2");
                      }}
                    />
                    <FontAwesomeIcon
                      icon={faTrash}
                      style={{
                        cursor: "pointer",
                        fontSize: "10px",
                        color: "var(--malon-color)",
                      }}
                      onClick={() => {
                        handleDeleteSubcategory(subcategoryIndex);
                      }}
                    />
                  </InputContIcon>
                </InputCont>
              </ItemCont>
            ))}
          </Item>
          <Item mode={mode}>
            <InputCont>
              <Label>Sub Categories Items</Label>
              <Button
                mode={mode}
                className="add"
                onClick={() => {
                  if (selectedSubcategoryIndex === null) {
                    ctxDispatch({
                      type: "SHOW_TOAST",
                      payload: {
                        message: "Select sub category",
                        showStatus: true,
                        state1: "visible1 error",
                      },
                    });
                    return;
                  }
                  setItemIndex(null);
                  openModal("addNameLink");
                }}
              >
                Add
              </Button>
            </InputCont>
            {subCategories.map((subcategory, subcategoryIndex) => (
              <>
                {selectedSubcategoryIndex === subcategoryIndex && (
                  <>
                    <div
                      style={{
                        color: "var(--orange-color)",
                        fontSize: "10px",
                        textTransform: "capitalize",
                      }}
                    >
                      {subcategory.name}:
                    </div>
                    {subcategory.items &&
                      subcategory.items.map((item, itemIndex) => (
                        <ItemCont
                          onClick={() =>
                            setSelectedSubcategoryIndex(subcategoryIndex)
                          }
                        >
                          <InputCont>
                            <div
                              style={{ display: "flex", alignItems: "start" }}
                            >
                              <FontAwesomeIcon
                                icon={faDotCircle}
                                style={{
                                  fontSize: "10px",
                                  display: "flex",
                                  marginRight: "10px",
                                  marginTop: "8px",
                                }}
                              />
                              <div
                                onPress={() =>
                                  handleSelectSubcategory(subcategoryIndex)
                                }
                              >
                                {item.name}
                                <Path>{item.path}</Path>
                              </div>
                            </div>
                            <InputContIcon>
                              <FontAwesomeIcon
                                icon={faPen}
                                style={{
                                  cursor: "pointer",
                                  fontSize: "10px",
                                }}
                                onClick={() => {
                                  setSelectedSubcategoryIndex(subcategoryIndex);
                                  setItemIndex(itemIndex);
                                  openModal("addNameLink");
                                }}
                              />
                              <FontAwesomeIcon
                                icon={faTrash}
                                style={{
                                  cursor: "pointer",
                                  fontSize: "10px",
                                  color: "var(--malon-color)",
                                }}
                                onClick={() => {
                                  handleDeleteItem(subcategoryIndex, itemIndex);
                                }}
                              />
                            </InputContIcon>
                          </InputCont>
                        </ItemCont>
                      ))}
                  </>
                )}
              </>
            ))}
          </Item>

          <Button onClick={submitHandler}>
            {editCat ? "Update Category" : "Add Category"}
          </Button>
          {editCat ? (
            <FontAwesomeIcon
              onClick={() => cancelEdit()}
              className="icon"
              icon={faTimes}
            />
          ) : (
            ""
          )}

          {modal.addNameLink && (
            <Modal onClose={() => closeModal("addNameLink")}>
              <FormModal
                onSubmit={itemIndex !== null ? handleItemChange : handleAddItem}
                onClose={() => closeModal("addNameLink")}
                title="Add Name and Link"
                category={
                  itemIndex !== null
                    ? subCategories[selectedSubcategoryIndex].items[itemIndex]
                    : {
                        name: "",
                        isCategory: true,
                        path: "",
                      }
                }
                nameLabel="Name:"
                linkLabel="Link:"
                index={selectedSubcategoryIndex}
                itemIndex={itemIndex}
              />
            </Modal>
          )}
          {modal.addNameLink2 && (
            <Modal onClose={() => closeModal("addNameLink2")}>
              <FormModal
                onSubmit={
                  selectedSubcategoryIndex !== null
                    ? handleSubcategoryChange
                    : handleAddSubcategory
                }
                onClose={() => closeModal("addNameLink2")}
                category={
                  selectedSubcategoryIndex !== null
                    ? subCategories[selectedSubcategoryIndex]
                    : {
                        name: "",
                        isCategory: true,
                        path: "",
                      }
                }
                nameLabel="Name:"
                linkLabel="Link:"
                index={selectedSubcategoryIndex}
              />
            </Modal>
          )}
          {modal.addLink && (
            <Modal onClose={() => closeModal("addLink")}>
              <FormModal
                onSubmit={handleCategoryPathChange}
                onClose={() => {
                  closeModal("addLink");
                }}
                category={category}
                linkLabel="Link:"
              />
            </Modal>
          )}
        </Left>
        <Right mode={mode}>
          <Item>
            <Label>Categories List</Label>
          </Item>
          {categories.map((c, index) => (
            <ListTitle key={index}>
              <div>
                <FontAwesomeIcon icon={faDotCircle} />
                {c.name}
              </div>
              <div>
                <Edit mode={mode} onClick={() => handleEdit(c)}>
                  Edit
                </Edit>
                <Delete mode={mode} onClick={() => deleteHandler(c)}>
                  Delete
                </Delete>
              </div>
            </ListTitle>
          ))}
        </Right>
      </Content>
    </Container>
  );
}

const FormModal = ({
  onSubmit,
  index,
  onClose,
  category,
  nameLabel,
  linkLabel,
  itemIndex,
}) => {
  const { dispatch: ctxDispatch } = useContext(Store);
  const [name, setName] = useState(category.name || "");
  const [link, setLink] = useState(category.path || "");
  const [isCategory, setIsCategory] = useState(category.isCategory);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Name is required",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    console.log(index, itemIndex);
    console.log(index >= 0 && index !== null);
    if (index >= 0 && index !== null) {
      console.log(itemIndex >= 0 && itemIndex !== null);
      if (itemIndex >= 0 && itemIndex !== null) {
        onSubmit(index, itemIndex, name, isCategory, link);
      } else {
        onSubmit(index, name, isCategory, link);
      }
    } else {
      onSubmit(name, isCategory, link);
    }
    onClose();
  };

  return (
    <ModalContent>
      <CloseButton onClick={onClose}>&times;</CloseButton>
      <Form1 onSubmit={handleSubmit}>
        {nameLabel && (
          <>
            <Label>{nameLabel}</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </>
        )}
        {linkLabel && (
          <>
            <Label>{linkLabel}</Label>
            <Input
              type="text"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
          </>
        )}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Checkbox
            id="checkbox"
            type="checkbox"
            checked={isCategory}
            onChange={(e) => setIsCategory(e.target.checked)}
          />
          <label htmlFor="checkbox">It's Category</label>
        </div>

        <Button type="submit">Add</Button>
      </Form1>
    </ModalContent>
  );
};
