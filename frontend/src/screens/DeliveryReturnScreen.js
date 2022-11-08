import React, { useContext, useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { Store } from "../Store";
import styled from "styled-components";
import axios from "axios";
import { getError } from "../utils";
import { socket } from "../App";
import WalletModel from "../component/wallet/WalletModel";
import AddFund from "../component/wallet/AddFund";

const Container = styled.div`
  margin: 30px;
`;
const Option = styled.div`
  display: flex;
  align-items: center;
`;
const Label = styled.label`
  margin-left: 10px;
  text-transform: capitalize;
`;
const Radio = styled.input`
  &:checked::after {
    width: 20px;
    height: 20px;
    border-radius: 20px;
    top: -2px;
    left: -1px;
    position: relative;
    background-color: var(--orange-color);
    content: "";
    display: inline-block;
    visibility: visible;
    border: 2px solid white;
  }
`;

const OptionCont = styled.div`
  margin: 10px 0;
`;
const Plans = styled.div`
  border-radius: 0.2rem;
  border: 1px solid
    ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev3)" : "var(--light-ev3)"};
  margin: 5px;
  padding: 10px;
  & a.link {
    color: var(--orange-color);
    font-size: 14px;
    padding-left: 10px;
    text-decoration: underline;
    font-weight: 400;
  }
`;
const Plan = styled.div`
  display: flex;
  align-items: center;
  margin: 15px 0;
  justify-content: space-between;
`;

const Input = styled.input`
  border: none;
  width: 100%;
  height: 30px;
  border-bottom: 1px solid
    ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev3)" : "var(--light-ev3)"};
  background: none;
  padding-left: 10px;
  color: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--white-color)"
      : "var(--black-color)"};
  &:focus {
    outline: none;
    border-bottom: 1px solid var(--orange-color);
  }
  &::placeholder {
    font-size: 14px;
  }
`;

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_ADDRESS_REQUEST":
      return { ...state, loadingAddress: true };
    case "FETCH_ADDRESS_SUCCESS":
      return {
        ...state,
        loadingAddress: false,
        addresses: action.payload,
        error: "",
      };

    case "FETCH_ADDRESS_FAILED":
      return { ...state, loadingAddress: false, error: action.payload };
    default:
      return state;
  }
};
export default function DeliveryReturnScreen({
  setShowModel,
  returned,
  dispatch: rtdispatch,
}) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo, currency } = state;
  const [deliveryOption, setDeliveryOption] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [meta, setMeta] = useState("");
  const [value, setValue] = useState("");
  const [update, setUpdate] = useState(false);
  const [showModel, setShowModel1] = useState(false);
  const [refresh, setRefresh] = useState(true);

  // useEffect(() => {
  //   if (cartItems.length) {
  //     cartItems.map((x) => {
  //       setUnion((prevstate) => [
  //         ...new Set([...prevstate, ...x.deliveryOption]),
  //       ]);
  //     });
  //   }
  //   console.log("union", union);
  // }, [cartItems]);

  const [{ loadingAddress, error, addresses }, dispatch] = useReducer(reducer, {
    loadingAddress: true,
    error: "",
    addresses: null,
  });

  // const returnDeliveryOption = [
  //   { name: "Pick up from Seller", value: 1 },
  //   { name: "Paxi PEP store", value: "59.95" },
  //   { name: "PUDO Locker-to-Locker", value: "40" },
  //   { name: "PostNet-to-PostNet", value: "99.99" },
  //   { name: "Aramex Store-to-Door", value: "99.99" },
  // ];
  useEffect(() => {
    dispatch({ type: "FETCH_ADDRESS_REQUEST" });
    const getAddress = async () => {
      try {
        const { data } = await axios.get(`/api/addresses/${userInfo._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: "FETCH_ADDRESS_SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "FETCH_ADDRESS_FAILED" });
        console.log(getError(err));
      }
    };
    getAddress();
  }, []);
  const [selected, setSelected] = useState("");
  useEffect(() => {
    console.log(addresses);
    if (addresses && addresses.length > 0) {
      addresses.map((d) => {
        if (d.meta["deliveryOption"] === deliveryOption) {
          setMeta(d.meta);
          setUpdate(true);
          setSelected(d._id);
        } else {
          setUpdate(false);
        }
      });
    }
  }, [deliveryOption]);

  const [error1, setError1] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!returned.comfirmDelivery) {
        const { data } = await axios.post(
          "/api/accounts/transfer",
          {
            amount: returned.sending.cost,
            purpose: "Return delivery fee",
          },
          {
            headers: { authorization: `Bearer ${userInfo.token}` },
          }
        );

        if (!data.success) {
          ctxDispatch({
            type: "SHOW_TOAST",
            payload: {
              message: "Fund your wallet to complete return",
              showStatus: true,
              state1: "visible1 error",
            },
          });
          setError1("Fund your wallet to complete return");
          return;
        } else {
          await axios.put(
            `/api/returns/${returned._id}/transaction`,
            {
              transaction_id: data.transaction_id || null,
            },
            {
              headers: { authorization: `Bearer ${userInfo.token}` },
            }
          );
        }
      }
      const deliverySelect = { deliveryOption, cost: value, ...meta };
      if (userInfo) {
        const { data } = await axios.put(
          `/api/returns/${returned._id}`,
          {
            meta: deliverySelect,
            comfirmDelivery: returned.comfirmDelivery,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        rtdispatch({ type: "GET_SUCCESS", payload: data });
        socket.emit("post_data", {
          userId: returned.orderId.user._id,
          itemId: returned._id,
          notifyType: "return",
          msg: `Return Address Updated`,
          link: `/return/${returned._id}`,
          userImage: returned.productId.seller.image,
        });
      }
      setShowModel(false);
    } catch (err) {
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: getError(err),
          showStatus: true,
          state1: "visible1 error",
        },
      });
      setError1(
        "Encoutered a problem adding address, ensure your wallet is funded to continue"
      );
    }
  };

  function receiveMessage(message) {
    if (
      message.origin == "https://map.paxi.co.za" &&
      message.data &&
      message.data.trg === "paxi"
    ) {
      var point = message.data.point;
      /* Modify the code below for your application */
      setMeta({ ...meta, ...point });
      setShowMap(false);
      /* Add additional logic below (eg: closing modal) */
    }
  }

  useEffect(() => {
    if (window.addEventListener) {
      window.addEventListener("message", receiveMessage, false);
    } else {
      /* support for older browsers (IE 8) */
      window.attachEvent("onmessage", receiveMessage);
    }
  }, []);

  return (
    <Container>
      <div>
        <Helmet>
          <title>Delivery Method</title>
        </Helmet>
        {console.log(returned)}
        <h1 className="my-3">Delivery Method</h1>
        {error1 && (
          <div style={{ color: "red" }}>
            {error1}
            <span
              onClick={() => setShowModel1(true)}
              style={{
                cursor: "pointer",
                color: "var(--orange-color)",
                textDecoration: "underline",
              }}
            >
              {" "}
              Fund now
            </span>
          </div>
        )}

        <Form onSubmit={submitHandler}>
          {[
            {
              name: returned.sending["delivery Option"],
              value: returned.sending.cost,
            },
          ].map((x) => (
            <div className="mb-3" key={x.name}>
              <OptionCont>
                <Option>
                  <Radio
                    type="radio"
                    id={x.name}
                    value={x.name}
                    checked={deliveryOption === x.name}
                    onChange={(e) => {
                      setMeta({
                        ...meta,
                        deliveryOption: e.target.value,
                        cost: x.value,
                      });
                      setDeliveryOption(e.target.value);
                      setValue(x.value);
                      setMeta("");
                    }}
                  />
                  <Label htmlFor={x.name}>
                    {x.name} {x.value === 1 ? "" : `+ ${currency}${x.value}`}
                  </Label>
                </Option>
                {deliveryOption === x.name ? (
                  deliveryOption === "Paxi PEP store" ? (
                    <Plans>
                      <Plan>
                        <Input
                          type="text"
                          onClick={() => setShowMap(true)}
                          placeholder="Choose the closest pick up point"
                          defaultValue={meta.shortName}
                        />
                      </Plan>
                      {showMap && (
                        <iframe
                          width="100%"
                          height="600"
                          src="https://map.paxi.co.za?size=l,m,s&status=1,3,4&maxordervalue=1000&output=nc,sn&select=true"
                          frameBorder="0"
                          allow="geolocation"
                        ></iframe>
                      )}
                      <Plan>
                        <Input
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, phone: e.target.value })
                          }
                          placeholder="Phone number"
                          value={meta.phone}
                        />
                      </Plan>

                      <a
                        className="link"
                        href="https://www.paxi.co.za/send"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        How Paxi works
                      </a>
                    </Plans>
                  ) : deliveryOption === "PUDO Locker-to-Locker" ? (
                    <Plans>
                      <Plan>
                        <Input
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, province: e.target.value })
                          }
                          placeholder="Province"
                          value={meta.province}
                        />
                      </Plan>

                      <a
                        className="link"
                        href="https://www.pudo.co.za/where-to-find-us.php"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Find locker near your location
                      </a>
                      <Plan>
                        <Input
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, shortName: e.target.value })
                          }
                          placeholder="Pick Up Locker"
                          value={meta.shortName}
                        />
                      </Plan>
                      <Plan>
                        <Input
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, phone: e.target.value })
                          }
                          placeholder="Phone"
                          value={meta.phone}
                        />
                      </Plan>
                      <a
                        className="link"
                        href="https://www.pudo.co.za/how-it-works.php"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        How PUDO works
                      </a>
                      <Plan>
                        <a
                          className="link"
                          href="
                      https://www.pudo.co.za/faq.php"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          PUDO FAQ
                        </a>
                      </Plan>
                    </Plans>
                  ) : deliveryOption === "PostNet-to-PostNet" ? (
                    <Plans>
                      <Plan>
                        <Input
                          mode={mode}
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, province: e.target.value })
                          }
                          placeholder="Province"
                          value={meta.province}
                        />
                      </Plan>

                      <a
                        className="link"
                        href="https://www.postnet.co.za/stores"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Find store near your location
                      </a>
                      <Plan>
                        <Input
                          mode={mode}
                          type="text"
                          onChange={(e) =>
                            setMeta({
                              ...meta,
                              pickUp: e.target.value,
                            })
                          }
                          placeholder="Pick Up Locker"
                          value={meta.pickUp}
                        />
                      </Plan>
                      <Plan>
                        <Input
                          mode={mode}
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, phone: e.target.value })
                          }
                          placeholder="Phone"
                          value={meta.phone}
                        />
                      </Plan>
                      <a
                        className="link"
                        href="https://www.postnet.co.za/domestic-postnet2postnet"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        How PostNet works
                      </a>
                    </Plans>
                  ) : deliveryOption === "Aramex Store-to-Door" ? (
                    <Plans>
                      <Plan>
                        <Input
                          mode={mode}
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, name: e.target.value })
                          }
                          placeholder="Name"
                          value={meta.name}
                        />
                      </Plan>

                      <Plan>
                        <Input
                          mode={mode}
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, phone: e.target.value })
                          }
                          placeholder="Phone"
                          value={meta.phone}
                        />
                      </Plan>
                      <Plan>
                        <Input
                          mode={mode}
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, email: e.target.value })
                          }
                          placeholder="E-mail"
                          value={meta.email}
                        />
                      </Plan>
                      <Plan>
                        <Input
                          mode={mode}
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, company: e.target.value })
                          }
                          placeholder="Company name (if applicable)"
                          value={meta.company}
                        />
                      </Plan>
                      <Plan>
                        <Input
                          mode={mode}
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, address: e.target.value })
                          }
                          placeholder="Address (P.O. box not accepted"
                          value={meta.address}
                        />
                      </Plan>
                      <Plan>
                        <Input
                          mode={mode}
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, suburb: e.target.value })
                          }
                          placeholder="Suburb"
                          value={meta.suburb}
                        />
                      </Plan>
                      <Plan>
                        <Input
                          mode={mode}
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, city: e.target.value })
                          }
                          placeholder="City/Town"
                          value={meta.city}
                        />
                      </Plan>
                      <Plan>
                        <Input
                          mode={mode}
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, postalcode: e.target.value })
                          }
                          placeholder="Postal Code"
                          value={meta.postalcode}
                        />
                      </Plan>
                      <Plan>
                        <Input
                          mode={mode}
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, province: e.target.value })
                          }
                          placeholder="Province"
                          value={meta.province}
                        />
                      </Plan>
                      <a
                        className="link"
                        href="https://www.youtube.com/watch?v=VlUQTF064y8"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        How Aramex works
                      </a>
                    </Plans>
                  ) : (
                    ""
                  )
                ) : (
                  ""
                )}
              </OptionCont>
            </div>
          ))}
          <div className="mb-3">
            <button
              className="search-btn1"
              style={{ width: "100%" }}
              type="submit"
            >
              Continue
            </button>
          </div>
        </Form>
        <WalletModel showModel={showModel} setShowModel={setShowModel1}>
          <AddFund
            setShowModel={setShowModel}
            currency={currency}
            setRefresh={setRefresh}
            refresh={refresh}
          />
        </WalletModel>
      </div>
    </Container>
  );
}
