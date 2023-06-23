import React, { useContext, useEffect, useState } from "react";
import { Store } from "../Store";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { getError, rebundleIsActive } from "../utils";
import Row from "react-bootstrap/esm/Row";

const Item = styled.div`
  margin: 0 10px 20px 10px;
  padding: 20px;
  border-radius: 0.2rem;

  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  @media (max-width: 992px) {
    margin: 10px 0;
  }
`;

const CartItemCont = styled.div`
  display: none;
  @media (max-width: 768px) {
    display: flex;
  }
`;

const UserCont = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;
const UserImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
`;
const UserName = styled.div`
  font-weight: bold;
  margin: 0 20px;
`;

const SelectDelivery = styled.button`
  margin-left: 20px;
  color: var(--orange-color);
  font-size: 15px;
  border: 0;
  cursor: pointer;
  background: none;
  &:hover {
    color: var(--malon-color);
  }
`;

const SelectDeliveryButton = styled.div`
  background: var(--orange-color);
  color: white;
  cursor: pointer;
  padding: 3px 7px;
  border-radius: 0.2rem;
  &:hover {
    background: var(--malon-color);
  }
`;
const Overlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: black;
  opacity: 0.5;
`;

export default function CartItem({
  item,
  setCurrentItem,
  setRemove,
  setShowModel,
}) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, cart, userInfo, currency } = state;

  const [cartItem, setCartItem] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/products/${item._id}`);
        setCartItem(data);
      } catch (error) {
        setError(getError(error));
      }
    };
    fetchData();
  }, [item._id]);

  const updateCartHandler = async (item, quantity) => {
    if (!item.deliverySelect) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Select method of delivery",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    const { data } = await axios.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "Sorry. Product is out of stock",
          showStatus: true,
          state1: "visible1 error",
        },
      });
      return;
    }
    const quantityguard = item.quantity > quantity ? false : true;
    const allowData = await rebundleIsActive(userInfo, item.seller._id, cart);

    if (allowData.success) {
      if (
        allowData.countAllow > 0 &&
        allowData.seller.deliveryMethod ===
          item.deliverySelect["delivery Option"]
      ) {
        console.log("rebundle");
        item.deliverySelect = {
          ...item.deliverySelect,
          total: {
            cost: item.deliverySelect.total.cost,
            status: !item.deliverySelect.total.status,
          },
        };
      } else {
        console.log("no rebundle");

        item.deliverySelect = {
          ...item.deliverySelect,
          total: {
            cost: quantityguard
              ? Number(item.deliverySelect.total.cost) +
                Number(item.deliverySelect.cost)
              : item.deliverySelect.total.cost > 0
              ? Number(item.deliverySelect.total.cost) -
                Number(item.deliverySelect.cost)
              : item.deliverySelect.total.cost,
            status: !item.deliverySelect.total.status,
          },
        };
      }
    } else {
      item.deliverySelect = {
        ...item.deliverySelect,
        total: {
          cost: quantityguard
            ? Number(item.deliverySelect.total.cost) +
              Number(item.deliverySelect.cost)
            : item.deliverySelect.total.cost > 0
            ? Number(item.deliverySelect.total.cost) -
              Number(item.deliverySelect.cost)
            : item.deliverySelect.total.cost,
          status: !item.deliverySelect.total.status,
        },
      };
    }

    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  return (
    <Item mode={mode}>
      <UserCont>
        <UserImg src={item.seller.image} alt="img" />
        <UserName>
          <Link to={`/seller/${item.seller._id}`}>{item.sellerName}</Link>
        </UserName>
      </UserCont>
      <hr />
      {cartItem?.soldAll && (
        <div style={{ color: "red" }}>Product out stock</div>
      )}
      <CartItemCont>
        <img
          src={item.image}
          alt={item.name}
          className="img-fluid rounded img-thumbnail"
          style={cartItem?.soldAll ? { opacity: 0.5 } : {}}
        />
        <div
          className="cart_item_detail "
          style={{ justifyContent: "space-between" }}
        >
          <div style={cartItem?.soldAll ? { opacity: 0.5 } : {}}>
            <Link to={`/product/${item.slug}`}>{item.name}</Link>

            <div>
              {" "}
              {item.currency}
              {item.actualPrice}
            </div>
            <span>Size: {item.selectSize}</span>
          </div>
          <div className="col-3 d-flex align-items-center">
            <Button
              variant="none"
              onClick={() => updateCartHandler(item, item.quantity - 1)}
              disabled={item.quantity === 1 || cartItem?.soldAll}
              style={cartItem?.soldAll ? { opacity: 0.5 } : {}}
            >
              <FontAwesomeIcon icon={faMinus} />
            </Button>{" "}
            <span>{item.quantity}</span>{" "}
            <Button
              variant="none"
              onClick={() => updateCartHandler(item, item.quantity + 1)}
              disabled={
                item.quantity === item.countInStock || cartItem?.soldAll
              }
              style={cartItem?.soldAll ? { opacity: 0.5 } : {}}
            >
              <FontAwesomeIcon icon={faPlus} />
            </Button>
            <div>
              <Button
                onClick={() => {
                  setCurrentItem(item);
                  setRemove(true);
                }}
                variant="none"
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </div>
          </div>
        </div>
      </CartItemCont>
      <Row className="align-items-center d-none d-md-flex justify-content-between">
        <div className="col-5 d-flex  align-items-center">
          <img
            src={item.image}
            alt={item.name}
            className="img-fluid rounded img-thumbnail"
            style={cartItem?.soldAll ? { opacity: 0.5 } : {}}
          ></img>{" "}
          <div
            className="cart_item_detail"
            style={cartItem?.soldAll ? { opacity: 0.5 } : {}}
          >
            <Link to={`/product/${item.slug}`}>{item.name}</Link>

            <div>
              {" "}
              {item.currency}
              {item.actualPrice}
            </div>
            <span>Size: {item.selectSize}</span>
          </div>
        </div>
        <div className="col-3 d-flex align-items-center">
          <Button
            variant="none"
            onClick={() => updateCartHandler(item, item.quantity - 1)}
            disabled={item.quantity === 1 || cartItem?.soldAll}
            style={cartItem?.soldAll ? { opacity: 0.5 } : {}}
          >
            <FontAwesomeIcon icon={faMinus} />
          </Button>{" "}
          <span>{item.quantity}</span>{" "}
          <Button
            variant="none"
            onClick={() => updateCartHandler(item, item.quantity + 1)}
            disabled={item.quantity === item.countInStock || cartItem?.soldAll}
            style={cartItem?.soldAll ? { opacity: 0.5 } : {}}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </div>
        <div className="col-2">
          <Button
            onClick={() => {
              setCurrentItem(item);
              setRemove(true);
            }}
            variant="none"
          >
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </div>
      </Row>
      <div
        style={
          cartItem?.soldAll
            ? { marginTop: "20px", display: "flex", opacity: 0.5 }
            : { marginTop: "20px", display: "flex" }
        }
      >
        <div>
          Delivery:{" "}
          {item.deliverySelect ? (
            <span style={{ marginLeft: "20px" }}>
              {item.deliverySelect["delivery Option"]} + {currency}
              {item.deliverySelect.cost}
            </span>
          ) : (
            ""
          )}
        </div>
        <SelectDelivery
          onClick={() => {
            if (cartItem?.soldAll) {
              ctxDispatch({
                type: "SHOW_TOAST",
                payload: {
                  message: "Sorry. Product is out of stock",
                  showStatus: true,
                  state1: "visible1 error",
                },
              });
              return;
            }
            setCurrentItem(item);
            setShowModel(true);
          }}
        >
          {!item.deliverySelect ? (
            <SelectDeliveryButton>Select delivery option</SelectDeliveryButton>
          ) : (
            <div style={{ fontWeight: "bold" }}>Change</div>
          )}
        </SelectDelivery>
      </div>
    </Item>
  );
}
