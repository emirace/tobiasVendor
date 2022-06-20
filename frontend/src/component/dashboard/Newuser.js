import { faDotCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Store } from '../../Store';
import { getError } from '../../utils';

const Container = styled.div`
  flex: 4;
  padding: 0 20px;
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
`;
const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
`;
const Item = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
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
const Gender = styled.div`
  display: flex;
  align-items: center;

  & input {
    &::after {
      width: 15px;
      height: 15px;
      content: '';
      display: inline-block;
      visibility: visible;
      border-radius: 15px;
      position: relative;
      top: 11px;
      left: -1px;
      background-color: ${(props) =>
        props.mode === 'pagebodydark'
          ? 'var(--black-color)'
          : 'var(--white-color)'};
      border: 1px solid var(--orange-color);
    }
    &:checked::after {
      width: 15px;
      height: 15px;
      content: '';
      display: inline-block;
      visibility: visible;
      border-radius: 15px;
      position: relative;
      top: 11px;
      left: -1px;
      background-color: var(--orange-color);
      border: 1px solid var(--orange-color);
    }
  }
  & label {
    margin: 10px;
    font-size: 18px;
    font-weight: 300;
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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  margin: 5px;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev2)' : 'var(--light-ev2)'};
  & svg {
    margin-left: 5px;
    font-size: 13px;
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

let subCategories = [];
export default function Newuser() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo } = state;
  const [currentCat, setCurrentCat] = useState('');
  const [name, setName] = useState('');
  const [categories, setCategories] = useState([]);
  const [refresh, setrefresh] = useState(false);
  const [editCat, setEditCat] = useState(false);
  const [editCurrentCat, setEditCurrentCat] = useState({});

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
      const exist = categories.some((e) => e.name === name);
      exist ? setEditCat(true) : setEditCat(false);
      if (!editCat) {
        await axios.post(
          '/api/categories',
          {
            name,
            subCategories,
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
      setrefresh(!refresh);
    } catch (err) {
      console.log(getError(err));
    }
  };

  const sizeHandler = (sizenow) => {
    const exist = subCategories.filter((s) => {
      return s === sizenow;
    });
    if (exist.length > 0) {
      const newsizes = subCategories.filter((s) => {
        return s !== sizenow;
      });
      subCategories = newsizes;
      setCurrentCat('');
    } else {
      subCategories.push(sizenow);
      setCurrentCat('');
    }
    setrefresh(!refresh);
  };

  const editHandler = (c, type) => {
    if (type === 'cancel') {
      setName('');
      subCategories = [];
      setEditCat(false);
      return;
    }
    setName(c.name);
    subCategories = c.subCategories;
    setEditCat(true);
    setEditCurrentCat(c);
  };

  const deleteHandler = async (c) => {
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
          <SubCont>
            {subCategories.map((c, index) => (
              <CatList mode={mode} key={index}>
                {c}
                <FontAwesomeIcon
                  icon={faTimes}
                  onClick={(e) => sizeHandler(c)}
                />
              </CatList>
            ))}
          </SubCont>
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
              <Button
                mode={mode}
                className="add"
                onClick={(e) => sizeHandler(currentCat)}
              >
                Add
              </Button>
            </InputCont>
          </Item>
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
