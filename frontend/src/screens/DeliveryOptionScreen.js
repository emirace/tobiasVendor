import React, { useContext, useEffect, useReducer, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import { Store } from "../Store";
import styled from "styled-components";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { getError, loginGig, rebundleIsActive, region } from "../utils";
import useGeoLocation from "../hooks/useGeoLocation";
import LoadingBox from "../component/LoadingBox";
import { postnet, pudo, states } from "../constant";
import RebundlePoster from "../component/RebundlePoster";

const Container = styled.div`
  margin: 30px;
`;
const Option = styled.div`
  display: flex;
  align-items: center;
`;
const Label = styled.label`
  margin-left: 10px;
  margin-right: 10px;
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
  align-items: stretch;
  margin: 15px 0;
  flex-direction: column;
  justify-content: center;
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
const Error = styled.div`
  color: red;
  font-size: 13px;
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
    case "FETCH_STATIONs_REQUEST":
      return { ...state, loadingStations: true };
    case "FETCH_STATIONs_SUCCESS":
      return {
        ...state,
        loadingStations: false,
        stations: action.payload,
        error: "",
      };

    case "FETCH_STATIONs_FAILED":
      return { ...state, loadingStations: false };
    case "FETCH_ADDRESS_FAILED":
      return { ...state, loadingAddress: false, error: action.payload };
    default:
      return state;
  }
};

export default function DeliveryOptionScreen({ setShowModel, item }) {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, mode, userInfo, currency } = state;
  const [deliveryOption, setDeliveryOption] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [meta, setMeta] = useState("");
  const [value, setValue] = useState("");
  const [update, setUpdate] = useState(false);

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

  const [
    { loadingAddress, error, loadingStations, stations, addresses },
    dispatch,
  ] = useReducer(reducer, {
    loadingAddress: true,
    error: "",
    addresses: null,
    loadingStations: true,
  });

  const [token, setToken] = useState("");
  const [isRebundle, setIsRebundle] = useState(false);
  useEffect(() => {
    const getRebundleList = async () => {
      const valid = true;
      const data = await rebundleIsActive(
        userInfo,
        item.seller._id,
        cart,
        valid
      );
      setIsRebundle({
        status: data.countAllow > 0,
        method: data.seller.deliveryMethod,
      });
    };
    getRebundleList();
  }, [userInfo]);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        dispatch({ type: "FETCH_STATIONs_REQUEST" });
        const logins = await loginGig();
        setToken(logins);
        if (deliveryOption === "GIG Logistics") {
          const { data } = await axios.get(
            "https://giglthirdpartyapitestenv.azurewebsites.net/api/thirdparty/localStations",
            {
              headers: { Authorization: `Bearer ${logins.token}` },
            }
          );
          dispatch({ type: "FETCH_STATIONs_SUCCESS", payload: data.Object });
        }
      } catch (error) {
        dispatch({ type: "FETCH_STATIONs_FAIL" });
      }
    };
    fetchStations();
  }, [deliveryOption]);

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
        if (d.meta.deliveryOption === deliveryOption) {
          setMeta(d.meta);
          setUpdate(true);
          setSelected(d._id);
        } else {
          setUpdate(false);
        }
      });
    }
  }, [addresses, deliveryOption]);
  const location = useGeoLocation();
  const [locationerror, setLocationerror] = useState("");
  const [loadingGig, setLoadingGig] = useState(false);

  const submitHandler = async () => {
    var deliverySelect = {};

    if (deliveryOption === "GIG Logistics") {
      if (location.error) {
        setLocationerror("Location is require for proper delivery");
        ctxDispatch({
          type: "SHOW_TOAST",
          payload: {
            message: "Location is require for proper delivery",
            showStatus: true,
            state1: "visible1 error",
          },
        });
        return;
      }
      try {
        setLoadingGig(true);

        const { data } = await axios.post(
          "https://giglthirdpartyapitestenv.azurewebsites.net/api/thirdparty/price",
          {
            ReceiverAddress: meta.address,
            CustomerCode: token.username,
            SenderLocality: item.meta.address,
            SenderAddress: item.meta.address,
            ReceiverPhoneNumber: meta.phone,
            VehicleType: "BIKE",
            SenderPhoneNumber: item.meta.phone,
            SenderName: item.meta.name,
            ReceiverName: meta.name,
            UserId: token.userId,
            ReceiverStationId: meta.stationId,
            SenderStationId: item.meta.stationId,
            ReceiverLocation: {
              Latitude: location.coordinates.lat,
              Longitude: location.coordinates.lng,
            },
            SenderLocation: {
              Latitude: item.meta.lat,
              Longitude: item.meta.lng,
            },
            PreShipmentItems: [
              {
                SpecialPackageId: "0",
                Quantity: item.quantity,
                ItemType: "Normal",
                ItemName: item.name,
                Value: item.actualPrice,
                ShipmentType: "Regular",
                Description: item.description,
                ImageUrl: item.image,
              },
            ],
          },
          {
            headers: { Authorization: `Bearer ${token.token}` },
          }
        );
        console.log(data);
        if (data.Object) {
          deliverySelect = {
            "delivery Option": deliveryOption,
            cost: data.Object.DeliveryPrice,
            ...meta,
          };
        } else {
          setLoadingGig(false);
          setLocationerror(
            "Error selecting delivery method, try again later or try other delivery method"
          );
          return;
        }
      } catch (err) {
        setLoadingGig(false);
      }
    } else {
      deliverySelect = {
        "delivery Option": deliveryOption,
        cost: value,
        ...meta,
        total: { status: true, cost: value },
      };
    }
    if (userInfo) {
      await axios.post(
        update ? `/api/addresses/${selected}` : "/api/addresses",
        {
          meta: deliverySelect,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
    }
    const valid = true;
    const allowData = await rebundleIsActive(
      userInfo,
      item.seller._id,
      cart,
      valid
    );
    console.log("allow", allowData, deliveryOption);
    if (
      allowData?.countAllow > 0 &&
      allowData?.seller?.deliveryMethod === deliveryOption
    ) {
      deliverySelect = {
        ...deliverySelect,
        total: { status: true, cost: 0 },
      };
    }
    console.log("deliverySelect", deliverySelect);
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: {
        ...item,
        deliverySelect,
        quantity: 1,
      },
    });
    ctxDispatch({ type: "SAVE_DELIVERY_METHOD", payload: deliverySelect });
    setShowModel(false);
    // navigate("/placeorder");
    setLoadingGig(false);
  };

  const [validationError, setValidationError] = useState("");
  const validation = (e) => {
    e.preventDefault();
    var valid = true;
    if (!deliveryOption) {
      valid = false;
    }
    if (deliveryOption === "Paxi PEP store") {
      if (!meta.shortName) {
        setValidationError({
          ...validationError,
          point: "Select a pick up point ",
        });
        valid = false;
      }
      if (!meta.phone) {
        setValidationError({
          ...validationError,
          phone: "Enter a valid phone number ",
        });
        valid = false;
      }
    }
    if (deliveryOption === "PUDO Locker-to-Locker") {
      if (!meta.phone) {
        setValidationError({
          ...validationError,
          phone: "Enter a valid phone number ",
        });
        valid = false;
      }
      if (!meta.province) {
        setValidationError({
          ...validationError,
          province: "Select province",
        });
        valid = false;
      }
      if (!meta.shortName) {
        setValidationError({
          ...validationError,
          shortName: "Select a pick up point ",
        });
        valid = false;
      }
    }
    if (deliveryOption === "PostNet-to-PostNet") {
      if (!meta.phone) {
        setValidationError({
          ...validationError,
          phone: "Enter a valid phone number ",
        });
        valid = false;
      }

      if (!meta.province) {
        setValidationError({
          ...validationError,
          province: "Select province",
        });
        valid = false;
      }
      if (!meta.pickUp) {
        setValidationError({
          ...validationError,
          pickUp: "Select a pick up locker ",
        });
        valid = false;
      }
    }
    if (deliveryOption === "Aramex Store-to-Door") {
      if (!meta.province) {
        setValidationError({
          ...validationError,
          province: "Select province",
        });
        valid = false;
      }
      if (!meta.postalcode) {
        setValidationError({
          ...validationError,
          postalcode: "Enter your postal code ",
        });
        valid = false;
      }
      if (!meta.city) {
        setValidationError({
          ...validationError,
          city: "Enter your city ",
        });
        valid = false;
      }
      if (!meta.suburb) {
        setValidationError({
          ...validationError,
          suburb: "Enter your suburb ",
        });
        valid = false;
      }
      if (!meta.address) {
        setValidationError({
          ...validationError,
          address: "Enter your address ",
        });
        valid = false;
      }
      if (!meta.email) {
        setValidationError({
          ...validationError,
          email: "Enter your email ",
        });
        valid = false;
      }
      if (!meta.name) {
        setValidationError({
          ...validationError,
          name: "Enter your name ",
        });
        valid = false;
      }
      if (!meta.phone) {
        setValidationError({
          ...validationError,
          phone: "Enter a valid phone number ",
        });
        valid = false;
      }
    }
    if (deliveryOption === "GIG Logistics") {
      if (!meta.stationId) {
        setValidationError({
          ...validationError,
          stationId: "Select a station ",
        });
        valid = false;
      }
      if (!meta.address) {
        setValidationError({
          ...validationError,
          address: "Enter your address ",
        });
        valid = false;
      }
      if (!meta.name) {
        setValidationError({
          ...validationError,
          name: "Enter your name ",
        });
        valid = false;
      }
      if (!meta.phone) {
        setValidationError({
          ...validationError,
          phone: "Enter a valid phone number ",
        });
        valid = false;
      }
    }

    if (valid) {
      submitHandler();
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
        <h1 className="my-3">Delivery Method</h1>
        {console.log(item)}
        {isRebundle.status && <RebundlePoster />}
        <Form onSubmit={validation}>
          {item.deliveryOption.map((x) => (
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
                        "delivery Option": e.target.value,
                        cost: x.value,
                      });
                      setDeliveryOption(e.target.value);
                      setValue(x.value);
                      setMeta("");
                    }}
                  />
                  {console.log(isRebundle)}
                  <Label htmlFor={x.name}>
                    {x.name}{" "}
                    {x.value === 0 ? (
                      ""
                    ) : isRebundle.status && isRebundle.method === x.name ? (
                      <span
                        style={{
                          color: "var(--malon-color)",
                          fontSize: "11px",
                          fontWeight: "bold",
                          marginLeft: "10px",
                        }}
                      >
                        free
                      </span>
                    ) : (
                      `+ ${currency}${x.value}`
                    )}
                  </Label>
                </Option>
                {deliveryOption === x.name ? (
                  deliveryOption === "Paxi PEP store" ? (
                    <Plans>
                      <Plan>
                        <Input
                          mode={mode}
                          onFocus={() =>
                            setValidationError({
                              ...validationError,
                              shortName: "",
                            })
                          }
                          type="text"
                          onClick={() => setShowMap(true)}
                          placeholder="Choose the closest pick up point"
                          defaultValue={meta.shortName}
                        />
                        {validationError.shortName && (
                          <Error>{validationError.shortName}</Error>
                        )}
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
                          mode={mode}
                          onFocus={() =>
                            setValidationError({
                              ...validationError,
                              phone: "",
                            })
                          }
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, phone: e.target.value })
                          }
                          placeholder="Phone number"
                          value={meta.phone}
                        />
                        {validationError.phone && (
                          <Error>{validationError.phone}</Error>
                        )}
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
                        <Label>Province</Label>
                        <FormControl
                          sx={{
                            margin: 0,
                            width: "100%",
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
                            value={meta.province}
                            onChange={(e) => {
                              setMeta({ ...meta, province: e.target.value });
                              setValidationError({
                                ...validationError,
                                province: "",
                              });
                            }}
                            displayEmpty
                          >
                            {region() === "NGN"
                              ? states.Nigeria.map((x) => (
                                  <MenuItem value={x}>{x}</MenuItem>
                                ))
                              : states.SouthAfrican.map((x) => (
                                  <MenuItem value={x}>{x}</MenuItem>
                                ))}
                          </Select>
                        </FormControl>
                        {validationError.province && (
                          <Error>{validationError.province}</Error>
                        )}
                        {/* <Input
                        mode={mode}
                        onFocus={()=>setValidationError({...validationError,phone:''})}
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, province: e.target.value })
                          }
                          placeholder="Province"
                          value={meta.province}
                        /> */}
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
                        {/* <Input
                        mode={mode}
                          onFocus={()=>setValidationError({
                            ...validationError,
                            shortName: "",
                          })}
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, shortName: e.target.value })
                          }
                          placeholder="Pick Up Locker"
                          value={meta.shortName}
                        /> */}
                        <Label>Pick Up Locker</Label>
                        <FormControl
                          sx={{
                            margin: 0,
                            width: "100%",
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
                            value={meta.shortName}
                            onChange={(e) => {
                              setMeta({ ...meta, shortName: e.target.value });
                              setValidationError({
                                ...validationError,
                                shortName: "",
                              });
                            }}
                            displayEmpty
                          >
                            {pudo[meta.province]?.map((x) => (
                              <MenuItem value={x}>{x}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {validationError.shortName && (
                          <Error>{validationError.shortName}</Error>
                        )}
                      </Plan>
                      <Plan>
                        <Input
                          mode={mode}
                          onFocus={() =>
                            setValidationError({
                              ...validationError,
                              phone: "",
                            })
                          }
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, phone: e.target.value })
                          }
                          placeholder="Phone"
                          value={meta.phone}
                        />
                        {validationError.phone && (
                          <Error>{validationError.phone}</Error>
                        )}
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
                        <Label>Province</Label>
                        <FormControl
                          sx={{
                            margin: 0,
                            width: "100%",
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
                            value={meta.province}
                            onChange={(e) => {
                              setMeta({ ...meta, province: e.target.value });
                              setValidationError({
                                ...validationError,
                                province: "",
                              });
                            }}
                            displayEmpty
                          >
                            {region() === "NGN"
                              ? states.Nigeria.map((x) => (
                                  <MenuItem value={x}>{x}</MenuItem>
                                ))
                              : states.SouthAfrican.map((x) => (
                                  <MenuItem value={x}>{x}</MenuItem>
                                ))}
                          </Select>
                        </FormControl>
                        {validationError.province && (
                          <Error>{validationError.province}</Error>
                        )}
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
                        <Label>Pick Up Locker</Label>
                        <FormControl
                          sx={{
                            margin: 0,
                            width: "100%",
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
                            value={meta.pickUp}
                            onChange={(e) => {
                              setMeta({ ...meta, pickUp: e.target.value });
                              setValidationError({
                                ...validationError,
                                pickUp: "",
                              });
                            }}
                            displayEmpty
                          >
                            {postnet[meta.province]?.map((x) => (
                              <MenuItem value={x}>{x}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        {validationError.pickUp && (
                          <Error>{validationError.pickUp}</Error>
                        )}
                      </Plan>
                      <Plan>
                        <Input
                          mode={mode}
                          onFocus={() =>
                            setValidationError({
                              ...validationError,
                              phone: "",
                            })
                          }
                          type="number"
                          onChange={(e) =>
                            setMeta({ ...meta, phone: e.target.value })
                          }
                          placeholder="Phone"
                          value={meta.phone}
                        />
                        {validationError.phone && (
                          <Error>{validationError.phone}</Error>
                        )}
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
                          onFocus={() =>
                            setValidationError({
                              ...validationError,
                              name: "",
                            })
                          }
                          mode={mode}
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, name: e.target.value })
                          }
                          placeholder="Name"
                          value={meta.name}
                        />
                        {validationError.name && (
                          <Error>{validationError.name}</Error>
                        )}
                      </Plan>

                      <Plan>
                        <Input
                          onFocus={() =>
                            setValidationError({
                              ...validationError,
                              phone: "",
                            })
                          }
                          mode={mode}
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, phone: e.target.value })
                          }
                          placeholder="Phone"
                          value={meta.phone}
                        />
                        {validationError.phone && (
                          <Error>{validationError.phone}</Error>
                        )}
                      </Plan>
                      <Plan>
                        <Input
                          onFocus={() =>
                            setValidationError({
                              ...validationError,
                              email: "",
                            })
                          }
                          mode={mode}
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, email: e.target.value })
                          }
                          placeholder="E-mail"
                          value={meta.email}
                        />
                        {validationError.email && (
                          <Error>{validationError.email}</Error>
                        )}
                      </Plan>
                      <Plan>
                        <Input
                          onFocus={() =>
                            setValidationError({
                              ...validationError,
                              company: "",
                            })
                          }
                          mode={mode}
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, company: e.target.value })
                          }
                          placeholder="Company name (if applicable)"
                          value={meta.company}
                        />
                        {validationError.company && (
                          <Error>{validationError.company}</Error>
                        )}
                      </Plan>
                      <Plan>
                        <Input
                          onFocus={() =>
                            setValidationError({
                              ...validationError,
                              address: "",
                            })
                          }
                          mode={mode}
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, address: e.target.value })
                          }
                          placeholder="Address (P.O. box not accepted"
                          value={meta.address}
                        />
                        {validationError.address && (
                          <Error>{validationError.address}</Error>
                        )}
                      </Plan>
                      <Plan>
                        <Input
                          onFocus={() =>
                            setValidationError({
                              ...validationError,
                              suburb: "",
                            })
                          }
                          mode={mode}
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, suburb: e.target.value })
                          }
                          placeholder="Suburb"
                          value={meta.suburb}
                        />
                        {validationError.suburb && (
                          <Error>{validationError.suburb}</Error>
                        )}
                      </Plan>
                      <Plan>
                        <Input
                          onFocus={() =>
                            setValidationError({
                              ...validationError,
                              city: "",
                            })
                          }
                          mode={mode}
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, city: e.target.value })
                          }
                          placeholder="City/Town"
                          value={meta.city}
                        />
                        {validationError.city && (
                          <Error>{validationError.city}</Error>
                        )}
                      </Plan>
                      <Plan>
                        <Input
                          onFocus={() =>
                            setValidationError({
                              ...validationError,
                              postalcode: "",
                            })
                          }
                          mode={mode}
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, postalcode: e.target.value })
                          }
                          placeholder="Postal Code"
                          value={meta.postalcode}
                        />
                        {validationError.postalcode && (
                          <Error>{validationError.postalcode}</Error>
                        )}
                      </Plan>
                      <Plan>
                        <Label>Province</Label>
                        <FormControl
                          sx={{
                            margin: 0,
                            width: "100%",
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
                            value={meta.province}
                            onChange={(e) => {
                              setMeta({ ...meta, province: e.target.value });
                              setValidationError({
                                ...validationError,
                                province: "",
                              });
                            }}
                            displayEmpty
                          >
                            {region() === "NGN"
                              ? states.Nigeria.map((x) => (
                                  <MenuItem value={x}>{x}</MenuItem>
                                ))
                              : states.SouthAfrican.map((x) => (
                                  <MenuItem value={x}>{x}</MenuItem>
                                ))}
                          </Select>
                        </FormControl>
                        {console.log(validationError)}
                        {validationError.province && (
                          <Error>{validationError.province}</Error>
                        )}
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
                  ) : deliveryOption === "GIG Logistics" ? (
                    <Plans>
                      {locationerror && (
                        <div style={{ color: "red", textAlign: "center" }}>
                          {locationerror}
                        </div>
                      )}
                      <Plan>
                        <Input
                          onFocus={() =>
                            setValidationError({
                              ...validationError,
                              name: "",
                            })
                          }
                          mode={mode}
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, name: e.target.value })
                          }
                          placeholder="Name"
                          value={meta.name}
                        />
                        {validationError.name && (
                          <Error>{validationError.name}</Error>
                        )}
                      </Plan>
                      <Plan>
                        <Input
                          onFocus={() =>
                            setValidationError({
                              ...validationError,
                              phone: "",
                            })
                          }
                          mode={mode}
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, phone: e.target.value })
                          }
                          placeholder="Phone"
                          value={meta.phone}
                        />
                        {validationError.phone && (
                          <Error>{validationError.phone}</Error>
                        )}
                      </Plan>
                      <Plan>
                        <Input
                          onFocus={() =>
                            setValidationError({
                              ...validationError,
                              address: "",
                            })
                          }
                          mode={mode}
                          type="text"
                          onChange={(e) =>
                            setMeta({ ...meta, address: e.target.value })
                          }
                          placeholder="Address"
                          value={meta.address}
                        />
                        {validationError.address && (
                          <Error>{validationError.address}</Error>
                        )}
                      </Plan>
                      <Plan style={{ justifyContent: "unset" }}>
                        <div
                          style={{
                            fontSize: "14px",
                            marginLeft: "20px",
                            marginRight: "20px",
                            color: "grey",
                          }}
                        >
                          Select Station
                        </div>
                        <FormControl
                          sx={{
                            width: "80%",
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
                            onChange={(e) => {
                              setMeta({ ...meta, stationId: e.target.value });
                              setValidationError({
                                ...validationError,
                                stationId: "",
                              });
                            }}
                            displayEmpty
                            value={meta.stationId}
                          >
                            {loadingStations ? (
                              <MenuItem value="">Loading...</MenuItem>
                            ) : (
                              stations.map((station) => (
                                <MenuItem value={station.StationId}>
                                  {station.StateName}
                                </MenuItem>
                              ))
                            )}
                          </Select>
                        </FormControl>
                        {validationError.stationId && (
                          <Error>{validationError.stationId}</Error>
                        )}
                      </Plan>
                      <a
                        className="link"
                        href="https://gig.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        How GIG works
                      </a>
                    </Plans>
                  ) : deliveryOption === "Pick up from Seller" ? (
                    <Plans>
                      <Plan>
                        <div style={{ fontSize: "12px" }}>
                          When using Pick Up From Seller, our system is
                          unfortunately not able to record the delivery process.
                          This means (you) the buyer makes arrangement with the
                          seller to pick up your order. The risk involved in
                          getting your product is expressly yours and not of
                          Repeddle, any affiliate or Delivery companies offered
                          on Repeddle.
                        </div>
                      </Plan>
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
              disabled={loadingGig}
              className="search-btn1"
              style={{ width: "100%" }}
              type="submit"
            >
              Continue
            </button>
          </div>
        </Form>
      </div>
    </Container>
  );
}
