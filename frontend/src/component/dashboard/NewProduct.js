import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Store } from '../../Store';
import { faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
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
  }
`;
const Item = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 20px 0 0;
  width: 100%;
  &.half {
    width: 100px;
    margin-right: 5px;
  }
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
  &.half {
    width: 100px;
    margin-right: 5px;
  }
`;
const Label = styled.label`
  margin-bottom: 10px;
  font-size: 14px;
  font-weight: 600;
`;
const ItemCont = styled.div`
  display: flex;
  gap: 20px;
`;
const ItemLeft = styled.div`
  flex: 8;
`;
const ItemRight = styled.div`
  flex: 4;
`;
const TextArea = styled.textarea`
  height: 100px;
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
  gap: 20px;
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
const SmallItem = styled.div`
  & input {
    margin-left: 5px;
  }
  & svg {
    font-size: 10px;
    margin-left: 5px;
    cursor: pointer;
  }
  margin: 10px;
`;
const SmallItems = styled.div`
  display: flex;
  flex-wrap: wrap;
`;
const Price = styled.div`
  display: flex;
`;
const Discount = styled.div`
  display: flex;
  align-items: center;
`;
const PriceDisplay = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;
const Offer = styled.div`
  font-size: 25px;
  margin-right: 20px;
  font-weight: 300;
  color: var(--orange-color);
`;
const Actual = styled.div`
  font-size: 25px;
  color: var(--malon-color);

  font-weight: 300;
  text-decoration: line-through;
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
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
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
                      <MenuItem value="S">S</MenuItem>
                      <MenuItem value="M">M</MenuItem>
                      <MenuItem value="L">L</MenuItem>
                      <MenuItem value="XL">XL</MenuItem>
                      <MenuItem value="XXL">XXL</MenuItem>
                    </Select>
                  </FormControl>
                </Item>
                <SmallItems>
                  <SmallItem>
                    <Label>SM</Label>:
                    <SizeInput mode={mode} />
                    <FontAwesomeIcon icon={faTimes} />
                  </SmallItem>
                  <SmallItem>
                    <Label>LG</Label>:
                    <SizeInput mode={mode} />
                    <FontAwesomeIcon icon={faTimes} />
                  </SmallItem>
                </SmallItems>
              </SizeLeft>
              <SizeRight>
                <Item>
                  <Label>Shipping Location</Label>
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
                      <MenuItem value="Nigeria">Nigeria</MenuItem>
                      <MenuItem value="South African">South African</MenuItem>
                    </Select>
                  </FormControl>
                </Item>
              </SizeRight>
            </Sizes>
            <Price>
              <Item className="half">
                <Label>Price</Label>
                <TextInput
                  mode={mode}
                  type="number"
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Item>
              <Item className="half">
                <Label>Discount</Label>
                <Discount>
                  <TextInput
                    className="half"
                    mode={mode}
                    type="number"
                    onChange={(e) => {
                      if (price) {
                        const value = (price * e.target.value) / 100;
                        setDiscount(price - value);
                      }
                    }}
                  />
                  <span>%</span>
                </Discount>
              </Item>
            </Price>
            <PriceDisplay>
              <Offer>${price}</Offer>
              <Actual>${discount}</Actual>
            </PriceDisplay>
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
            <Item>
              <Label>Description</Label>
              <TextArea mode={mode} />
            </Item>
            <Item>
              <Label>Specification</Label>
              <TextArea mode={mode} />
            </Item>
            <Item>
              <Label>Key Features</Label>
              <TextArea mode={mode} />
            </Item>
          </Right>
        </Form>
      </Content>
    </NewProductC>
  );
}
