import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Store } from '../../Store';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const NewProductC = styled.div`
  flex: 4;
  margin: 0 20px;
  padding: 20px;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev1)' : 'var(--light-ev1)'};
`;
const TitleCont = styled.div`
  margin-bottom: 20px;
`;
const Title = styled.h1`
  font-size: 28px;
`;
const TitleDetails = styled.span`
  width: 70%;
  font-size: 10px;
  line-height: 1.2;
`;
const Content = styled.div``;
const Left = styled.div`
  flex: 1;
`;
const Right = styled.div`
  flex: 1;
`;
const Form = styled.form`
  display: flex;
  gap: 20px;
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;
const Item = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 20px 0 0;
`;
const TextInput = styled.input`
  background: none;
  color: ${(props) =>
    props.mode === 'pagebodydark'
      ? 'var(--white-color)'
      : 'var(--black-color)'};
  border: 1px solid
    ${(props) =>
      props.mode === 'pagebodydark' ? 'var(--dark-ev4)' : 'var(--light-ev4)'};
  border-radius: 0.2rem;
  height: 40px;
  padding: 10px;
  &:focus-visible {
    outline: 1px solid var(--orange-color);
  }
`;
const Label = styled.label`
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
`;
const ItemCont = styled.div`
  display: flex;
`;
const ItemLeft = styled.div`
  flex: 8;
`;
const ItemRight = styled.div`
  flex: 4;
`;
const TextArea = styled.textarea`
  height: 200px;
  border-radius: 0.2rem;
  background: none;
  color: ${(props) =>
    props.mode === 'pagebodydark'
      ? 'var(--white-color)'
      : 'var(--black-color)'};
  padding: 10px;
  &:focus-visible {
    outline: 1px solid var(--orange-color);
  }
  border: 1px solid
    ${(props) =>
      props.mode === 'pagebodydark' ? 'var(--dark-ev4)' : 'var(--light-ev4)'};
`;
const ImageRow = styled.div`
  display: flex;
  gap: 5px;
`;
const BigImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const BigImageC = styled.div`
  border-radius: 0.2rem;
  flex: 1;
  width: 150px;
  height: 150px;
  border: 1px dashed
    ${(props) =>
      props.mode === 'pagebodydark' ? 'var(--dark-ev4)' : 'var(--light-ev4)'};
`;
const SmallImageRow = styled.div`
  flex: 1;
  gap: 5px;
  display: flex;
  flex-direction: column;
`;
const SmallImageC = styled.div`
  height: 72.5px;
  border-radius: 0.2rem;
  border: 1px dashed
    ${(props) =>
      props.mode === 'pagebodydark' ? 'var(--dark-ev4)' : 'var(--light-ev4)'};
`;
const SmallImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;
const AddImage = styled.label`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  text-align: center;
  font-size: 12px;
  & span {
    color: var(--orange-color);
  }
`;
const Upload = styled.input`
  display: none;
`;
const Sizes = styled.div`
  display: flex;
  margin: 20px 0;
`;
const SizeLeft = styled.div`
  flex: 1;
`;
const SizeRight = styled.div`
  display: flex;
  flex: 1;
`;
const SizeInput = styled.input`
  background: none;
  color: ${(props) =>
    props.mode === 'pagebodydark'
      ? 'var(--white-color)'
      : 'var(--black-color)'};
  border: 1px solid
    ${(props) =>
      props.mode === 'pagebodydark' ? 'var(--dark-ev4)' : 'var(--light-ev4)'};
  border-radius: 0.2rem;
  height: 20px;
  width: 35px;
  padding: 10px;
  &:focus-visible {
    outline: 1px solid var(--orange-color);
  }
`;

export default function NewProduct() {
  const { state } = useContext(Store);
  const { mode } = state;

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Womenswear');
  const [brand, setBrand] = useState('');
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [image4, setImage4] = useState('');
  const [condition, setCondition] = useState('New');
  return (
    <NewProductC mode={mode}>
      <TitleCont>
        <Title>NewProduct</Title>
        <TitleDetails>
          When adding product, do not ignore to fill relavant fields and
          following the product adding rules
        </TitleDetails>
      </TitleCont>
      <Content>
        <Form>
          <Left>
            <Item>
              <Label>Product Name</Label>
              <TextInput mode={mode} type="text" />
            </Item>
            <ItemCont>
              <ItemLeft>
                <Item>
                  <Label>Category</Label>
                  <FormControl
                    sx={{
                      margin: 0,
                      borderRadius: '0.2rem',
                      border: `1px solid ${
                        mode === 'pagebodydark'
                          ? 'var(--dark-ev4)'
                          : 'var(--light-ev4)'
                      }`,
                      '& .MuiOutlinedInput-root': {
                        color: `${
                          mode === 'pagebodydark'
                            ? 'var(--white-color)'
                            : 'var(--black-color)'
                        }`,
                        '&:hover': {
                          outline: 0,
                          border: 0,
                        },
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: '0 !important',
                      },
                    }}
                    size="small"
                  >
                    <Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      displayEmpty
                      inputProps={{
                        'aria-label': 'Without label',
                      }}
                    >
                      <MenuItem value={'Womenswear'}>Womenswear</MenuItem>
                      <MenuItem value={'Menswear'}>Menswear</MenuItem>
                      <MenuItem value={'Kids'}>Kids</MenuItem>
                      <MenuItem value={'Cureve Plus'}>Cureve Plus</MenuItem>
                    </Select>
                  </FormControl>
                </Item>
              </ItemLeft>
              <ItemRight>
                <Item>
                  <Label>Condition</Label>
                  <FormControl
                    sx={{
                      margin: 0,
                      borderRadius: '0.2rem',
                      border: `1px solid ${
                        mode === 'pagebodydark'
                          ? 'var(--dark-ev4)'
                          : 'var(--light-ev4)'
                      }`,
                      '& .MuiOutlinedInput-root': {
                        color: `${
                          mode === 'pagebodydark'
                            ? 'var(--white-color)'
                            : 'var(--black-color)'
                        }`,
                        '&:hover': {
                          outline: 'none',
                          border: 0,
                        },
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: '0 !important',
                      },
                    }}
                    size="small"
                  >
                    <Select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="New">New</MenuItem>
                      <MenuItem value="Used">Used</MenuItem>
                    </Select>
                  </FormControl>
                </Item>
              </ItemRight>
            </ItemCont>
            <Item>
              <Label>Brand</Label>
              <TextInput mode={mode} type="text" />
            </Item>
            <Item>
              <Label>Description</Label>
              <TextArea mode={mode} />
            </Item>
          </Left>
          <Right>
            <Label>Product Image</Label>
            <ImageRow>
              <BigImageC mode={mode}>
                {image1 ? (
                  <BigImage />
                ) : (
                  <AddImage htmlFor="image1">
                    <FontAwesomeIcon icon={faImage} />
                    <div>
                      Click to Browse <span>Image</span>
                    </div>
                    <Upload type="file" id="image1" />
                  </AddImage>
                )}
              </BigImageC>
              <BigImageC mode={mode}>
                {image2 ? (
                  <BigImage />
                ) : (
                  <AddImage htmlFor="image2">
                    <FontAwesomeIcon icon={faImage} />
                    <div>
                      Click to Browse <span>Image</span>
                    </div>
                    <Upload type="file" id="image2" />
                  </AddImage>
                )}
              </BigImageC>
              <SmallImageRow>
                <SmallImageC mode={mode}>
                  {image3 ? (
                    <SmallImage />
                  ) : (
                    <AddImage htmlFor="image3">
                      <FontAwesomeIcon icon={faImage} />
                      <div>
                        Click to Browse <span>Image</span>
                      </div>
                      <Upload type="file" id="image3" />
                    </AddImage>
                  )}
                </SmallImageC>
                <SmallImageC mode={mode}>
                  {image4 ? (
                    <SmallImage />
                  ) : (
                    <AddImage htmlFor="image4">
                      <FontAwesomeIcon icon={faImage} />
                      <div>
                        Click to Browse <span>Image</span>
                      </div>
                      <Upload type="file" id="image4" />
                    </AddImage>
                  )}
                </SmallImageC>
              </SmallImageRow>
            </ImageRow>
            <TitleDetails>
              You will need to add aleast one image and a max of four images.
              Add clear and quality images.Ensure ypu follow the image uplaod
              rules.
            </TitleDetails>
            <Sizes>
              <SizeLeft>
                <Item>
                  <Label>Add Size</Label>
                  <FormControl
                    sx={{
                      margin: 0,
                      borderRadius: '0.2rem',
                      border: `1px solid ${
                        mode === 'pagebodydark'
                          ? 'var(--dark-ev4)'
                          : 'var(--light-ev4)'
                      }`,
                      '& .MuiOutlinedInput-root': {
                        color: `${
                          mode === 'pagebodydark'
                            ? 'var(--white-color)'
                            : 'var(--black-color)'
                        }`,
                        '&:hover': {
                          outline: 'none',
                          border: 0,
                        },
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: '0 !important',
                      },
                    }}
                    size="small"
                  >
                    <Select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="New">New</MenuItem>
                      <MenuItem value="Used">Used</MenuItem>
                    </Select>
                  </FormControl>
                </Item>
                <div>
                  <Label>sm</Label>:<SizeInput mode={mode} />
                </div>
              </SizeLeft>
              <SizeRight>
                <Item>
                  <Label>Shipping Location</Label>
                  <TextInput mode={mode} type="text" />
                </Item>
              </SizeRight>
            </Sizes>
          </Right>
        </Form>
      </Content>
    </NewProductC>
  );
}
