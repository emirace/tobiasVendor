import {
  faCamera,
  faChevronCircleRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormControl, MenuItem, Select } from "@mui/material";
import React, { useContext, useState } from "react";
import styled from "styled-components";
import { Store } from "../Store";

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
export default function Return({ orderItems, deliveryMethod }) {
  const { state } = useContext(Store);
  const { mode } = state;
  const [tab, setTab] = useState("items");
  const [current, setCurrent] = useState("");
  const [resolution, setResolution] = useState("");
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
              <Button>Submit</Button>
            </Form>
          </Content>
        );
      default:
        break;
    }
  };

  return <Container>{displayTab(tab)}</Container>;
}
