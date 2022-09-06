import {
  faCamera,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormControl, MenuItem, Select } from "@mui/material";
import axios from "axios";
import React, { useContext, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { socket } from "../App";
import { Store } from "../Store";
import { getError, region } from "../utils";
import LoadingBox from "./LoadingBox";
import MessageBox from "./MessageBox";

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
const Label1 = styled.label`
  font-size: 14px;
`;
const TextArea = styled.textarea`
  height: 100px;
  border-radius: 0.2rem;
  background: none;
  width: 100%;
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
const SelectOpt = styled.div`
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  margin: 20px;
  padding: 10px;
  border-radius: 0.2rem;
  cursor: pointer;
`;
const reducer = (state, action) => {
  switch (action.type) {
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true };
    case "UPLOAD_SUCCESS":
      return { ...state, loadingUpload: false, errorUpload: "" };
    case "UPLOAD_FAIL":
      return { ...state, loadingUpload: false };

    case "RETURN_REQUEST":
      return { ...state, loading: true };
    case "RETURN_SUCCESS":
      return { ...state, loading: false, errorUpload: "" };
    case "RETURN_FAIL":
      return { ...state, loading: false };

    default:
      return state;
  }
};
export default function Return({
  orderItems,
  orderId,
  deliveryMethod,
  deliverOrderHandler,
  setShowReturn,
}) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo } = state;

  const [{ loadingUpload, loading }, dispatch] = useReducer(reducer, {
    product: null,
    loading: true,
    error: "",
    comments: [],
  });

  const navigate = useNavigate();

  const [tab, setTab] = useState("items");
  const [current, setCurrent] = useState("");
  const [resolution, setResolution] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [sending, setSending] = useState("");
  const [refund, setRefund] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const handleReturn = async () => {
    if (!reason.length) {
      setError("Please select a reason for return");
      return;
    }
    if (!sending.length) {
      setError("Please select a method of sending");
      return;
    }
    if (!refund.length) {
      setError("Please select a method of refund");
      return;
    }

    dispatch({ type: "RETURN_REQUEST" });
    try {
      const { data } = await axios.post(
        `/api/returns/${region()}`,
        {
          orderId,
          productId: current._id,
          resolution,
          sending,
          refund,
          reason,
          others: description,
          image,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      dispatch({ type: "RETURN_SUCCESS" });
      deliverOrderHandler("Returned");
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Return logged successfully",
          showStatus: true,
          state1: "visible1 success",
        },
      });
      socket.emit("post_data", {
        userId: current.seller,
        itemId: current._id,
        notifyType: "return",
        msg: `${userInfo.username} request a return`,
        link: `/return/${data._id}?orderId=${orderId}`,
        userImage: userInfo.image,
      });
      setImage("");
      setShowReturn(false);
    } catch (err) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Fail sending report, pls try again",
          showStatus: true,
          state1: "visible1 error",
        },
      });
    }
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

  const addConversation = async (id, id2) => {
    if (!userInfo) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Signin/Register to start a conversation",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    try {
      const { data } = await axios.post(
        `/api/conversations/`,
        { recieverId: id, productId: id2, type: "product" },
        { headers: { Authorization: `Bearer ${userInfo.token}` } }
      );
      console.log(data);
      navigate(`/messages?conversation=${data._id}`);
    } catch (err) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message:
            "Encounter a problem starting a conversation, pls try again later",
          showStatus: true,
          state1: "visible1 error",
        },
      });
    }
  };

  const displayTab = (tab) => {
    switch (tab) {
      case "items":
        return (
          <Content>
            <h4>Select a Product to Return</h4>
            {orderItems.map((orderitem) => (
              <>
                <ItemCont
                  key={orderitem._id}
                  onClick={() => {
                    setTab("option");
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
      case "option":
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
            <h4>Preferred Resolution Method</h4>
            <div style={{ width: "40%" }}>
              <Link to={`/newproduct?id=${current.slug}`}>
                <SelectOpt mode={mode}>Re-list and sell my product</SelectOpt>
              </Link>
              <SelectOpt
                mode={mode}
                onClick={() => addConversation(current.seller._id, current._id)}
              >
                Message seller
              </SelectOpt>
              <SelectOpt mode={mode} onClick={() => setTab("form")}>
                Return form
              </SelectOpt>
            </div>
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
              {error && <MessageBox variant="danger">{error}</MessageBox>}
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
                    onChange={(e) => setReason(e.target.value)}
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
                      The product is totally defective or completely damage
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
                    onChange={(e) => setSending(e.target.value)}
                    displayEmpty
                    id="deliveryStatus"
                  >
                    {console.log(current)}
                    {current.deliveryOption.map((p) => (
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
                    onChange={(e) => setRefund(e.target.value)}
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
                <Label>Other Information</Label>
                <TextArea
                  mode={mode}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </InputCont>
              <InputCont>
                <Label1 htmlFor="return">
                  <FontAwesomeIcon icon={faCamera} /> Upload Image
                </Label1>
                {loadingUpload && <LoadingBox />}
                {image.length !== 0 && (
                  <span style={{ marginLeft: "10px", fontSize: "14px" }}>
                    Image Uploaded
                  </span>
                )}
                <input
                  type="file"
                  id="return"
                  style={{ display: "none" }}
                  onChange={uploadImageHandler}
                />
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
