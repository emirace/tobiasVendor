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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
    width: 118px;
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
  align-items: center;
`;
const Discount = styled.div`
  display: flex;
  align-items: center;
`;
const PriceDisplay = styled.div`
  display: flex;
  justify-content: center;
  margin: 55px 0 0 30px;
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
const Button = styled.button`
  width: 200px;
  border: none;
  background: var(--orange-color);
  color: var(--white-color);
  padding: 7px 10px;
  border-radius: 0.2rem;
  cursor: pointer;
  margin-top: 30px;
  &:hover {
    background: var(--malon-color);
  }
`;
const Top = styled.div``;
const ButtonC = styled.div`
  display: flex;
  justify-content: end;
`;
const sizes = [];
export default function NewProduct() {
  const { state } = useContext(Store);
  const { mode } = state;

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Womenswear');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [specification, setSpecification] = useState('');
  const [feature, setFeature] = useState('');
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [image4, setImage4] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [condition, setCondition] = useState('New');
  const [tempsize, setTempsize] = useState('');

  const submitHandler = () => {};

  const sizeHandler = (sizenow) => {
    const exist = sizes.map((s) => {
      if (s.size === sizenow) {
        return true;
      }
    });
    if (exist) sizes.push({ size: sizenow });
    console.log('sixe', sizes);
    setTempsize(sizenow);
  };

  const uploadHandler = () => {};

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
              <TextInput
                mode={mode}
                type="text"
                onChange={(e) => setName(e.targer.value)}
              />
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
              <TextInput
                mode={mode}
                type="text"
                onChange={(e) => setBrand(e.targer.value)}
              />
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
                      value={tempsize}
                      onChange={(e) => sizeHandler(e.target.value)}
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
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      displayEmpty
                    >
                      <MenuItem value="Nigeria">Nigeria</MenuItem>
                      <MenuItem value="South African">South African</MenuItem>
                    </Select>
                  </FormControl>
                </Item>
              </SizeRight>
            </Sizes>
            <Item>
              <Label>Description</Label>
              <TextArea
                mode={mode}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Item>
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
                        const value = (price * (100 - e.target.value)) / 100;
                        setDiscount(value);
                      }
                    }}
                  />
                  <span>%</span>
                </Discount>
              </Item>
              <PriceDisplay>
                <Offer>${discount || price}</Offer>
                <Actual>${price}</Actual>
              </PriceDisplay>
            </Price>
          </Left>
          <Right>
            <Top>
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
                      <Upload
                        type="file"
                        id="image1"
                        onChange={() => uploadHandler()}
                      />
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
                      <Upload
                        type="file"
                        id="image2"
                        onChange={() => uploadHandler()}
                      />
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
                        <Upload
                          type="file"
                          id="image3"
                          onChange={() => uploadHandler()}
                        />
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
                        <Upload
                          type="file"
                          id="image4"
                          onChange={() => uploadHandler()}
                        />
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
                <Label>Specification</Label>
                <TextArea
                  mode={mode}
                  onChange={(e) => setSpecification(e.targert.value)}
                />
              </Item>
              <Item>
                <Label>Key Features</Label>
                <TextArea
                  mode={mode}
                  onChange={(e) => setFeature(e.targer.value)}
                />
              </Item>
            </Top>
            <ButtonC>
              <Button onClick={submitHandler}>Add Product</Button>
            </ButtonC>
          </Right>
        </Form>
      </Content>
    </NewProductC>
  );
}
