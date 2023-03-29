import { faDotCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Store } from '../../Store';
import { getError } from '../../utils';
import LoadingBox from '../LoadingBox';

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
    props.mode === 'pagebodydark' ? 'var(--dark-ev1)' : 'var(--light-ev1)'};
  & .icon {
    margin-left: 10px;
  }
`;
const Right = styled.div`
  border-radius: 0.2rem;
  flex: 1;
  padding: 20px;
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev1)' : 'var(--light-ev1)'};
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
`;
const Label = styled.label`
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
`;
const Input = styled.input`
  background: none;
  color: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--white-color)' : 'var(--dark-color)'};
  border: 1px solid
    ${(props) =>
      props.mode === 'pagebodydark' ? 'var(--dark-ev3)' : 'var(--light-ev3)'};
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
    props.mode === 'pagebodydark' ? 'var(--white-color)' : 'var(--dark-color)'};
  border: 1px solid
    ${(props) =>
      props.mode === 'pagebodydark' ? 'var(--dark-ev3)' : 'var(--light-ev3)'};
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
  margin-top: 20px;
  &.add {
    margin-top: 0;
    width: 80px;
    background: ${(props) =>
      props.mode === 'pagebodydark' ? 'var(--dark-ev3)' : '#fcf0e0'};
    color: var(--orange-color);
  }
`;
const InputCont = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
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
    props.mode === 'pagebodydark' ? 'var(--dark-ev2)' : 'var(--light-ev2)'};
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
    props.mode === 'pagebodydark' ? '#211111' : '#f8d6d6'};
  color: var(--red-color);
`;
const Edit = styled.button`
  border: 0;
  padding: 2px 5px;
  font-size: 14px;
  margin-right: 10px;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev3)' : '#fcf0e0'};
  color: var(--orange-color);
`;
const UploadImage = styled.label`
  border: 1px solid var(--malon-color);
  padding: 2px 5px;
  font-size: 14px;
  cursor: pointer;
  /* margin-right: 10px; */
  border-radius: 0.2rem;
`;

let subCategories = [];
export default function Categories() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo } = state;
  const [currentCat, setCurrentCat] = useState('');
  const [currentCatItem, setCurrentCatItem] = useState('');
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [refresh, setrefresh] = useState(false);
  const [editCat, setEditCat] = useState(false);
  const [editCatSub, setEditCatSub] = useState(false);
  const [editCurrentCat, setEditCurrentCat] = useState({});
  const [index, setIndex] = useState({});

  useEffect(() => {
    try {
      const fetchCategory = async () => {
        const { data } = await axios.get('/api/categories', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setCategories(data);
      };
      fetchCategory();
    } catch (err) {
      console.log(getError(err));
    }
  }, [userInfo, refresh]);

  const submitHandler = async () => {
    try {
      if (!editCat) {
        const exist = categories.some((e) => e.name === name);
        if (exist) {
          ctxDispatch({
            type: 'SHOW_TOAST',
            payload: {
              message: 'Categories name already exist',
              showStatus: true,
              state1: 'visible1 error',
            },
          });
          return;
        }
        if (!name) {
          ctxDispatch({
            type: 'SHOW_TOAST',
            payload: {
              message: 'Enter a valid category name',
              showStatus: true,
              state1: 'visible1 error',
            },
          });
          return;
        }

        if (!imageUpload.image) {
          ctxDispatch({
            type: 'SHOW_TOAST',
            payload: {
              message: 'Upload a category image',
              showStatus: true,
              state1: 'visible1 error',
            },
          });
          return;
        }
        await axios.post(
          '/api/categories',
          {
            name,
            subCategories,
            image: imageUpload.image,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        ctxDispatch({
          type: 'SHOW_TOAST',
          payload: {
            message: 'Categories Added',
            showStatus: true,
            state1: 'visible1 success',
          },
        });
      } else {
        await axios.put(
          '/api/categories',
          {
            id: editCurrentCat._id,
            name,
            subCategories,
            image: imageUpload.image,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        ctxDispatch({
          type: 'SHOW_TOAST',
          payload: {
            message: 'Categories Updated',
            showStatus: true,
            state1: 'visible1 success',
          },
        });
        setEditCat(false);
      }

      setName('');
      subCategories = [];
      setCurrentCat('');
      setCurrentCatItem('');
      setImageUpload({ loading: false, image: '', error: '' });
      setrefresh(!refresh);
    } catch (err) {
      console.log(getError(err));
    }
  };

  const sizeHandler = (name) => {
    const exist = subCategories.filter((s) => {
      return s.name === name;
    });
    if (exist.length > 0) {
      const newsizes = subCategories.filter((s) => {
        return s.name !== name;
      });
      console.log(subCategories);
      subCategories = newsizes;
      console.log(subCategories);
      setCurrentCatItem('');
      setCurrentCat('');
      setrefresh(!refresh);

      return;
    }
    if (!editCatSub) {
      if (currentCatItem === '') {
        const subCategoriesObject = {
          name: currentCat.toLowerCase(),
          items: [],
        };
        subCategories.push(subCategoriesObject);
      } else {
        const CatArray = currentCatItem.toLowerCase().split(',');
        const subCategoriesObject = {
          name: currentCat.toLowerCase(),
          items: CatArray,
        };
        subCategories.push(subCategoriesObject);
      }
      setCurrentCat('');
      setCurrentCatItem('');
      setrefresh(!refresh);
    } else {
      if (currentCatItem === '') {
        const subCategoriesObject = {
          name: currentCat.toLowerCase(),
          items: [],
        };
        subCategories[index] = subCategoriesObject;
      } else {
        const CatArray = currentCatItem.toLowerCase().split(',');
        const subCategoriesObject = {
          name: currentCat.toLowerCase(),
          items: CatArray,
        };
        subCategories[index] = subCategoriesObject;
      }
      setCurrentCat('');
      setCurrentCatItem('');
      setrefresh(!refresh);
      setEditCatSub(false);
      console.log(subCategories);
    }
  };

  const editHandler = (c, type) => {
    if (type === 'cancel') {
      setName('');
      subCategories = [];
      setEditCat(false);
      setImageUpload({ loading: false, image: '', error: '' });
      return;
    }
    setName(c.name);
    subCategories = c.subCategories;
    setEditCat(true);
    setEditCurrentCat(c);
    setImageUpload({ loading: false, image: c.image, error: '' });
  };

  const editSubCategories = (sub) => {
    setIndex(sub);
    setEditCatSub(true);
    setCurrentCat(subCategories[sub].name);
    setCurrentCatItem(subCategories[sub].items.toString());
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
        type: 'SHOW_TOAST',
        payload: {
          message: 'Categories deleted',
          showStatus: true,
          state1: 'visible1 error',
        },
      });
      setrefresh(!refresh);
    } catch (err) {
      console.log(getError(err));
    }
  };

  const [imageUpload, setImageUpload] = useState({
    loading: false,
    image: '',
    error: '',
  });
  const uploadImageHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      setImageUpload((prev) => ({ ...prev, loading: true }));
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      setImageUpload((prev) => ({
        ...prev,
        loading: false,
        image: data.secure_url,
      }));
      ctxDispatch({
        type: 'SHOW_TOAST',
        payload: {
          message: 'Image Uploaded',
          showStatus: true,
          state1: 'visible1 success',
        },
      });
    } catch (err) {
      setImageUpload((prev) => ({
        ...prev,
        loading: false,
        error: getError(err),
      }));
      ctxDispatch({
        type: 'SHOW_TOAST',
        payload: {
          message: 'Failed uploading image',
          showStatus: true,
          state1: 'visible1 error',
        },
      });
      console.log(getError(err));
    }
  };

  return (
    <Container>
      <Title>Categories</Title>
      <Content>
        <Left mode={mode}>
          <Item>
            <Label>Category Name</Label>
            <Input
              mode={mode}
              onChange={(e) => setName(e.target.value)}
              type="text"
              value={name}
              placeholder="Enter category name"
            />
          </Item>
          <Item>
            <Label>Category Image</Label>
            {imageUpload.loading ? (
              <LoadingBox />
            ) : imageUpload.error ? (
              <div style={{ color: 'red' }}>{imageUpload.error}</div>
            ) : imageUpload.image ? (
              <image
                src={imageUpload.image}
                alt="imageupload"
                style={{ height: 200, objectFit: 'contain', width: 200 }}
              />
            ) : (
              ''
            )}
            <input
              mode={mode}
              id="uploadimage"
              style={{ display: 'none' }}
              type="file"
              onChange={uploadImageHandler}
            />
            <UploadImage htmlFor="uploadimage">Upload</UploadImage>
          </Item>
          <Item>
            <Label>Sub Categories</Label>
            <InputCont>
              <Input
                mode={mode}
                className="half"
                value={currentCat}
                type="text"
                placeholder="Enter Sub category"
                onChange={(e) => setCurrentCat(e.target.value)}
              />
            </InputCont>
          </Item>
          <Item>
            <Label>Sub Categories Items</Label>
            <InputCont>
              <Textarea
                mode={mode}
                className="half"
                value={currentCatItem}
                type="text"
                placeholder="Enter Sub category"
                onChange={(e) => setCurrentCatItem(e.target.value)}
              />
              <Button mode={mode} className="add" onClick={sizeHandler}>
                Add
              </Button>
            </InputCont>
          </Item>

          <SubCont>
            {subCategories.map((c, index) => (
              <SubCat>
                <CatList mode={mode} key={index}>
                  <div onClick={() => editSubCategories(index)}>{c.name}</div>
                </CatList>
                <FontAwesomeIcon
                  icon={faTimes}
                  onClick={(e) => sizeHandler(c.name)}
                />
              </SubCat>
            ))}
          </SubCont>

          <Button onClick={submitHandler}>
            {editCat ? 'Update Category' : 'Add Category'}
          </Button>
          {editCat ? (
            <FontAwesomeIcon
              onClick={() => editHandler('', 'cancel')}
              className="icon"
              icon={faTimes}
            />
          ) : (
            ''
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
                <Edit mode={mode} onClick={() => editHandler(c, 'edit')}>
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
