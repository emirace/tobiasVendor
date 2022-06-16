import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useState, useEffect, useReducer } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import Chart from "./Chart";
import { Store } from "../../Store";
import axios from "axios";
import { getError } from "../../utils";

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
    width: 150px;
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
`;
const FormRight = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
`;
const Input = styled.input`
    width: 250px;
    margin-bottom: 10px;
    border: none;
    padding: 5px;
    border-bottom: 1px solid
        ${(props) =>
            props.mode === "pagebodydark"
                ? "var(--dark-ev3)"
                : "var(--light-ev3)"};
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
const Upload = styled.form`
    display: flex;
    align-items: center;
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
`;

const SelBoxGroup = styled.div`
    display: flex;
    justify-content: center;
`;

const SelBox = styled.div`
    margin: 5px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.2rem;
    padding: 5px;
    background-color: ${(props) =>
        props.mode === "pagebodydark"
            ? "var(--black-color)"
            : "var(--white-color)"};
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

export default function Product() {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { mode, userInfo } = state;
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
    const [brand, setBrand] = useState("");
    const [countInStock, setCountInStock] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                const { data } = await axios.get(`/api/products/${id}`, {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                });

                setProduct(data);
                setName(data.name);
                setActive(data.active);
                setBadge(data.badge);
            };
            fetchProduct();
        }
    }, [id, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch({ type: "UPDATE_REQUEST" });
            await axios.put(
                `/api/products/${id}`,
                {
                    _id: id,
                    name,
                    price,
                    image1,
                    image2,
                    image3,
                    image4,
                    category,
                    brand,
                    countInStock,
                    description,
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

    const [currentImage, setCurrentImage] = useState('image1');

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
                    <Chart
                        title="Sales Performance"
                        data={productData}
                        dataKey="uv"
                    />
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
                            {console.log(product)}
                            <InfoKey>seller:</InfoKey>
                            <InfoValue>
                                {product
                                    ? product.seller.seller.name
                                    : "loading..."}
                            </InfoValue>
                        </InfoItem>
                        <InfoItem>
                            <InfoKey>active:</InfoKey>
                            <InfoValue>
                                {product.active ? "yes" : "no"}
                            </InfoValue>
                        </InfoItem>
                        <InfoItem>
                            <InfoKey>in stock:</InfoKey>
                            <InfoValue>yes</InfoValue>
                        </InfoItem>
                    </InfoBottom>
                </TopRight>
            </Top>
            <Bottom mode={mode}>
                <Form onSubmit={submitHandler}>
                    <FormLeft>
                        <Label>Product Name</Label>
                        <Input type="text" placeholder={name} />
                        <Label>Active</Label>
                        <Gender mode={mode}>
                            <Input
                                type="radio"
                                name="gender"
                                id="yes"
                                value="yes"
                                checked={
                                    active === "yes"
                                        ? true
                                        : product.active
                                        ? true
                                        : false
                                }
                                onClick={(e) => setActive(e.target.value)}
                            />
                            {console.log(product.active, active)}
                            <Label htmlFor="yes">Yes</Label>
                            <Input
                                type="radio"
                                name="gender"
                                id="no"
                                value="no"
                                checked={
                                    active === "no"
                                        ? true
                                        : !product.active
                                        ? true
                                        : false
                                }
                                onClick={(e) => setActive(e.target.value)}
                            />
                            <Label htmlFor="no">No</Label>
                        </Gender>
                        <Label>Badge</Label>
                        <Gender mode={mode}>
                            <Input
                                type="radio"
                                name="badge"
                                id="yes"
                                value="yes"
                                checked={
                                    badge === "yes"
                                        ? true
                                        : product.badge
                                        ? true
                                        : false
                                }
                                onClick={(e) => setBadge(e.target.value)}
                            />
                            <Label htmlFor="yes">Yes</Label>
                            <Input
                                type="radio"
                                name="badge"
                                id="no"
                                value="no"
                                checked={
                                    badge === "no"
                                        ? true
                                        : !product.badge
                                        ? true
                                        : false
                                }
                                onClick={(e) => setBadge(e.target.value)}
                            />
                            <Label htmlFor="no">No</Label>
                        </Gender>
                    </FormLeft>
                    <FormRight>
                        <div>
                            <Upload>
                                <UploadImg src={product.image} alt="" />
                                <Label For="file">
                                    <FontAwesomeIcon icon={faUpload} />
                                </Label>
                                <UploadInput
                                    type="file"
                                    id="file"
                                    onChange={(e) => uploadHandler(e, currentImage)}
                                />
                            </Upload>
                            <SelBoxGroup>
                                <SelBox
                                    onClick={() => setCurrentImage("image1")}
                                    mode={mode}
                                >
                                    1
                                </SelBox>
                                <SelBox
                                    onClick={() => setCurrentImage("image2")}
                                    mode={mode}
                                >
                                    2
                                </SelBox>
                                <SelBox
                                    onClick={() => setCurrentImage("image3")}
                                    mode={mode}
                                >
                                    3
                                </SelBox>
                                <SelBox
                                    onClick={() => setCurrentImage("image4")}
                                    mode={mode}
                                >
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
