import React, { useContext, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Store } from "../../Store";
import {
  faCheck,
  faClose,
  faImage,
  faQuestionCircle,
  faTimes,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import axios from "axios";
import { getError, region } from "../../utils";
import LoadingBox from "../LoadingBox";
import { useLocation, useNavigate } from "react-router-dom";
import IconsTooltips from "../IconsTooltips";
import ModelLogin from "../ModelLogin";
import Condition from "../Condition";
import CropImage from "../cropImage/CropImage";
import FeeStructure from "../info/FeeStructure";
import { Helmet } from "react-helmet-async";
import DeliveryOption from "./DeliveryOption";
import { resizeImage } from "../ImageUploader";
import VideoTrimmer from "../VideoTrimmer";
import SmallModel from "../SmallModel";
import AddOtherBrand from "../AddOtherBrand";
import { FaChevronRight } from "react-icons/fa";

const NewProductC = styled.div`
  flex: 4;
  margin: 10px 10vw;
  padding: 20px;
  border-radius: 0.2rem;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  @media (max-width: 992px) {
    padding: 10px;
    margin: 0;
  }
`;
const TitleCont = styled.div`
  margin-bottom: 20px;
  @media (max-width: 992px) {
    margin-bottom: 0;
  }
`;
const Title = styled.h1`
  font-size: 28px;
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
  position: relative;
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
  @media (max-width: 992px) {
  }
`;
const Label = styled.label`
  margin-bottom: 10px;
  font-weight: 600;
  & svg {
    margin-left: 10px;
  }
  & .question {
    &:hover {
      color: red;
    }
  }
`;

const ItemCont = styled.div`
  display: flex;
  gap: 20px;
  @media (max-width: 992px) {
    flex-direction: column;
    gap: 0;
  }
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
const ImageRow = styled.div`
  display: flex;
  gap: 5px;
`;
const LuxuryImgCont = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;
const Close = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  width: 30px;
  position: absolute;
  top: 0;
  right: 0;
  border-radius: 50%;
  background: var(--malon-color);
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
      props.mode === "pagebodydark" ? "var(--dark-ev4)" : "var(--light-ev4)"};
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
      props.mode === "pagebodydark" ? "var(--dark-ev4)" : "var(--light-ev4)"};
`;
const SmallImage = styled.img`
  width: 100%;
  height: 100%;
  object-position: top;
  border-radius: 0.2rem;
  object-fit: cover;
`;
const ImageCont = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
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
  @media (max-width: 992px) {
    flex-direction: column;
    gap: 0;
    margin: 0;
  }
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
const Price = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 5px;
`;
const Discount = styled.div`
  display: flex;
  align-items: center;
`;
const PriceDisplayCont = styled.div`
  margin-left: 20px;
`;
const PriceDisplay = styled.div`
  display: flex;
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
  margin-right: 20px;

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
  position: absolute;
  max-height: 300px;
  overflow: auto;
  top: 100px;
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
const ItemCheck = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 20px 0 0;
  width: 100%;
`;
const VimageCont = styled.div`
  flex: 1;
  width: 150px;
  // height: 150px;
  margin-top: 20px;
`;
const VintageCont = styled.div`
  flex: 1;
`;
const Tips = styled.span`
  position: relative;
  &:hover::after {
    content: "${(props) => props.tips}";
    width: 340px;
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
const LuxuryCont = styled.div`
  display: flex;
  flex-direction: column;
`;
const TagCont = styled.div``;
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

const Deliv = styled.div`
  display: flex;
  align-items: center;
  & svg {
    margin-right: 10px;
    color: var(--orange-color);
  }
`;

const Switch = styled.input.attrs({
  type: "checkbox",
  id: "darkmodeSwitch",
  role: "switch",
})`
  position: relative;

  width: 40px;
  height: 15px;
  -webkit-appearance: none;
  background: #d4d4d4;
  border-radius: 20px;
  outline: none;
  transition: 0.5s;
  @media (max-width: 992px) {
  }

  &:checked {
    background: ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev4)" : "#fcf0e0"};
    &:before {
      left: 25px;
      background: var(--orange-color);
    }
  }
  &:before {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    content: "";
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    background: grey;
    transition: 0.5s;
  }
`;

const ItemNum = styled.div`
  display: flex;
  margin-bottom: 10px;
`;
const Key = styled.div`
  flex: 3;
`;
const Value = styled.div`
  flex: 1;
`;

const AddSize = styled.div`
  margin-bottom: 10px;
  font-weight: 600;
  cursor: pointer;
  & svg {
    margin-left: 10px;
  }
`;

const reducer = (state, action) => {
  switch (action.type) {
    case "CREATE_REQUEST":
      return { ...state, loading: true };
    case "CREATE_SUCCESS":
      return { ...state, loading: false, error: "" };
    case "CREATE_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true };
    case "UPLOAD_SUCCESS":
      return { ...state, loadingUpload: false, errorUpload: "" };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false, errorUpload: action.payload };
    case "VIDEO_REQUEST":
      return { ...state, loadingVideo: true };
    case "VIDEO_SUCCESS":
      return {
        ...state,
        loadingVideo: false,
        video: action.payload,
        errorUpload: "",
      };
    case "REMOVE_VIDEO":
      return { ...state, video: "" };
    case "VIDEO_FAIL":
      return {
        ...state,
        loadingVideo: false,
        errorUpload: action.payload,
      };

    default:
      return state;
  }
};

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
  "other",
];
export default function NewProduct() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo, currency } = state;

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const productId = sp.get("id");
  const [sizes, setSizes] = useState([]);
  const [validated, setValidated] = useState(false);
  const [formError, setFormError] = useState("");
  const [deliveryOption, setDeliveryOption] = useState([
    { name: "Pick up from Seller", value: 0 },
  ]);
  const [showConditionModal, setShowConditionModal] = useState(false);
  const [showUploadingVideo, setShowUploadingVideo] = useState(false);
  const [showUploadingImage, setShowUploadingImage] = useState(false);
  const [currentImage, setCurrentImage] = useState("");
  const [showComissionModal, setShowComissionModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [showDelivery, setShowDelivery] = useState(false);

  const [input, setInput] = useState({
    brand: "",
  });
  const [validationError, setValidationError] = useState({});

  const [paxi, setPaxi] = useState(region() === "ZAR");
  const [gig, setGig] = useState(false);
  const [pudoLocker, setPudoLocker] = useState(false);
  const [pudoDoor, setPudoDoor] = useState(false);
  const [postnet, setPostnet] = useState(false);
  const [aramex, setAramex] = useState(false);
  const [pickup, setPickup] = useState(true);
  const [bundle, setBundle] = useState(false);
  const [meta, setMeta] = useState({});
  const [showOtherBrand, setShowOtherBrand] = useState(false);

  const [addSize, setAddSize] = useState(productId ? sizes.length < 1 : false);
  const [countInStock, setCountInStock] = useState(1);

  const navigate = useNavigate();

  const [
    { loading, error, loadingVideo, video, loadingUpload, errorUpload },
    dispatch,
  ] = useReducer(reducer, {
    loading: false,
    error: "",
    loadingUpload: false,
    errorUpload: "",
    video: null,
  });

  const [categories, setCategories] = useState([]);
  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        try {
          const { data } = await axios.get(`/api/products/slug/${productId}`);
          console.log(data);
          setInput((prev) => ({
            ...data,
            image1: data.image,
            image2: data.images[0],
            image3: data.images[1],
            image4: data.images[2],
            discount: data.actualPrice,
          }));
          setDeliveryOption(data.deliveryOption);
          setSizes(data.sizes);
          setAddSize(data.sizes.length < 1);
          tags = data.tags;
        } catch (err) {
          console.log(getError(err));
        }
      }
    };
    fetchProduct();
  }, [productId]);

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

  const [searchBrand, setSearchBrand] = useState(null);
  const [brandQuery, setBrandQuery] = useState("");
  useEffect(() => {
    console.log(brandQuery);
    const getSearch = async () => {
      const { data } = await axios.get(`/api/brands/search?q=${brandQuery}`);
      console.log(data);
      setSearchBrand(data);
    };
    getSearch();
  }, [brandQuery]);

  const sizeHandler = (sizenow) => {
    if (!sizenow) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Please enter size",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }

    const exist = sizes.some((s) => s.size === sizenow);

    if (exist) {
      const newSizes = sizes.filter((s) => s.size !== sizenow);
      setSizes(newSizes);
    } else {
      setSizes((prevSizes) => [...prevSizes, { size: sizenow, value: "1" }]);
    }

    setInput((prev) => ({ ...prev, selectedSize: "" }));
  };

  const handleTags = (tag) => {
    if (tag.includes(" ")) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Please remove space",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    if (tag.includes("#")) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Tags cannot contain the '#' character",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    if (tags.length > 5) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "You can't add more five tags ",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    if (tag.length > 0) {
      tags.push(tag);
      handleOnChange("", "tag");
    }
  };
  const removeTags = (tag) => {
    console.log(tag);
    const newtags = tags.filter((data) => data != tag);
    tags = newtags;
    setRefresh(!refresh);
  };

  const submitHandler = async () => {
    setFormError("");
    if (addSize === false && sizes.length === 0) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Please add size",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    try {
      dispatch({ type: "CREATE_REQUEST" });
      await axios.post(
        `/api/products/${region()}`,
        {
          name: input.name,
          image1: input.image1,
          image2: input.image2,
          image3: input.image3,
          image4: input.image4,
          video,
          product: input.product,
          subCategory: input.subCategory,
          category: input.category,
          description: input.description,
          brand: input.brand,
          discount: input.discount || input.price,
          deliveryOption,
          meta: meta,
          tags,
          price: input.price,
          location: input.location,
          specification: input.specification,
          sizes: sizes,
          condition: input.condition,
          feature: input.feature,
          currency,
          luxury: input.luxury,
          vintage: input.vintage,
          material: input.material,
          color: input.color,
          luxuryImage: input.luxuryImage,
          addSize,
          countInStock,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Product created successfully",
          showStatus: true,
          state1: "visible1 success",
        },
      });
      dispatch({ type: "CREATE_SUCCESS" });
      navigate(`/dashboard/productlist`);
    } catch (err) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: getError(err),
          showStatus: true,
          state1: "visible1 error",
        },
      });
      console.log(getError(err));
      dispatch({ type: "CREATE_FAIL" });
    }
  };

  const validation = (e) => {
    e.preventDefault();
    var valid = true;
    if (!input.name) {
      handleError("Enter product name", "name");
      valid = false;
    }

    if (!input.image1) {
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
    if (!input.price) {
      handleError("Enter a valid price", "price");
      valid = false;
    }
    if (!input.location) {
      handleError("Select location", "location");
      valid = false;
    }
    if (!input.condition) {
      handleError("Select condition", "condition");
      valid = false;
    }

    if (!input.description) {
      handleError("Enter description", "description");
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
      if (!sizes.length || sizes.some((obj) => !obj.value)) {
        handleError("Enter a valid size and quantity available", "sizes");
        valid = false;
      }
    }

    if (valid) {
      submitHandler();
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
    if (errorMessage) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: errorMessage,
          showStatus: true,
          state1: "visible1 error",
        },
      });
    }
  };

  const [currentSizeValue, setCurrentSizeValue] = useState("");

  const smallSizeHandler = (label, value) => {
    setSizes((prevSizes) => {
      const sizeIndex = prevSizes.findIndex((x) => x.size === label);
      if (sizeIndex !== -1) {
        const updatedSizes = [...prevSizes];
        updatedSizes[sizeIndex].value = value;
        return updatedSizes;
      }
      return prevSizes;
    });
    setCurrentSizeValue(value);
  };

  const deleteSizeHandler = (label) => {
    const newsizes = sizes.filter((s) => {
      return s.size !== label;
    });
    setSizes(newsizes);
  };

  const videouploadHandler = async (e) => {
    const file = e.target.files[0];
    const maxSize = 8 * 1024 * 1024; // 8MB

    // Check if the file size exceeds the maximum allowed size
    if (file.size > maxSize) {
      // Show an error message or perform any necessary action
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Request Failed: Video shouldn't be more than 8mb",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }

    const bodyFormData = new FormData();
    bodyFormData.append("file", file);

    try {
      dispatch({ type: "VIDEO_REQUEST" });
      const { data } = await axios.post(
        "/api/upload/video/upload",
        bodyFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      console.log(data);
      dispatch({ type: "VIDEO_SUCCESS", payload: data.secure_url });

      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Video Uploaded",
          showStatus: true,
          state1: "visible1 success",
        },
      });
    } catch (error) {
      dispatch({ type: "VIDEO_FAIL" });
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

  const uploadHandler = async (file, fileType) => {
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
        handleOnChange(data.secure_url, "image1");
      } else if (fileType === "image2") {
        handleOnChange(data.secure_url, "image2");
      } else if (fileType === "image3") {
        handleOnChange(data.secure_url, "image3");
      } else if (fileType === "image4") {
        handleOnChange(data.secure_url, "image4");
      } else if (fileType === "luxury") {
        handleOnChange(data.secure_url, "luxuryImage");
      } else {
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
          message: "File size is too large,",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      console.log(getError(err));
    }
  };

  const [showSelect, setShowSelect] = useState(false);
  let brands = ["Nike", "Gucci", "Rolex", "Louis Vuitto", "Adidas", "Dior"];
  const handleSelect = (b) => {
    handleOnChange(b, "brand");
    setShowSelect(false);
  };
  if (input.brand) {
    brands = brands.filter((i) => {
      return i.toLowerCase().match(input.brand);
    });
  }
  const [invalidImage, setInvalidImage] = useState("");
  const [resizeImage1, setResizeImage] = useState({
    file: [],
    filepreview: null,
  });
  useEffect(() => {
    const uploadImage = async () => {
      console.log("files", invalidImage, resizeImage1);
      try {
        if (!invalidImage && resizeImage1.filepreview) {
          await uploadHandler(resizeImage1.file, "luxury");
          // setLuxuryImage(resizeImage1.filepreview);
        }
      } catch (err) {
        console.log(getError(err));
      }
    };
    uploadImage();
  }, [resizeImage1]);

  const handleLuxury = async (e) => {
    resizeImage(e, setInvalidImage, setResizeImage);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.target.blur();
    }
  };

  const discount = () => {
    if (parseInt(input.price) < parseInt(input.discount)) return null;
    return (
      ((parseInt(input.price) - parseInt(input.discount)) /
        parseInt(input.price)) *
      100
    );
  };

  const [showTopInfo, setShowTopInfo] = useState(false);
  const [showSizes, setShowSizes] = useState(false);

  const costPrice = input.discount
    ? parseInt(input.discount) < parseInt(input.price)
      ? `${currency}${input.price}`
      : null
    : null;
  const sellingPrice = input.discount
    ? parseInt(input.discount)
    : parseInt(input.price);

  return (
    <NewProductC mode={mode}>
      {console.log(input)}
      <Helmet>
        <title>New Product</title>
      </Helmet>
      <TitleCont>
        <Title>NewProduct</Title>
        <div
          style={{ color: "red", textAlign: "center", cursor: "pointer" }}
          onClick={() => setShowTopInfo(!showTopInfo)}
        >
          How to add an item?
        </div>
        <div
          style={{
            height: showTopInfo ? "auto" : "0",
            transition: "height ease-in-out 0.5s",
            overflow: "hidden",
            fontSize: "14px",
            marginBottom: "5px",
          }}
        >
          When adding product, do not ignore to fill all relevant fields and
          following the product adding rules. Always remember; The best picture
          and descriptions sells faster. Ensure to upload high quality product
          photos with all details showing.
        </div>
      </TitleCont>
      <Content>
        <Form noValidate validated={validated} onSubmit={validation}>
          <Left>
            <Item>
              <Label>Product Name</Label>
              <TextInput
                mode={mode}
                value={input.name}
                type="text"
                onChange={(e) => handleOnChange(e.target.value, "name")}
              />
              {validationError.name && (
                <div style={{ color: "red", fontSize: "12px" }}>
                  {validationError.name}
                </div>
              )}
            </Item>
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
                  <MenuItem value="">-- select --</MenuItem>
                  {categories.length > 0 &&
                    categories.map(
                      (cat) =>
                        cat.isCategory && (
                          <MenuItem value={cat.name}>{cat.name}</MenuItem>
                        )
                    )}
                </Select>
              </FormControl>
              {validationError.product && (
                <div style={{ color: "red", fontSize: "12px" }}>
                  {validationError.product}
                </div>
              )}
            </Item>
            <ItemCont>
              <ItemLeft>
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
                      onChange={(e) =>
                        handleOnChange(e.target.value, "category")
                      }
                      displayEmpty
                      inputProps={{
                        "aria-label": "Without label",
                      }}
                    >
                      <MenuItem value="">-- select --</MenuItem>
                      {categories.length > 0 &&
                        categories.map(
                          (cat) =>
                            cat.name === input.product &&
                            cat.subCategories.map(
                              (sub) =>
                                sub.isCategory && (
                                  <MenuItem value={sub.name}>
                                    {sub.name}
                                  </MenuItem>
                                )
                            )
                        )}
                    </Select>
                  </FormControl>
                  {validationError.category && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {validationError.category}
                    </div>
                  )}
                </Item>
              </ItemLeft>
              <ItemRight>
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
                      <MenuItem value="">-- select --</MenuItem>
                      {categories.length > 0 &&
                        categories.map(
                          (cat) =>
                            cat.name === input.product &&
                            cat.subCategories.map(
                              (sub) =>
                                sub.name === input.category &&
                                sub.items.map(
                                  (item, i) =>
                                    item.isCategory && (
                                      <MenuItem value={item.name}>
                                        {item.name}
                                      </MenuItem>
                                    )
                                )
                            )
                        )}
                    </Select>
                  </FormControl>
                  {validationError.subCategory && (
                    <div style={{ color: "red", fontSize: "12px" }}>
                      {validationError.subCategory}
                    </div>
                  )}
                </Item>
              </ItemRight>
            </ItemCont>
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
                Material
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
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
              {validationError.material && (
                <div style={{ color: "red", fontSize: "12px" }}>
                  {validationError.material}
                </div>
              )}
            </Item>
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
                value={input.brand.length ? input.brand : brandQuery}
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
                Color
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
            <Item style={{ marginBottom: "15px" }}>
              <AddSize onClick={() => setShowSizes(!showSizes)}>
                Add Size
                <Tips
                  mode={mode}
                  tips={`If I feel the product and the size seems to differ from what indicated on the label, what should I do?
                  Please be advised to list the product with the size printed on the label. Mentioning the size discrepancy, you noticed in the product description helps a great deal for buyers to make informed size decision. If buyers are forewarned, they will not be disappointed. This minimizes the chances of your products been returned as a result of unfit size.`}
                >
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </Tips>
              </AddSize>

              {showSizes && (
                <div>
                  <div
                    style={{
                      fontSize: "10px",
                      maxWidth: "300px",
                      marginBottom: "10px",
                    }}
                  >
                    Please include size for items that requires size, EG: Shoes,
                    Clothes Etc. For item that does not require size, EG: Books,
                    Cups, Etc. Kindly switch to "ITEM DO NOT REQUIRE SIZE"
                    button.
                  </div>
                  <div
                    style={{
                      display: "flex",
                      marginBottom: "10px",
                      alignItems: "center",
                    }}
                  >
                    <label style={{ marginRight: "10px" }}>
                      Item do not require size
                    </label>
                    <Switch
                      mode={mode}
                      checked={addSize}
                      onChange={(e) => {
                        setSizes([]);
                        setAddSize(e.target.checked);
                      }}
                    />
                  </div>
                  {!addSize ? (
                    <>
                      <Item style={{ marginTop: "0" }}>
                        <TagInputCont>
                          <TagInput
                            mode={mode}
                            value={input.selectedSize}
                            type="text"
                            maxlength={4}
                            placeholder="Add  size"
                            onChange={(e) => {
                              handleOnChange(
                                e.target.value.slice(0, 4),
                                "selectedSize"
                              );
                              handleError("", "sizes");
                            }}
                          />
                          <AddTag
                            onClick={() => sizeHandler(input.selectedSize)}
                          >
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
                              value={s.value}
                              maxLength={4}
                              onChange={(e) => {
                                const inputValue = e.target.value.slice(0, 4);
                                smallSizeHandler(s.size, inputValue);
                                handleError("", "sizes");
                              }}
                            />
                            <FontAwesomeIcon
                              onClick={() => deleteSizeHandler(s.size)}
                              icon={faTimes}
                            />
                          </SmallItem>
                        ))}
                      </SmallItems>
                    </>
                  ) : (
                    <div style={{ marginTop: "0" }}>
                      <Label style={{ marginRight: "15px" }}>
                        Count in stock
                      </Label>
                      <TextInput
                        mode={mode}
                        type="number"
                        value={countInStock}
                        onChange={(e) => setCountInStock(e.target.value)}
                      />
                    </div>
                  )}
                </div>
              )}

              {validationError.sizes && (
                <div style={{ color: "red", fontSize: "12px" }}>
                  {validationError.sizes}
                </div>
              )}
            </Item>

            <Item style={{ marginTop: "0" }}>
              <Label>
                Shipping Location
                <Tips
                  mode={mode}
                  tips={`Please select if your product can be shipped anywhere around
                      your country. If you're in Nigeria, Only select Nigeria. If
                      you are selling in South Africa only select South Africa`}
                >
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </Tips>
              </Label>
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
                  renderValue={() => input.location}
                  onChange={(e) => handleOnChange(e.target.value, "location")}
                  displayEmpty
                >
                  <MenuItem value="Nigeria">Nigeria</MenuItem>
                  <MenuItem value="South Africa">South Africa</MenuItem>
                </Select>
              </FormControl>
              {validationError.location && (
                <div style={{ color: "red", fontSize: "12px" }}>
                  {validationError.location}
                </div>
              )}
            </Item>

            <Price>
              <Item className="half">
                <Label>
                  Cost Price{" "}
                  <Tips
                    mode={mode}
                    tips={`
                  Any price suggestion for my product? We encourage you to be as reasonable as possible, as over prized products are turn off to buyers. Keep in mind that our community are experienced secondhand THRIFT buyers & sellers both in vintage and luxury goods and overpricing may affect the sale of your product. However, buyers will appreciate a fairly reasonable price that’s worth the value of your product. Also, bear in mind that there might be competitive product you may be selling on our app or website, hence, be sure to beat any possible competition you can. Offer discounts, promos or free delivery where and when possible as these are great ways to sell FAST! We are doing our best to provide you with competitive goods and price suggestions for similar and previously SOLD products. 
`}
                  >
                    <FontAwesomeIcon icon={faQuestionCircle} />
                  </Tips>
                </Label>
                <TextInput
                  mode={mode}
                  type="number"
                  placeholder="Cost price"
                  value={input.price}
                  onChange={(e) => handleOnChange(e.target.value, "price")}
                />
                {validationError.price && (
                  <div style={{ color: "red", fontSize: "12px" }}>
                    {validationError.price}
                  </div>
                )}
              </Item>
              <Item className="half">
                <Label>Selling Price</Label>
                <Discount>
                  <TextInput
                    className="half"
                    mode={mode}
                    type="number"
                    placeholder="Actual Price"
                    onChange={(e) => handleOnChange(e.target.value, "discount")}
                  />
                </Discount>
              </Item>
            </Price>

            {sellingPrice ? (
              <PriceDisplayCont>
                <PriceDisplay>
                  <Actual>{costPrice}</Actual>
                  <Offer>
                    {currency}
                    {sellingPrice}
                  </Offer>
                </PriceDisplay>{" "}
                {discount() ? (
                  <span style={{ fontSize: "11px", textAlign: "center" }}>
                    {discount().toFixed(0)}% discount
                  </span>
                ) : null}
                <div style={{ fontSize: "12px" }}>
                  <ItemNum>
                    <Key>Total cost:</Key>
                    <Value>
                      {currency}
                      {sellingPrice.toFixed(2)}
                    </Value>
                  </ItemNum>
                  <ItemNum>
                    <Key>Repeddle Commision (7.9%):</Key>
                    <Value>
                      {currency}
                      {((7.9 / 100) * parseInt(sellingPrice)).toFixed(2)}
                    </Value>
                  </ItemNum>
                  <ItemNum>
                    <Key>
                      <Tips
                        mode={mode}
                        tips={`Amount shown here is an estimated withdrawable amount you will receive in your Repeddle wallet. Final amount pay is determined by the delivery cost when product sells`}
                      >
                        <FontAwesomeIcon icon={faQuestionCircle} />
                      </Tips>{" "}
                      Estimated amount you will Receive
                    </Key>
                    <Value>
                      {currency}
                      {((92.1 / 100) * sellingPrice).toFixed(2)}
                    </Value>
                  </ItemNum>
                </div>
              </PriceDisplayCont>
            ) : null}
            <TitleDetails>
              <div
                onClick={() => setShowComissionModal(true)}
                style={{
                  color: "red",
                  fontSize: "12px",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                Our Commission
              </div>
            </TitleDetails>

            <ModelLogin
              setShowModel={setShowComissionModal}
              showModel={showComissionModal}
            >
              <FeeStructure />
            </ModelLogin>
          </Left>
          <Right>
            <Top>
              <Label>
                Product Image{" "}
                <Tips
                  mode={mode}
                  tips={`
                  You will need to add aleast one image and a max of four images.Add clear and quality images. Ensure to follow the image uplaod rules. If image size appears to be too large, you can simply crop the image on your phone and try again. This should reduce the size of the image you're trying upload.`}
                >
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </Tips>
              </Label>
              <ImageRow>
                <BigImageC mode={mode}>
                  {input.image1 ? (
                    <ImageCont>
                      <Close onClick={() => handleOnChange("", "image1")}>
                        <FontAwesomeIcon icon={faClose} />
                      </Close>
                      <BigImage src={input.image1} alt="product image" />
                    </ImageCont>
                  ) : (
                    <AddImage
                      onClick={() => {
                        setCurrentImage("image1");
                        setShowUploadingImage(true);
                      }}
                    >
                      {loadingUpload ? (
                        <LoadingBox></LoadingBox>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faImage} />
                          <div>
                            Click to Browse <span>Image</span>
                          </div>
                        </>
                      )}
                    </AddImage>
                  )}
                </BigImageC>
                <BigImageC mode={mode}>
                  {input.image2 ? (
                    <ImageCont>
                      <Close onClick={() => handleOnChange("", "image2")}>
                        <FontAwesomeIcon icon={faClose} />
                      </Close>
                      <BigImage src={input.image2} alt="product image" />
                    </ImageCont>
                  ) : (
                    <AddImage
                      onClick={() => {
                        setCurrentImage("image2");
                        setShowUploadingImage(true);
                      }}
                    >
                      {loadingUpload ? (
                        <LoadingBox></LoadingBox>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faImage} />
                          <div>
                            Click to Browse <span>Image</span>
                          </div>
                        </>
                      )}
                    </AddImage>
                  )}
                </BigImageC>
                <SmallImageRow>
                  <SmallImageC mode={mode}>
                    {input.image3 ? (
                      <ImageCont>
                        <Close onClick={() => handleOnChange("", "image3")}>
                          <FontAwesomeIcon icon={faClose} />
                        </Close>
                        <SmallImage src={input.image3} alt="product image" />
                      </ImageCont>
                    ) : (
                      <AddImage
                        onClick={() => {
                          setCurrentImage("image3");
                          setShowUploadingImage(true);
                        }}
                      >
                        {loadingUpload ? (
                          <LoadingBox></LoadingBox>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faImage} />
                            <div>
                              Click to Browse <span>Image</span>
                            </div>
                          </>
                        )}
                      </AddImage>
                    )}
                  </SmallImageC>
                  <SmallImageC mode={mode}>
                    {input.image4 ? (
                      <ImageCont>
                        <Close onClick={() => handleOnChange("", "image4")}>
                          <FontAwesomeIcon icon={faClose} />
                        </Close>
                        <SmallImage src={input.image4} alt="product image" />
                      </ImageCont>
                    ) : (
                      <AddImage
                        onClick={() => {
                          setCurrentImage("image4");
                          setShowUploadingImage(true);
                        }}
                      >
                        {loadingUpload ? (
                          <LoadingBox></LoadingBox>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={faImage} />
                            <div>
                              Click to Browse <span>Image</span>
                            </div>
                          </>
                        )}
                      </AddImage>
                    )}

                    <ModelLogin
                      setShowModel={setShowUploadingImage}
                      showModel={showUploadingImage}
                    >
                      <CropImage
                        currentImage={currentImage}
                        uploadHandler={uploadHandler}
                        setShowModel={setShowUploadingImage}
                      />
                    </ModelLogin>

                    {/* <ModelLogin
                      setShowModel={setShowUploadingVideo}
                      showModel={showUploadingVideo}
                    >
                      <VideoTrimmer
                        dispatch={dispatch}
                        ctxDispatch={ctxDispatch}
                      />
                    </ModelLogin> */}
                  </SmallImageC>
                </SmallImageRow>
              </ImageRow>

              {loadingVideo ? (
                <LoadingBox />
              ) : video ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FontAwesomeIcon
                    style={{ marginRight: "20px" }}
                    icon={faVideo}
                  />
                  <span>Video Uploaded</span>
                  <FontAwesomeIcon
                    style={{ marginLeft: "20px" }}
                    icon={faClose}
                    onClick={() => dispatch({ type: "REMOVE_VIDEO" })}
                  />
                </div>
              ) : (
                <label
                  htmlFor="video"
                  style={{
                    display: "block",
                    cursor: "pointer",
                    color: "var(--orange-color)",
                    textAlign: "center",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  Add a short video
                </label>
              )}
              <TitleDetails>
                <span style={{ color: "var(--malon-color)" }}>
                  Please note: Make sure the image you're uploaing is in
                  portrait format and not landscape. Image/Video size should be
                  less than 8MB.
                </span>
              </TitleDetails>
              <input
                type="file"
                onChange={(e) => {
                  videouploadHandler(e);
                  // setShowUploadingVideo(true);
                }}
                id="video"
                style={{ display: "none" }}
              />
              <ImageRow>
                <VintageCont>
                  <ItemCheck>
                    <Label style={{ marginRight: "10px" }}>
                      Luxury
                      <Tips
                        mode={mode}
                        tips={`                  
                          Product that is a well-known luxury brand. Please kindly select this box only if your goods are Luxury product 
`}
                      >
                        <FontAwesomeIcon icon={faQuestionCircle} />
                      </Tips>
                    </Label>
                    <Checkbox
                      type="checkbox"
                      checked={input.luxury}
                      onChange={(e) =>
                        handleOnChange(e.target.checked, "luxury")
                      }
                    />
                  </ItemCheck>
                  <ItemCheck>
                    <Label style={{ marginRight: "10px" }}>
                      Vintage
                      <Tips
                        mode={mode}
                        tips={`                  
                      Product that is at least 15 years old. Please kindly select this box only if your goods are Vintage product
`}
                      >
                        <FontAwesomeIcon icon={faQuestionCircle} />
                      </Tips>
                    </Label>
                    <Checkbox
                      checked={input.vintage}
                      type="checkbox"
                      onChange={(e) =>
                        handleOnChange(e.target.checked, "vintage")
                      }
                    />
                  </ItemCheck>
                </VintageCont>
                {input.vintage || input.luxury ? (
                  <VimageCont>
                    <BigImageC mode={mode}>
                      {input.luxuryImage ? (
                        <LuxuryImgCont>
                          <Close onClick={() => handleOnChange("", "luxury")}>
                            <FontAwesomeIcon icon={faClose} />
                          </Close>
                          <BigImage
                            src={input.luxuryImage}
                            alt="product image"
                          />
                        </LuxuryImgCont>
                      ) : (
                        <AddImage htmlFor="image1">
                          {loadingUpload ? (
                            <LoadingBox></LoadingBox>
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faImage} />
                              <div>“Certificate, invoice, serial number”</div>
                              <Upload
                                type="file"
                                id="image1"
                                onChange={handleLuxury}
                              />
                              {invalidImage && (
                                <div style={{ color: "red", fontSize: "12px" }}>
                                  {invalidImage}
                                </div>
                              )}
                            </>
                          )}
                        </AddImage>
                      )}
                    </BigImageC>
                    <TitleDetails>
                      This information is mandatory for luxury brands. This
                      information will not be publicly displayed. Only use this
                      option if you select any of the above, “Vintage or luxury
                      Product”
                    </TitleDetails>
                  </VimageCont>
                ) : (
                  ""
                )}
              </ImageRow>
              <Item>
                <Label>Description</Label>
                <TextArea
                  mode={mode}
                  value={input.description}
                  placeholder="Describe your product by giving buyers more information. Start with Headline, Condition, Material, Style & Size.

                  Be concise and only use relevant keywords."
                  onChange={(e) =>
                    handleOnChange(e.target.value, "description")
                  }
                />
                {validationError.description && (
                  <div style={{ color: "red", fontSize: "12px" }}>
                    {validationError.description}
                  </div>
                )}
              </Item>
              <Item>
                <Label>Specification</Label>
                <TextArea
                  mode={mode}
                  value={input.specification}
                  placeholder="FOR CHILDREN'S WEAR/SH0ES, Please manually enter the Size/Age
                  brackets as shown on the label of clothes/shoes"
                  onChange={(e) =>
                    handleOnChange(e.target.value, "specification")
                  }
                />
                {validationError.specification && (
                  <div style={{ color: "red", fontSize: "12px" }}>
                    {validationError.specification}
                  </div>
                )}
              </Item>
              <Item>
                <Label>Key Features: Pattern & Printed</Label>
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
                    renderValue={() => input.feature}
                    onChange={(e) => handleOnChange(e.target.value, "feature")}
                    displayEmpty
                  >
                    <MenuItem value="">-- select --</MenuItem>
                    <MenuItem value="Abstract">Abstract</MenuItem>
                    <MenuItem value="Argyle">Argyle</MenuItem>
                    <MenuItem value="Camo">Camo</MenuItem>
                    <MenuItem value="Checked">Checked</MenuItem>
                    <MenuItem value="Chevron & Herringbone">
                      Chevron & Herringbone
                    </MenuItem>
                    <MenuItem value="Color Block">Color Block</MenuItem>
                    <MenuItem value="Crocodile">Crocodile</MenuItem>
                    <MenuItem value="Floral">Floral</MenuItem>
                    <MenuItem value="Gingham">Gingham</MenuItem>
                    <MenuItem value="Graphic">Graphic</MenuItem>
                    <MenuItem value="Houndstooth">Houndstooth</MenuItem>
                    <MenuItem value="Leopard">Leopard</MenuItem>
                    <MenuItem value="Metalic">Metalic</MenuItem>
                    <MenuItem value="Paisley">Paisley</MenuItem>
                    <MenuItem value="Plain">Plain</MenuItem>
                    <MenuItem value="Polkadot">Polkadot</MenuItem>
                    <MenuItem value="Snakeskin">Snakeskin</MenuItem>
                    <MenuItem value="Stripes">Stripes</MenuItem>
                    <MenuItem value="Stars">Stars</MenuItem>
                    <MenuItem value="Solid">Solid</MenuItem>
                    <MenuItem value="Tartan">Tartan</MenuItem>
                    <MenuItem value="Tie-Dye">Tie-Dye</MenuItem>
                    <MenuItem value="Tropical">Tropical</MenuItem>
                    <MenuItem value="Tweed">Tweed</MenuItem>
                    <MenuItem value="Zebra">Zebra</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
                {validationError.feature && (
                  <div style={{ color: "red", fontSize: "12px" }}>
                    {validationError.feature}
                  </div>
                )}
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
                    pudoLocker={pudoLocker}
                    pudoDoor={pudoDoor}
                    setPudoLocker={setPudoLocker}
                    setPudoDoor={setPudoDoor}
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
                <Label>Add Tags</Label>
                <TagCont>
                  <TagInputCont>
                    <TagInput
                      mode={mode}
                      value={input.tag}
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
