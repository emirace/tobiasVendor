import {
  faCheck,
  faCheckCircle,
  faQuestionCircle,
  faTimes,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
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
import MessageImage from "../MessageImage";
import ModelLogin from "../ModelLogin";
import Condition from "../Condition";
import SmallModel from "../SmallModel";
import AddOtherBrand from "../AddOtherBrand";
import FeeStructure from "../info/FeeStructure";
import DeliveryOption from "./DeliveryOption";

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
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;
const Bottom = styled.div`
  padding: 20px;
  margin: 20px;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  @media (max-width: 992px) {
    margin: 20px 5px;
  }
`;
const TopLeft = styled.div`
  flex: 1;
`;
const TopRight = styled.div`
  flex: 1;
  padding: 20px;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  margin: 0 20px;
  border-radius: 0.2rem;
  @media (max-width: 992px) {
    margin: 10px 5px;
  }
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
  align-items: center;
  width: 100%;
`;
const InfoKey = styled.span`
  text-transform: capitalize;
  flex: 1;
`;
const InfoValue = styled.span`
  font-weight: 300;
  text-transform: capitalize;
  flex: 1;
`;

const Form = styled.form`
  display: flex;
  justify-content: space-between;
  @media (max-width: 992px) {
    flex-direction: column;
  }
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
  margin-top: 10px;
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
  position: relative;
  display: flex;
  flex-direction: column;
  width: 400px;
  margin-top: 10px;
  margin-right: 20px;
  &.half {
    width: 118px;
    margin-right: 5px;
  }
  @media (max-width: 992px) {
    width: 100%;
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
  @media (max-width: 992px) {
    align-items: start;
    flex-direction: column;
  }
`;
const Discount = styled.div`
  display: flex;
  align-items: center;
`;
const PriceDisplay = styled.div`
  display: flex;
  margin: 10px;
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

const SoldAdd = styled.div`
  color: white;
  padding: 5px;
  border-radius: 0.2rem;
  margin: 10px 0;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Tips = styled.span`
  position: relative;
  &:hover::after {
    content: "${(props) => props.tips}";
    width: 350px;
    position: absolute;
    border-radius: 0.5rem;
    left: 30px;
    text-align: justify;
    font-size: 14px;
    z-index: 2;
    line-height: 1.2;
    font-weight: 400;
    padding: 10px;
    background: ${(props) =>
      props.mode === "pagebodydark"
        ? "var(--white-color)"
        : "var(--black-color)"};
    color: ${(props) =>
      props.mode === "pagebodydark"
        ? "var(--black-color)"
        : "var(--white-color)"};
    @media (max-width: 992px) {
      width: 250px;
      font-size: 11px;
      top: 20px;
      left: -20px;
    }
  }
`;
const LinkTo = styled.span`
  text-decoration: underline;
  margin-left: 10px;
  font-size: 11px;
  font-weight: 400;
  cursor: pointer;
  &:hover {
    color: var(--orange-color);
  }
`;
const TitleDetails = styled.span`
  width: 70%;
  font-size: 14px;
  line-height: 1.2;
  margin-bottom: 5px;
  @media (max-width: 992px) {
    width: auto;
  }
`;

const BrandList = styled.div`
  position: absolute;
  max-height: 300px;
  overflow: auto;
  top: 120px;
  z-index: 9;
  border-bottom-left-radius: 0.2rem;
  border-bottom-right-radius: 0.2rem;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev2)"};
`;
const BrandListItem = styled.div`
  padding: 10px 20px;
  font-size: 15px;
  cursor: pointer;
  &:hover {
    background: ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev3)" : "var(--light-ev3)"};
  }
`;

const Checkbox = styled.input`
  margin-bottom: 10px;
  margin-right: 10px;
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
    border: 1px solid var(--orange-color);
  }
`;

const Sizes = styled.div`
  display: flex;
  margin: 20px 0;
  gap: 20px;
  @media (max-width: 992px) {
    flex-direction: column;
    gap: 0;
    margin: 0;
  }
`;

const TagInputCont = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid
    ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev4)" : "var(--light-ev4)"};
  border-radius: 0.2rem;
  height: 40px;
`;
const TagInput = styled.input`
  flex: 1;
  background: none;
  color: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--white-color)"
      : "var(--black-color)"};
  border: 0;
  height: 40px;
  padding: 10px;
  &:focus-visible {
    outline: none;
  }
`;
const AddTag = styled.div`
  padding: 2px 5px;
  background: var(--malon-color);
  color: var(--white-color);
  margin: 0 5px;
  cursor: pointer;
`;
const SizeLeft = styled.div`
  flex: 1;
`;
const SizeRight = styled.div`
  display: flex;
  flex: 1;
`;
const Deliv = styled.div`
  display: flex;
  align-items: center;
  & svg {
    margin-right: 10px;
    color: var(--orange-color);
  }
`;
const TagItem = styled.div`
  display: flex;
  padding: 2px 5px;
  margin: 5px;
  align-items: center;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev2)" : "var(--light-ev2)"};
  & svg {
    margin-left: 10px;
    font-size: 11px;
  }
`;

const TagCont = styled.div``;

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
let tags = [];

const color1 = [
  "red",
  "anthracite",
  "beige",
  "black",
  "blue",
  "brown",
  "burgubdy",
  "camel",
  "ecru",
  "gold",
  "green",
  "grey",
  "khaki",
  "metallic",
  "multiculour",
  "navy",
  "orange",
  "pink",
  "purple",
  "silver",
  "turquoise",
  "white",
  "yellow",
];

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

  const [active, setActive] = useState("");
  const [badge, setBadge] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");

  const [showConditionModal, setShowConditionModal] = useState(false);
  const [validationError, setValidationError] = useState({});
  const [showOtherBrand, setShowOtherBrand] = useState(false);
  const [showComissionModal, setShowComissionModal] = useState(false);
  const [showDelivery, setShowDelivery] = useState(false);
  const [countInStock, setCountInStock] = useState(1);
  const [addSize, setAddSize] = useState(sizes.length < 1);
  const [searchBrand, setSearchBrand] = useState(null);
  const [brandQuery, setBrandQuery] = useState("");
  const [deliveryOption, setDeliveryOption] = useState([
    { name: "Pick up from Seller", value: 0 },
  ]);
  const [input, setInput] = useState({
    brand: "",
  });

  const [paxi, setPaxi] = useState(true);
  const [gig, setGig] = useState(false);
  const [pudo, setPudo] = useState(false);
  const [postnet, setPostnet] = useState(false);
  const [aramex, setAramex] = useState(false);
  const [pickup, setPickup] = useState(true);
  const [bundle, setBundle] = useState(false);
  const [meta, setMeta] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const { data } = await axios.get(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setProduct(data);
        data.active ? setActive("yes") : setActive("no");
        data.badge ? setBadge("yes") : setBadge("no");
        setImage1(data.image);
        setImage2(data.images[0]);
        setImage3(data.images[1]);
        setImage4(data.images[2]);
        setPrice(data.price);
        setDiscount(data.actualPrice);
        setDeliveryOption(data.deliveryOption);
        sizes = data.sizes;
        tags = data.tags;
        setInput(data);
      };
      fetchProduct();
    }
  }, [id, userInfo]);

  useEffect(() => {
    const getSearch = async () => {
      const { data } = await axios.get(`/api/brands/search?q=${brandQuery}`);
      console.log(data);
      setSearchBrand(data);
    };
    getSearch();
  }, [brandQuery]);

  const validation = (e) => {
    e.preventDefault();
    var valid = true;
    if (!input.name) {
      handleError("Enter product name", "name");
      valid = false;
    }

    if (!image1) {
      handleError("Add at least one image", "image");
      valid = false;
    }
    if (!input.product) {
      handleError("Select main category", "product");
      valid = false;
    }
    if (!input.subCategory) {
      handleError("Select sub category", "subCategory");
      valid = false;
    }
    if (!input.category) {
      handleError("Select category", "category");
      valid = false;
    }
    if (!input.brand) {
      handleError("Select brand", "brand");
      valid = false;
    }
    if (!price) {
      handleError("Enter a valid price", "price");
      valid = false;
    }
    if (!input.condition) {
      handleError("Select condition", "condition");
      valid = false;
    }

    if (!input.keyFeatures) {
      handleError("Select feature", "keyFeatures");
      valid = false;
    }
    if (!input.color) {
      handleError("Select color", "color");
      valid = false;
    }
    if (addSize) {
      if (countInStock < 1) {
        handleError("Enter count in stock", "sizes");
        valid = false;
      }
    } else {
      if (!sizes.length) {
        handleError("Enter a valid size and quantity available", "sizes");
        valid = false;
      }
    }

    if (valid) {
      submitHandler();
    }
  };
  const submitHandler = async () => {
    if (product.sold && !userInfo.isAdmin) {
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
          name: input.name,
          price,
          image1,
          badge,
          active,
          image2,
          image3,
          image4,
          tags,
          mainCate: input.product,
          subCategory: input.subCategory,
          category: input.category,
          brand: input.brand,
          specification: input.specification,
          sizes: sizes,
          description: input.description,
          condition: input.condition,
          color: input.color,
          material: input.material,
          feature: input.keyFeatures,
          addSize,
          discount: discount || price,
          countInStock,
          deliveryOption,
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
      userInfo !== product.seller._id
        ? navigate("/admin/allProductList/")
        : navigate("/dashboard/productlist");
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

  const handleSold = async () => {
    try {
      const response = await axios.put(
        `/api/admins/soldAll/${id}`,
        {
          // Add any additional request body parameters if needed
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      // Assuming the API returns the updated product in the response body
      const updatedProduct = response.data;
      setProduct(updatedProduct);
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Marked as sold",
          showStatus: true,
          state1: "visible1 success",
        },
      });
    } catch (error) {
      console.error("Error marking product as sold:", getError(error));
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: getError(error),
          showStatus: true,
          state1: "visible1 error",
        },
      });
    }
  };

  const handleOnChange = (text, input) => {
    setInput((prevState) => ({ ...prevState, [input]: text }));
  };
  const handleError = (errorMessage, input) => {
    setValidationError((prevState) => ({
      ...prevState,
      [input]: errorMessage,
    }));
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.target.blur();
    }
  };

  const handleTags = (tag) => {
    if (tag.length > 0) {
      tags.push(tag);
      handleOnChange("", "tag");
    }
  };
  const removeTags = (tag) => {
    console.log(tag);
    const newtags = tags.filter((data) => data != tag);
    tags = newtags;
  };

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
                {product ? product.seller.username : "loading..."}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoKey>product status:</InfoKey>
              <InfoValue
                style={{
                  color: product.active ? "green" : "var(--malon-color)",
                }}
              >
                {product.active ? "active" : "not active"}
              </InfoValue>
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
        <Form onSubmit={validation}>
          <FormLeft>
            <Label>Product Name</Label>
            <Input
              type="text"
              value={input.name}
              mode={mode}
              onChange={(e) => handleOnChange(e.target.value, "name")}
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
                    checked={input.active === "yes" ? true : false}
                    onChange={(e) => handleOnChange(e.target.value, "active")}
                  />
                  <Label htmlFor="active">Yes</Label>
                  <Input
                    type="radio"
                    name="active"
                    id="active2"
                    value="no"
                    checked={input.active === "no" ? true : false}
                    onChange={(e) => handleOnChange(e.target.value, "active")}
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
                    checked={input.badge === "yes" ? true : false}
                    onChange={(e) => handleOnChange(e.target.value, "badge")}
                  />
                  <Label htmlFor="badgeyes">Yes</Label>
                  <Input
                    type="radio"
                    name="badge"
                    id="badgeno"
                    value="no"
                    checked={input.badge === "no" ? true : false}
                    onChange={(e) => handleOnChange(e.target.value, "badge")}
                  />
                  <Label htmlFor="badgeno">No</Label>
                </Gender>
              </>
            )}
            {userInfo.isAdmin && (
              <SoldAdd
                onClick={!product.soldAll && handleSold}
                style={{
                  background: product.soldAll
                    ? "var(--malon-color"
                    : "var(--orange-color)",
                  cursor: product.soldAll ? "not-allowed" : "pointer",
                }}
              >
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  style={{ marginRight: "5px" }}
                />{" "}
                Mark
                {product.soldAll ? "ed" : ""} as sold
              </SoldAdd>
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
                  renderValue={() => input.product}
                  onChange={(e) => handleOnChange(e.target.value, "product")}
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
                  renderValue={() => input.category}
                  onChange={(e) => handleOnChange(e.target.value, "category")}
                  displayEmpty
                  inputProps={{
                    "aria-label": "Without label",
                  }}
                >
                  {categories.length > 0 &&
                    categories.map(
                      (cat) =>
                        cat.name === input.product &&
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
                  renderValue={() => input.subCategory}
                  onChange={(e) =>
                    handleOnChange(e.target.value, "subCategory")
                  }
                  displayEmpty
                >
                  {categories.length > 0 &&
                    categories.map(
                      (cat) =>
                        cat.name === input.product &&
                        cat.subCategories.map(
                          (sub) =>
                            sub.name === input.category &&
                            sub.items.map((item, i) => (
                              <MenuItem value={item}>{item}</MenuItem>
                            ))
                        )
                    )}
                </Select>
              </FormControl>
            </Item>
            <Item>
              <Label>
                Condition{" "}
                <Tips
                  mode={mode}
                  tips={`What happens if I’m not certain of my product condition?
                      Should you not be certain which condition your product falls under when listing, we suggest you choose between the last three option depending on what you see (if your product isn’t NEW or with TAG) and take very clear visible photos indicating every little details. Also, to avoid returns and help you sell fast, give every possible information in your product description so as to clearly inform buyer about your product’s condition.
                      `}
                >
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </Tips>{" "}
                <LinkTo onClick={() => setShowConditionModal(true)}>
                  help?
                </LinkTo>
              </Label>
              <ModelLogin
                setShowModel={setShowConditionModal}
                showModel={showConditionModal}
              >
                <Condition />
              </ModelLogin>
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
                {console.log("input on edit page ", input)}
                <Select
                  renderValue={() => input.condition}
                  onChange={(e) => handleOnChange(e.target.value, "condition")}
                  displayEmpty
                >
                  <MenuItem value="">-- select --</MenuItem>
                  <MenuItem value="New with Tags">New with Tags</MenuItem>
                  <MenuItem value="New with No Tags">New with No Tags</MenuItem>
                  <MenuItem value="Excellent Condition">
                    Excellent Condition
                  </MenuItem>
                  <MenuItem value="Good Condition">Good Condition</MenuItem>
                  <MenuItem value="Fair Condition">Fair Condition</MenuItem>
                </Select>
              </FormControl>
              {validationError.condition && (
                <div style={{ color: "red", fontSize: "12px" }}>
                  {validationError.condition}
                </div>
              )}
            </Item>
            <Item>
              <Label>
                Material/Fabric{" "}
                <Tips
                  mode={mode}
                  tips={`How do I know what the primary material of the product is?
                      This information is mostly indicated on the Product
                      labels, please refer to the label detailing the
                      composition of your Product.`}
                >
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </Tips>
              </Label>

              <TitleDetails>Specify Product's primary material.</TitleDetails>
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
                  renderValue={() => input.material}
                  onChange={(e) => handleOnChange(e.target.value, "material")}
                  displayEmpty
                >
                  <MenuItem value="">-- select --</MenuItem>
                  <MenuItem value="Acrylic">Acrylic</MenuItem>
                  <MenuItem value="Cashmere">Cashmere</MenuItem>
                  <MenuItem value="Cloth">Cloth</MenuItem>
                  <MenuItem value="Cotton">Cotton</MenuItem>
                  <MenuItem value="Exotic leathers">Exotic leathers</MenuItem>
                  <MenuItem value="Faux fur">Faux fur</MenuItem>
                  <MenuItem value="Fur">Fur</MenuItem>
                  <MenuItem value="Leather">Leather</MenuItem>
                  <MenuItem value="Linen">Linen</MenuItem>
                  <MenuItem value="Polyester">Polyester</MenuItem>
                  <MenuItem value="Polyurethane">Polyurethane</MenuItem>
                  <MenuItem value="Pony-style calfskin">
                    Pony-style calfskin
                  </MenuItem>
                  <MenuItem value="Suede">Suede</MenuItem>
                  <MenuItem value="Silk">Silk</MenuItem>
                  <MenuItem value="Rayon">Rayon</MenuItem>
                  <MenuItem value="Synthetic">Synthetic</MenuItem>
                  <MenuItem value="Spandex">Spandex</MenuItem>
                  <MenuItem value="Tweed">Tweed</MenuItem>
                  <MenuItem value="Vegan leather">Vegan leather</MenuItem>
                  <MenuItem value="Velvet">Velvet</MenuItem>
                  <MenuItem value="Wool">Wool</MenuItem>
                </Select>
              </FormControl>
              {validationError.material && (
                <div style={{ color: "red", fontSize: "12px" }}>
                  {validationError.material}
                </div>
              )}
            </Item>

            <Item>
              <Label>Description</Label>
              <TextArea
                value={input.description}
                mode={mode}
                onChange={(e) => handleOnChange(e.target.value, "description")}
              />
            </Item>

            <Item>
              <Label>Delivery Option</Label>
              {deliveryOption.map((d) => (
                <Deliv key={d.name}>
                  <FontAwesomeIcon icon={faCheck} />
                  {d.name}
                </Deliv>
              ))}
              <div
                style={{
                  color: "var(--orange-color)",
                  cursor: "pointer",
                  textAlign: "center",
                }}
                onClick={() => setShowDelivery(true)}
              >
                Add delivery option
              </div>
              <ModelLogin
                setShowModel={setShowDelivery}
                showModel={showDelivery}
              >
                <DeliveryOption
                  setShowModel={setShowDelivery}
                  paxi={paxi}
                  setPaxi={setPaxi}
                  gig={gig}
                  setGig={setGig}
                  pudo={pudo}
                  setPudo={setPudo}
                  aramex={aramex}
                  setAramex={setAramex}
                  postnet={postnet}
                  setPostnet={setPostnet}
                  pickup={pickup}
                  setPickup={setPickup}
                  bundle={bundle}
                  setBundle={setBundle}
                  setDeliveryOption={setDeliveryOption}
                  meta={meta}
                  setMeta={setMeta}
                  deliveryOption={deliveryOption}
                />
                {console.log(deliveryOption)}
              </ModelLogin>
            </Item>

            <Item>
              <Label>Add Tags #</Label>
              <TagCont>
                <TagInputCont>
                  <TagInput
                    mode={mode}
                    value={input.tag}
                    placeholder="Add tags"
                    type="text"
                    onChange={(e) => handleOnChange(e.target.value, "tag")}
                  />
                  <AddTag onClick={() => handleTags(input.tag)}>Add</AddTag>
                </TagInputCont>
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {tags.map((t, i) => (
                    <TagItem mode={mode} key={i}>
                      {t}
                      <FontAwesomeIcon
                        onClick={() => removeTags(t)}
                        icon={faTimes}
                      />
                    </TagItem>
                  ))}
                </div>
              </TagCont>
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
            </Price>{" "}
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
            <TitleDetails>
              <div style={{ color: "red", fontSize: "12px", fontSize: "13px" }}>
                Our Commission
              </div>
              To give you unmatched user experience and support the growth of
              your business as part of our community, you will not be charged
              Repeddle commission fee. To understand how our fee works after the
              grace period, please have a look at our fee structure{" "}
              <span
                onClick={() => setShowComissionModal(true)}
                style={{
                  color: "red",
                  fontSize: "12px",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                here{" "}
              </span>
            </TitleDetails>
            <ModelLogin
              setShowModel={setShowComissionModal}
              showModel={showComissionModal}
            >
              <FeeStructure />
            </ModelLogin>
            <Item>
              <Label>Brands</Label>
              <TitleDetails>
                Can't find the brand you're listing? Search & use Other
              </TitleDetails>
              <TextInput
                mode={mode}
                placeholder="Search Brand"
                type="search"
                onKeyPress={handleKeyPress}
                value={input.brand.length > 0 ? input.brand : brandQuery}
                onChange={(e) => {
                  handleOnChange("", "brand");
                  setBrandQuery(e.target.value);
                }}
                onBlur={() => input.brand.length > 0 && setBrandQuery("")}
              />
              <BrandList mode={mode}>
                {searchBrand &&
                  brandQuery.length > 0 &&
                  [...searchBrand, { name: "Other" }].map((b) => (
                    <BrandListItem
                      key={b._id}
                      mode={mode}
                      onClick={() => {
                        if (b.name === "Other") {
                          setShowOtherBrand(true);
                        } else {
                          handleOnChange(b.name, "brand");
                        }
                        setBrandQuery("");
                      }}
                    >
                      {b.name}
                    </BrandListItem>
                  ))}
              </BrandList>

              <SmallModel
                setShowModel={setShowOtherBrand}
                showModel={showOtherBrand}
              >
                <AddOtherBrand
                  setShowOtherBrand={setShowOtherBrand}
                  handleOnChange={handleOnChange}
                />
              </SmallModel>
              {validationError.brand && (
                <div style={{ color: "red", fontSize: "12px" }}>
                  {validationError.brand}
                </div>
              )}
            </Item>
            <Item>
              <Label>
                Color{" "}
                <Tips
                  mode={mode}
                  tips={`How can I ensure that colour of the 
                  product is clear? For you to get accuracy in 
                  colour. Please take photos using a good source 
                  of natural light to ensure clear colour. The 
                  best and 
                  accurate photos always sale 95% faster`}
                >
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </Tips>
              </Label>
              <TitleDetails>
                Specify the main colour of the product (choose 2 colours
                minimum)
              </TitleDetails>
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
                  renderValue={() => input.color}
                  onChange={(e) => handleOnChange(e.target.value, "color")}
                  displayEmpty
                >
                  <MenuItem value="">-- select --</MenuItem>
                  {color1.map((c) => (
                    <MenuItem key={c} value={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {validationError.color && (
                <div style={{ color: "red", fontSize: "12px" }}>
                  {validationError.color}
                </div>
              )}
            </Item>
            <div>
              <label style={{ marginRight: "10px", marginTop: "20px" }}>
                Item do not require size
              </label>
              <Checkbox
                type="checkbox"
                checked={addSize}
                onChange={(e) => setAddSize(e.target.checked)}
              />
            </div>
            <Sizes style={{ marginTop: "0" }}>
              {!addSize ? (
                <SizeLeft>
                  <>
                    <Item style={{ marginTop: "0" }}>
                      <Label>
                        Add Size{" "}
                        <Tips
                          mode={mode}
                          tips={`If I feel the product and the size seems to differ from what indicated on the label, what should I do?
                  Please be advised to list the product with the size printed on the label. Mentioning the size discrepancy, you noticed in the product description helps a great deal for buyers to make informed size decision. If buyers are forewarned, they will not be disappointed. This minimizes the chances of your products been returned as a result of unfit size.`}
                        >
                          <FontAwesomeIcon icon={faQuestionCircle} />
                        </Tips>
                      </Label>

                      <TagInputCont>
                        <TagInput
                          mode={mode}
                          value={input.selectedSize}
                          type="text"
                          maxlength="3"
                          placeholder="Add size"
                          onChange={(e) =>
                            handleOnChange(e.target.value, "selectedSize")
                          }
                        />
                        <AddTag onClick={() => sizeHandler(input.selectedSize)}>
                          Add
                        </AddTag>
                      </TagInputCont>
                    </Item>
                    <SmallItems>
                      <TitleDetails>
                        Provide the exact size as indicated on your product's
                        label.
                      </TitleDetails>
                      {sizes.map((s) => (
                        <SmallItem>
                          <Label>{s.size}</Label>:
                          <SizeInput
                            placeholder="qty"
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
                  </>
                </SizeLeft>
              ) : (
                <Item style={{ marginTop: "0" }}>
                  <Label>Count in stock</Label>
                  <TextInput
                    mode={mode}
                    type="number"
                    value={countInStock}
                    onChange={(e) => setCountInStock(e.target.value)}
                  />
                </Item>
              )}
            </Sizes>
            {validationError.sizes && (
              <div style={{ color: "red", fontSize: "12px" }}>
                {validationError.sizes}
              </div>
            )}
            <Item>
              <Label>Specification</Label>{" "}
              <TitleDetails>
                FOR CHILDREN'S WEAR/SH0ES, Please manually enter the Size/Age
                brackets as shown on the label of clothes/shoes
              </TitleDetails>
              <TextArea
                mode={mode}
                value={input.specification}
                onChange={(e) =>
                  handleOnChange(e.target.value, "specification")
                }
              />
            </Item>
            <Item>
              <Label>Key Features</Label>
              <TextArea
                value={input.keyFeatures}
                mode={mode}
                onChange={(e) => handleOnChange(e.target.value, "keyFeatures")}
              />
              {validationError.keyFeatures && (
                <div style={{ color: "red", fontSize: "12px" }}>
                  {validationError.keyFeatures}
                </div>
              )}
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
              {validationError.image && (
                <div style={{ color: "red", fontSize: "12px" }}>
                  {validationError.image}
                </div>
              )}
              {userInfo.isAdmin ? (
                product.luxury || product.vintage ? (
                  <MessageImage url={product.luxuryImage} />
                ) : (
                  ""
                )
              ) : (
                ""
              )}
            </div>
            <Button type="submit">Update</Button>
          </FormRight>
        </Form>
      </Bottom>
    </ProductC>
  );
}
