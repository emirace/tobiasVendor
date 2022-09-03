import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState, useEffect, useReducer } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Chart from "./Chart";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Store } from "../../Store";
import axios from "axios";
import { getError } from "../../utils";
import LoadingBox from "../LoadingBox";

const ProductC = styled.div`
  flex: 4;
  padding: 20px;
`;

const ProductTitleCont = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Title = styled.h1``;
const AddButton = styled.button`
  width: 80px;
  border: none;
  padding: 5px;
  background: var(--orange-color);
  color: var(--white-color);
  border-radius: 0.2rem;
  cursor: pointer;
`;

const Top = styled.div`
  display: flex;
`;
const Bottom = styled.div`
  padding: 20px;
  margin: 20px;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
`;
const TopLeft = styled.div`
  flex: 1;
`;
const TopRight = styled.div`
  flex: 1;
  padding: 20px;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  margin: 20px;
  border-radius: 0.2rem;
`;
const InfoTop = styled.div`
  display: flex;
  align-items: center;
`;
const InfoBottom = styled.div`
  margin-top: 10px;
  & a {
    color: var(--orange-color);
    font-size: 14px;
  }
`;
const Image = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
`;
const Name = styled.div`
  font-weight: 600;
`;
const InfoItem = styled.div`
  width: 50%;
  display: flex;
  justify-content: space-between;
`;
const InfoKey = styled.span``;
const InfoValue = styled.span`
  font-weight: 300;
`;

const Form = styled.form`
  display: flex;
  justify-content: space-between;
`;
const FormLeft = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;
const FormCenter = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;
const FormRight = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
`;
const Input = styled.input`
  width: 250px;
  margin-bottom: 10px;
  border: none;
  padding: 5px;
  color: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--white-color)"
      : "var(--black-color)"};
  border-bottom: 1px solid
    ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev3)" : "var(--light-ev3)"};
  background: none;
  &:focus-visible {
    outline: none;
    border-bottom: 1px solid var(--orange-color);
  }
`;
const Label = styled.label`
  margin-bottom: 10px;
  margin-top: 15px;

  font-size: 14px;
`;
const Upload = styled.div`
  display: flex;
  align-items: center;
  margin-top: 15px;
`;
const UploadImg = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  object-fit: cover;
  margin-right: 20px;
  object-position: top;
`;
const Button = styled.button`
  border: none;
  padding: 5px;
  border-radius: 0.2rem;
  background: var(--orange-color);
  color: var(--white-color);
  cursor: pointer;
`;
const UploadInput = styled.input`
  display: none;
`;
const Gender = styled.div`
  display: flex;
  align-items: center;

  & input {
    width: auto;
    margin: 0;
    &::after {
      width: 15px;
      height: 15px;
      content: "";
      display: inline-block;
      visibility: visible;
      border-radius: 15px;
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
      border-radius: 15px;
      position: relative;
      top: -2px;
      left: -1px;
      background-color: var(--orange-color);
      border: 1px solid var(--orange-color);
    }
  }
  & label {
    margin: 0 10px;
    font-size: 18px;
    font-weight: 300;
  }
`;
const Item = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  margin-top: 10px;
  margin-right: 20px;
  &.half {
    width: 118px;
    margin-right: 5px;
  }
`;

const SelBoxGroup = styled.div`
  display: flex;
`;

const SelBox = styled.div`
  margin: 10px 7px 0 0;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 0.2rem;
  padding: 5px;
  background-color: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev3)" : "var(--light-ev3)"};
`;

const TextInput = styled.input`
  background: none;
  color: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--white-color)"
      : "var(--black-color)"};
  border: 1px solid
    ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev4)" : "var(--light-ev4)"};
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
`;
const TextArea = styled.textarea`
  height: 100px;
  border-radius: 0.2rem;
  background: none;
  color: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--white-color)"
      : "var(--black-color)"};
  padding: 10px;
  &:focus-visible {
    outline: 1px solid var(--orange-color);
  }
  border: 1px solid
    ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev4)" : "var(--light-ev4)"};
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
const SizeInput = styled.input`
  background: none;
  font-size: 12px;
  color: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--white-color)"
      : "var(--black-color)"};
  border: 1px solid
    ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev4)" : "var(--light-ev4)"};
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

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true, errorUpload: "" };
    case "UPLOAD_SUCCESS":
      return { ...state, loadingUpload: false, errorUpload: "" };
    case "UPLOAD_FAIL":
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

export default function Product() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo, currency } = state;
  const params = useParams();
  const { id } = params;
  const [product, setProduct] = useState("");

  const [{ loading, error, loadingUpdate, loadingUpload }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: "",
    });

  const [name, setName] = useState("");
  const [active, setActive] = useState("");
  const [badge, setBadge] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [brand, setBrand] = useState("");
  const [tempsize, setTempsize] = useState("");
  const [specification, setSpecification] = useState("");
  const [feature, setFeature] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [mainCate, setMainCate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const { data } = await axios.get(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        console.log(data);
        setProduct(data);
        setName(data.name);
        data.active ? setActive("yes") : setActive("no");
        data.badge ? setBadge("yes") : setBadge("no");
        setImage1(data.image);
        setImage2(data.images[0]);
        setImage3(data.images[1]);
        setImage4(data.images[2]);
        setCategory(data.category);
        setDescription(data.description);
        setPrice(data.price);
        setDiscount(data.actualPrice);
        setBrand(data.brand);
        setSpecification(data.specification);
        setFeature(data.keyFeatures);
        setMainCate(data.product);
        setSubCategory(data.subCategory);
        sizes = data.sizes;
      };
      fetchProduct();
    }
  }, [id, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (product.sold) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "You can't edit already checkout product",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    try {
      dispatch({ type: "UPDATE_REQUEST" });
      await axios.put(
        `/api/products/${id}`,
        {
          name,
          price,
          image1,
          badge,
          active,
          image2,
          image3,
          image4,
          mainCate,
          subCategory,
          category,
          brand,
          specification,
          sizes: sizes,
          description,
          feature,
          discount,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: "UPDATE_SUCCESS" });
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Product updated successfully",
          showStatus: true,
          state1: "visible1 success",
        },
      });
      navigate("/dashboard/productlist");
    } catch (err) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Failed updating product, try again late",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      dispatch({ type: "UPDATE_FAIL" });
    }
  };

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/categories`);
        setCategories(data);
        console.log(data);
      } catch (err) {
        console.log(getError(err));
      }
    };
    fetchCategories();
  }, [dispatch]);

  const uploadHandler = async (e, fileType) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    try {
      dispatch({ type: "UPLOAD_REQUEST" });
      const { data } = await axios.post("/api/upload", bodyFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: "UPLOAD_SUCCESS" });
      if (fileType === "image1") {
        setImage1(data.secure_url);
      } else if (fileType === "image2") {
        setImage2(data.secure_url);
      } else if (fileType === "image3") {
        setImage3(data.secure_url);
      } else {
        setImage4(data.secure_url);
      }
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Image Uploaded",
          showStatus: true,
          state1: "visible1 success",
        },
      });
    } catch (err) {
      dispatch({ type: "UPLOAD_FAIL", payload: getError(err) });
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

  const [currentImage, setCurrentImage] = useState("image1");

  const smallSizeHandler = (label, value) => {
    const sizeIndex = sizes.findIndex((x) => x.size === label);
    sizes[sizeIndex].value = value;
  };

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
      sizes.push({ size: sizenow, value: "0" });
    }
    setTempsize(sizenow);
  };

  const productData = [
    {
      name: "Page A",
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
  ];

  const percentage =
    ((product.price - product.actualPrice) / product.price) * 100;
  return (
    <ProductC>
      <ProductTitleCont>
        <Title>Product</Title>
        <Link to="/dashboard/newproduct">
          <AddButton>Create</AddButton>
        </Link>
      </ProductTitleCont>
      <Top>
        <TopLeft>
          <Chart title="Sales Performance" data={productData} dataKey="uv" />
        </TopLeft>
        <TopRight mode={mode}>
          <InfoTop>
            <Image src={product.image} alt="" />
            <Name>{product.name}</Name>
          </InfoTop>
          <InfoBottom>
            <InfoItem>
              <InfoKey>id:</InfoKey>
              <InfoValue>{product._id}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoKey>seller:</InfoKey>
              <InfoValue>
                {console.log("pro", product)}
                {product ? product.seller.username : "loading..."}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoKey>active:</InfoKey>
              <InfoValue>{product.active ? "yes" : "no"}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoKey>in stock:</InfoKey>
              <InfoValue>{product.countInStock > 0 ? "yes" : "no"}</InfoValue>
            </InfoItem>
            <Link to={`/product/${product.slug}`}>
              Click to view full details
            </Link>
          </InfoBottom>
        </TopRight>
      </Top>
      <Bottom mode={mode}>
        <Form onSubmit={submitHandler}>
          <FormLeft>
            <Label>Product Name</Label>
            <Input
              type="text"
              placeholder={name}
              mode={mode}
              onChange={(e) => setName(e.target.value)}
            />
            {userInfo.isAdmin && (
              <>
                <Label>Active</Label>
                <Gender mode={mode}>
                  <Input
                    type="radio"
                    name="active"
                    id="active"
                    value="yes"
                    checked={active === "yes" ? true : false}
                    onChange={(e) => setActive(e.target.value)}
                  />
                  <Label htmlFor="active">Yes</Label>
                  <Input
                    type="radio"
                    name="active"
                    id="active2"
                    value="no"
                    checked={active === "no" ? true : false}
                    onChange={(e) => setActive(e.target.value)}
                  />
                  <Label htmlFor="active2">No</Label>
                </Gender>
                <Label>Badge</Label>
                <Gender mode={mode}>
                  <Input
                    type="radio"
                    name="badge"
                    id="badgeyes"
                    value="yes"
                    checked={badge === "yes" ? true : false}
                    onChange={(e) => setBadge(e.target.value)}
                  />
                  <Label htmlFor="badgeyes">Yes</Label>
                  <Input
                    type="radio"
                    name="badge"
                    id="badgeno"
                    value="no"
                    checked={badge === "no" ? true : false}
                    onChange={(e) => setBadge(e.target.value)}
                  />
                  <Label htmlFor="badgeno">No</Label>
                </Gender>
              </>
            )}
            <Item>
              <Label>Main Category</Label>
              <FormControl
                sx={{
                  margin: 0,
                  borderRadius: "0.2rem",
                  border: `1px solid ${
                    mode === "pagebodydark"
                      ? "var(--dark-ev4)"
                      : "var(--light-ev4)"
                  }`,
                  "& .MuiOutlinedInput-root": {
                    color: `${
                      mode === "pagebodydark"
                        ? "var(--white-color)"
                        : "var(--black-color)"
                    }`,
                    "&:hover": {
                      outline: 0,
                      border: 0,
                    },
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "0 !important",
                  },
                }}
                size="small"
              >
                <Select
                  value={mainCate}
                  onChange={(e) => setMainCate(e.target.value)}
                  displayEmpty
                  inputProps={{
                    "aria-label": "Without label",
                  }}
                >
                  {categories.length > 0 &&
                    categories.map((cat) => (
                      <MenuItem value={cat.name}>{cat.name}</MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Item>

            <Item>
              <Label>Category</Label>
              <FormControl
                sx={{
                  margin: 0,
                  borderRadius: "0.2rem",
                  border: `1px solid ${
                    mode === "pagebodydark"
                      ? "var(--dark-ev4)"
                      : "var(--light-ev4)"
                  }`,
                  "& .MuiOutlinedInput-root": {
                    color: `${
                      mode === "pagebodydark"
                        ? "var(--white-color)"
                        : "var(--black-color)"
                    }`,
                    "&:hover": {
                      outline: 0,
                      border: 0,
                    },
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "0 !important",
                  },
                }}
                size="small"
              >
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  displayEmpty
                  inputProps={{
                    "aria-label": "Without label",
                  }}
                >
                  {categories.length > 0 &&
                    categories.map(
                      (cat) =>
                        cat.name === mainCate &&
                        cat.subCategories.map((sub) => (
                          <MenuItem value={sub.name}>{sub.name}</MenuItem>
                        ))
                    )}
                </Select>
              </FormControl>
            </Item>

            <Item>
              <Label>Sub Category</Label>
              <FormControl
                sx={{
                  margin: 0,
                  borderRadius: "0.2rem",
                  border: `1px solid ${
                    mode === "pagebodydark"
                      ? "var(--dark-ev4)"
                      : "var(--light-ev4)"
                  }`,
                  "& .MuiOutlinedInput-root": {
                    color: `${
                      mode === "pagebodydark"
                        ? "var(--white-color)"
                        : "var(--black-color)"
                    }`,
                    "&:hover": {
                      outline: "none",
                      border: 0,
                    },
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "0 !important",
                  },
                }}
                size="small"
              >
                <Select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  displayEmpty
                >
                  {categories.length > 0 &&
                    categories.map(
                      (cat) =>
                        cat.name === mainCate &&
                        cat.subCategories.map(
                          (sub) =>
                            sub.name === category &&
                            sub.items.map((item, i) => (
                              <MenuItem value={item}>{item}</MenuItem>
                            ))
                        )
                    )}
                </Select>
              </FormControl>
            </Item>

            <Item>
              <Label>Brand</Label>
              <TextInput
                mode={mode}
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </Item>
            <Item>
              <Label>Description</Label>
              <TextArea
                value={description}
                mode={mode}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Item>
          </FormLeft>
          <FormCenter>
            <Price>
              <Item className="half">
                <Label>Price</Label>
                <TextInput
                  mode={mode}
                  type="number"
                  placeholder={product.price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </Item>
              <Item className="half">
                <Label>Discount</Label>
                <Discount>
                  <TextInput
                    placeholder={percentage.toString().substring(0, 5)}
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
                <Offer>
                  {currency}
                  {discount || price}
                </Offer>
                <Actual>
                  {currency}
                  {price}
                </Actual>
              </PriceDisplay>
            </Price>
            <Item>
              <Label>Add Size</Label>
              <FormControl
                sx={{
                  margin: 0,
                  borderRadius: "0.2rem",
                  border: `1px solid ${
                    mode === "pagebodydark"
                      ? "var(--dark-ev4)"
                      : "var(--light-ev4)"
                  }`,
                  "& .MuiOutlinedInput-root": {
                    color: `${
                      mode === "pagebodydark"
                        ? "var(--white-color)"
                        : "var(--black-color)"
                    }`,
                    "&:hover": {
                      outline: "none",
                      border: 0,
                    },
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "0 !important",
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
              {sizes.map((s, index) => (
                <SmallItem key={index}>
                  <Label>{s.size}</Label>:
                  <SizeInput
                    placeholder={s.value}
                    mode={mode}
                    onChange={(e) => smallSizeHandler(s.size, e.target.value)}
                  />
                  {/* <FontAwesomeIcon
                        onClick={() => deleteSizeHandler(s.size)}
                        icon={faTimes}
                      /> */}
                </SmallItem>
              ))}
            </SmallItems>
            <Item>
              <Label>Specification</Label>
              <TextArea
                mode={mode}
                value={specification}
                onChange={(e) => setSpecification(e.target.value)}
              />
            </Item>
            <Item>
              <Label>Key Features</Label>
              <TextArea
                value={feature}
                mode={mode}
                onChange={(e) => setFeature(e.target.value)}
              />
            </Item>
          </FormCenter>
          <FormRight>
            <div>
              <Upload>
                {!loadingUpload ? (
                  <UploadImg
                    src={
                      currentImage === "image1"
                        ? image1
                        : currentImage === "image2"
                        ? image2
                        : currentImage === "image3"
                        ? image3
                        : currentImage === "image4"
                        ? image4
                        : ""
                    }
                    alt=""
                  />
                ) : (
                  <LoadingBox />
                )}

                <Label htmlFor="file">
                  <FontAwesomeIcon icon={faUpload} />
                </Label>
                <UploadInput
                  type="file"
                  id="file"
                  onChange={(e) => uploadHandler(e, currentImage)}
                />
              </Upload>
              <SelBoxGroup>
                <SelBox onClick={() => setCurrentImage("image1")} mode={mode}>
                  1
                </SelBox>
                <SelBox onClick={() => setCurrentImage("image2")} mode={mode}>
                  2
                </SelBox>
                <SelBox onClick={() => setCurrentImage("image3")} mode={mode}>
                  3
                </SelBox>
                <SelBox onClick={() => setCurrentImage("image4")} mode={mode}>
                  4
                </SelBox>
              </SelBoxGroup>
            </div>
            <Button type="submit">Update</Button>
          </FormRight>
        </Form>
      </Bottom>
    </ProductC>
  );
}
