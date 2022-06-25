import React, { useContext, useReducer, useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Store } from '../../Store';
import { faImage, faTimes } from '@fortawesome/free-solid-svg-icons';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import axios from 'axios';
import { getError } from '../../utils';
import LoadingBox from '../LoadingBox';
import { useNavigate } from 'react-router-dom';

const NewProductC = styled.div`
  flex: 4;
  margin: 0 20px;
  padding: 20px;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev1)' : 'var(--light-ev1)'};
  @media (max-width: 992px) {
    padding: 10px;
    margin: 0;
  }
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
    flex-direction: column;
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
  &:invalid {
    /* outline: 1px solid var(--red-color); */
  }
  @media (max-width: 992px) {
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
  flex: 1;
`;
const ItemRight = styled.div`
  flex: 1;
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
  border-radius: 00.2rem;
  object-fit: cover;
  object-position: top;
`;
const BigImageC = styled.div`
  border-radius: 0.2rem;
  flex: 1;
  width: 100%;
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
  object-position: top;
  border-radius: 0.2rem;
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
  font-size: 12px;
  color: ${(props) =>
    props.mode === 'pagebodydark'
      ? 'var(--white-color)'
      : 'var(--black-color)'};
  border: 1px solid
    ${(props) =>
      props.mode === 'pagebodydark' ? 'var(--dark-ev4)' : 'var(--light-ev4)'};
  border-radius: 0.2rem;
  height: 20px;
  width: 40px;
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
const Error = styled.div`
  color: var(--red-color);
  font-size: 12px;
  margin: 24px 10px 0 0;
`;

const BrandList = styled.div`
  max-height: 200px;
  overflow: auto;
  border-bottom-left-radius: 0.2rem;
  border-bottom-right-radius: 0.2rem;
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev2)' : 'var(--light-ev2)'};
`;
const BrandListItem = styled.div`
  padding: 10px 20px;
  font-size: 15px;
  &:hover {
    background: ${(props) =>
      props.mode === 'pagebodydark' ? 'var(--dark-ev3)' : 'var(--light-ev3)'};
  }
`;

const Checkbox = styled.input`
  margin-bottom: 10px;
  margin-right: 10px;
  &::after {
    width: 15px;
    height: 15px;
    content: '';
    display: inline-block;
    visibility: visible;
    position: relative;
    top: -2px;
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
    position: relative;
    top: -2px;
    left: -1px;
    background-color: var(--orange-color);
    border: 1px solid var(--orange-color);
  }
`;
const ItemCheck = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 20px 0 0;
  width: 100%;
`;
const VimageCont = styled.div`
  width: 150px;
  height: 150px;
  margin-top: 20px;
`;

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'CREATE_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true };
    case 'UPLOAD_SUCCESS':
      return { ...state, loadingUpload: false, errorUpload: '' };
    case 'UPLOAD_FAIL':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: action.payload,
      };

    default:
      return state;
  }
};

let sizes = [];
export default function NewProduct() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo } = state;

  const [name, setName] = useState('');
  const [category, setCategory] = useState('Womenswear');
  const [product, setProduct] = useState('Womenswear');
  const [subCategory, setSubCategory] = useState('Womenswear');
  const [material, setMaterial] = useState('Womenswear');
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [luxury, setLuxury] = useState(false);
  const [luxuryImage, setLuxuryImage] = useState('');
  const [vintage, setVintage] = useState(false);
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
  const [validated, setValidated] = useState(false);
  const [formError, setFormError] = useState('');

  const navigate = useNavigate();

  const [{ loading, error, loadingUpload, errorUpload }, dispatch] = useReducer(
    reducer,
    {
      loading: false,
      error: '',
      loadingUpload: false,
      errorUpload: '',
    }
  );

  const sizeHandler = (sizenow) => {
    const exist = sizes.filter((s) => {
      return s.size === sizenow;
    });
    if (exist.length > 0) {
      const newsizes = sizes.filter((s) => {
        return s.size !== sizenow;
      });
      sizes = newsizes;
    } else {
      sizes.push({ size: sizenow, value: '0' });
    }
    setTempsize(sizenow);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    console.log('sizes', sizes);
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidated(true);
      setFormError('Fill all required field *');
    } else {
      setFormError('');

      try {
        dispatch({ type: 'CREATE_REQUEST' });
        await axios.post(
          '/api/products',
          {
            name,
            image1,
            image2,
            image3,
            image4,
            // video,
            product,
            subCategory,
            category,
            description,
            brand,
            discount,
            price,
            location,
            specification,
            sizes: sizes,
            condition,
            feature,
            luxury,
            vintage,
            material,
            color,
            luxuryImage,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        ctxDispatch({
          type: 'SHOW_TOAST',
          payload: {
            message: 'Product created successfully',
            showStatus: true,
            state1: 'visible1 success',
          },
        });
        dispatch({ type: 'CREATE_SUCCESS' });
        navigate(`/dashboard/productlist`);
      } catch (err) {
        ctxDispatch({
          type: 'SHOW_TOAST',
          payload: {
            message: 'Error creating product, try again late',
            showStatus: true,
            state1: 'visible1 error',
          },
        });
        console.log(getError(err));
        dispatch({ type: 'CREATE_FAIL' });
      }
    }
  };

  const smallSizeHandler = (label, value) => {
    const sizeIndex = sizes.findIndex((x) => x.size === label);
    sizes[sizeIndex].value = value;
  };
  //   const deleteSizeHandler = (label) => {
  //     const newsizes = sizes.filter((s) => {
  //       return s.size !== label;
  //     });
  //     sizes = newsizes;
  //     console.log('new', sizes);
  //   };

  const uploadHandler = async (e, fileType) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });
      if (fileType === 'image1') {
        setImage1(data.secure_url);
      } else if (fileType === 'image2') {
        setImage2(data.secure_url);
      } else if (fileType === 'image3') {
        setImage3(data.secure_url);
      } else if (fileType === 'luxury') {
        setLuxuryImage(data.secure_url);
      } else {
        setImage4(data.secure_url);
      }
      ctxDispatch({
        type: 'SHOW_TOAST',
        payload: {
          message: 'Image Uploaded',
          showStatus: true,
          state1: 'visible1 success',
        },
      });
    } catch (err) {
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
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

  const [showSelect, setShowSelect] = useState(false);
  let brands = ['Nike', 'Gucci', 'Rolex', 'Louis Vuitto', 'Adidas', 'Dior'];
  const handleSelect = (b) => {
    setBrand(b);
    setShowSelect(false);
  };
  if (brand.length > 0) {
    brands = brands.filter((i) => {
      return i.toLowerCase().match(brand);
    });
  }

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
        <Form noValidate validated={validated} onSubmit={submitHandler}>
          <Left>
            <Item>
              <Label>Product Name</Label>
              <TextInput
                required
                mode={mode}
                type="text"
                onChange={(e) => setName(e.target.value)}
              />
            </Item>
            <Item>
              <Label>Product</Label>
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
                  value={product}
                  onChange={(e) => setProduct(e.target.value)}
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
                  <Label>Sub Category</Label>
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
                      onChange={(e) => setSubCategory(e.target.value)}
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
            <Item>
              <Label>Materail/Fabric</Label>
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
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="Used">Used</MenuItem>
                </Select>
              </FormControl>
            </Item>
            <Item>
              <Label>Brand</Label>
              <TextInput
                mode={mode}
                type="text"
                value={brand}
                onChange={(e) => {
                  setBrand(e.target.value);
                  setShowSelect(true);
                }}
                onClick={() => setShowSelect(true)}
              />
              {showSelect && (
                <BrandList mode={mode}>
                  {brands.map((b) => (
                    <BrandListItem mode={mode} onClick={() => setBrand(b)}>
                      {b}
                    </BrandListItem>
                  ))}
                </BrandList>
              )}
            </Item>
            <Item>
              <Label>Color</Label>
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
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="New">New</MenuItem>
                  <MenuItem value="Used">Used</MenuItem>
                </Select>
              </FormControl>
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
                  {sizes.map((s) => (
                    <SmallItem>
                      <Label>{s.size}</Label>:
                      <SizeInput
                        mode={mode}
                        onChange={(e) =>
                          smallSizeHandler(s.size, e.target.value)
                        }
                      />
                      {/* <FontAwesomeIcon
                        onClick={() => deleteSizeHandler(s.size)}
                        icon={faTimes}
                      /> */}
                    </SmallItem>
                  ))}
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
                    <BigImage src={image1} alt="product image" />
                  ) : (
                    <AddImage htmlFor="image1">
                      {loadingUpload ? (
                        <LoadingBox></LoadingBox>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faImage} />
                          <div>
                            Click to Browse <span>Image</span>
                          </div>
                          <Upload
                            type="file"
                            id="image1"
                            onChange={(e) => uploadHandler(e, 'image1')}
                          />
                        </>
                      )}
                    </AddImage>
                  )}
                </BigImageC>
                <BigImageC mode={mode}>
                  {image2 ? (
                    <BigImage src={image2} alt="product image" />
                  ) : (
                    <AddImage htmlFor="image2">
                      {loadingUpload ? (
                        <LoadingBox></LoadingBox>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faImage} />
                          <div>
                            Click to Browse <span>Image</span>
                          </div>
                          <Upload
                            type="file"
                            id="image2"
                            onChange={(e) => uploadHandler(e, 'image2')}
                          />
                        </>
                      )}
                    </AddImage>
                  )}
                </BigImageC>
                <SmallImageRow>
                  <SmallImageC mode={mode}>
                    {image3 ? (
                      <SmallImage src={image3} alt="product image" />
                    ) : (
                      <AddImage htmlFor="image3">
                        {loadingUpload ? (
                          <LoadingBox></LoadingBox>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faImage} />
                            <div>
                              Click to Browse <span>Image</span>
                            </div>
                            <Upload
                              type="file"
                              id="image3"
                              onChange={(e) => uploadHandler(e, 'image3')}
                            />
                          </>
                        )}
                      </AddImage>
                    )}
                  </SmallImageC>
                  <SmallImageC mode={mode}>
                    {image4 ? (
                      <SmallImage src={image4} alt="product image" />
                    ) : (
                      <AddImage htmlFor="image4">
                        {loadingUpload ? (
                          <LoadingBox></LoadingBox>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faImage} />
                            <div>
                              Click to Browse <span>Image</span>
                            </div>
                            <Upload
                              type="file"
                              id="image4"
                              onChange={(e) => uploadHandler(e, 'image4')}
                            />
                          </>
                        )}
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
              <ImageRow>
                <div>
                  <ItemCheck>
                    <Checkbox
                      type="checkbox"
                      checked={luxury}
                      onChange={(e) => setLuxury(e.target.checked)}
                    />
                    <Label>Luxury</Label>
                  </ItemCheck>
                  <ItemCheck>
                    <Checkbox
                      checked={vintage}
                      type="checkbox"
                      onChange={(e) => setVintage(e.target.checked)}
                    />
                    <Label>Vintage</Label>
                  </ItemCheck>
                </div>
                {vintage || luxury ? (
                  <VimageCont>
                    <BigImageC mode={mode}>
                      {luxuryImage ? (
                        <BigImage src={luxuryImage} alt="product image" />
                      ) : (
                        <AddImage htmlFor="image1">
                          {loadingUpload ? (
                            <LoadingBox></LoadingBox>
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faImage} />
                              <div>
                                Click to Browse <span>Image</span>
                              </div>
                              <Upload
                                type="file"
                                id="image1"
                                onChange={(e) => uploadHandler(e, 'luxury')}
                              />
                            </>
                          )}
                        </AddImage>
                      )}
                    </BigImageC>
                  </VimageCont>
                ) : (
                  ''
                )}
              </ImageRow>

              <Item>
                <Label>Description</Label>
                <TextArea
                  mode={mode}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Item>
              <Item>
                <Label>Specification</Label>
                <TextArea
                  mode={mode}
                  onChange={(e) => setSpecification(e.target.value)}
                />
              </Item>
              <Item>
                <Label>Key Features</Label>
                <TextArea
                  mode={mode}
                  onChange={(e) => setFeature(e.target.value)}
                />
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
                    value={feature}
                    onChange={(e) => setFeature(e.target.value)}
                    displayEmpty
                  >
                    <MenuItem value="New">New</MenuItem>
                    <MenuItem value="Used">Used</MenuItem>
                  </Select>
                </FormControl>
              </Item>
            </Top>
            <ButtonC>
              <Error>{formError}</Error>
              <Button type="submit">Add Product</Button>
            </ButtonC>
          </Right>
        </Form>
      </Content>
    </NewProductC>
  );
}
