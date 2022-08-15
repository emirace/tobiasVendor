import {
  faCamera,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormControl, MenuItem, Select } from "@mui/material";
import axios from "axios";
import React, { useContext, useReducer, useState } from "react";
import styled from "styled-components";
import { Store } from "../Store";
import { getError } from "../utils";

const Container = styled.div`
  padding: 30px;
`;
const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const OrderItem = styled.div`
  display: flex;
  flex: 8;
  margin-bottom: 10px;
`;
const Image = styled.img`
  object-fit: cover;
  object-position: top;
  width: 100px;
  height: 130px;
`;
const Details1 = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
const Name = styled.div`
  text-transform: capitalize;
  font-weight: 600;
  margin-bottom: 10px;
`;
const Quantity = styled.div`
  margin-bottom: 10px;
`;
const ItemPrice = styled.div`
  font-weight: bold;
`;
const ItemCont = styled.div`
  width: 50%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 10px;
  border-radius: 0.2rem;
  &:hover {
    background: ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  }
`;
const InputCont = styled.div`
  margin: 10px;
  width: 100%;
`;
const Label = styled.div`
  font-size: 14px;
`;
const Button = styled.div`
  padding: 3px 7px;
  color: var(--white-color);
  background: var(--orange-color);
  border-radius: 0.2rem;
  &:hover {
    background: var(--malon-color);
  }
`;
const Form = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const reducer = (state, action) => {
  switch (action.type) {
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true };
    case "UPLOAD_SUCCESS":
      return { ...state, loadingUpload: false, errorUpload: "" };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false };

    default:
      return state;
  }
};
export default function Return({ orderItems, deliveryMethod, setShowReturn }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo } = state;

  const [{ loadingUpload }, dispatch] = useReducer(reducer, {
    product: null,
    loading: true,
    error: "",
    comments: [],
  });
  const [tab, setTab] = useState("items");
  const [current, setCurrent] = useState("");
  const [resolution, setResolution] = useState("");
  const [image, setImage] = useState("");
  const handleReturn = () => {
    setShowReturn(false);
  };
  const uploadImageHandler = async (e) => {
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
      setImage(data.secure_url);
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
  const displayTab = (tab) => {
    switch (tab) {
      case "items":
        return (
          <Content>
            <h4>Select Return Item</h4>
            {orderItems.map((orderitem) => (
              <>
                <ItemCont
                  key={orderitem._id}
                  onClick={() => {
                    setTab("form");
                    setCurrent(orderitem);
                  }}
                >
                  <OrderItem>
                    <Image src={orderitem.image} alt={orderitem.name} />
                    <Details1>
                      <Name>{orderitem.name}</Name>
                      <Quantity>QTY: {orderitem.quantity}</Quantity>
                      <ItemPrice>$ {orderitem.price}</ItemPrice>
                    </Details1>
                  </OrderItem>
                  <FontAwesomeIcon size={"2x"} icon={faChevronCircleRight} />
                </ItemCont>
                <hr />
              </>
            ))}
          </Content>
        );
      case "form":
        return (
          <Content>
            {current ? (
              <OrderItem>
                <Image src={current.image} alt={current.name} />
                <Details1>
                  <Name>{current.name}</Name>
                  <Quantity>QTY: {current.quantity}</Quantity>
                  <ItemPrice>$ {current.price}</ItemPrice>
                </Details1>
              </OrderItem>
            ) : (
              setTab("items")
            )}
            <Form>
              <InputCont>
                <Label>Preferred Resolution Method</Label>

                <FormControl
                  sx={{
                    width: "100%",
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
                    onChange={(e) => setResolution(e.target.value)}
                    displayEmpty
                    id="deliveryStatus"
                  >
                    <MenuItem value="Re-list and sell my product">
                      Re-list and sell my product
                    </MenuItem>
                    <MenuItem value="Message seller">Message seller</MenuItem>
                  </Select>
                </FormControl>
              </InputCont>
              <InputCont>
                <Label>Reasons for Return</Label>

                <FormControl
                  sx={{
                    width: "100%",
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
                    onChange={(e) => setResolution(e.target.value)}
                    displayEmpty
                    id="deliveryStatus"
                  >
                    <MenuItem value="Missing or wrong product, not what i ordered">
                      Missing or wrong product, not what i ordered
                    </MenuItem>
                    <MenuItem value="Product condition is significantly not as described">
                      Product condition is significantly not as described
                    </MenuItem>
                    <MenuItem value="The product is totally defective or completely demaged.">
                      In transit
                    </MenuItem>
                  </Select>
                </FormControl>
              </InputCont>
              <InputCont>
                <Label>Preferred Sending Method</Label>

                <FormControl
                  sx={{
                    width: "100%",
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
                    onChange={(e) => setResolution(e.target.value)}
                    displayEmpty
                    id="deliveryStatus"
                  >
                    {current.product.deliveryOption.map((p) => (
                      <MenuItem key={p.name} value={p.name}>
                        {p.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </InputCont>
              <InputCont>
                <Label>Preferred Refund Method</Label>

                <FormControl
                  sx={{
                    width: "100%",
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
                    onChange={(e) => setResolution(e.target.value)}
                    displayEmpty
                    id="deliveryStatus"
                  >
                    <MenuItem value="Refund to my original payment method">
                      Refund to my original payment method
                    </MenuItem>
                    <MenuItem value="Credit my Repeddle wallet">
                      Credit my Repeddle wallet
                    </MenuItem>
                  </Select>
                </FormControl>
              </InputCont>
              <InputCont>
                <Label>
                  <FontAwesomeIcon icon={faCamera} /> Upload Image
                </Label>
              </InputCont>
              <Button onClick={handleReturn}>Submit</Button>
            </Form>
          </Content>
        );
      default:
        break;
    }
  };

  return <Container>{displayTab(tab)}</Container>;
}
