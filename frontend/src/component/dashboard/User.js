import React, { useContext, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import {
  faBolt,
  faCalendarDays,
  faCheck,
  faDotCircle,
  faEnvelope,
  faLocationDot,
  faMoneyBill,
  faPhone,
  faPlus,
  faQuestionCircle,
  faTruck,
  faUpload,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Store } from "../../Store";
import axios from "axios";
import { getError, region, timeDifference } from "../../utils";
import LoadingBox from "../LoadingBox";
import SmallModel from "../SmallModel";
import moment from "moment";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { banks, states } from "../../constant";
import { signoutHandler } from "../Navbar";

const Container = styled.div`
  flex: 4;
  padding: 20px;
`;
const TitleCont = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Title = styled.h1``;
const AddButton = styled.button`
  width: 80px;
  border: none;
  padding: 5px;
  border-radius: 0.2rem;
  background: var(--green-color);
  color: var(--white-color);
  &:hover {
    background: var(--malon-color);
  }
`;
const UserContainer = styled.div`
  display: flex;
  margin-top: 20px;
  @media (max-width: 992px) {
    flex-direction: column;
    gap: 20px;
  }
`;
const Show = styled.div`
  flex: 1;
  padding: 20px;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  border-radius: 0.2rem;
`;
const Update = styled.div`
  flex: 2;
  padding: 20px;
  background: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev1)" : "var(--light-ev1)"};
  border-radius: 0.2rem;
  margin-left: 20px;
  @media (max-width: 992px) {
    margin-left: 0;
  }
`;
const ShowTop = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  @media (max-width: 992px) {
    flex-direction: column;
  }
`;
const Image = styled.img.attrs((props) => ({
  src: props.src,
  alt: props.alt,
}))`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  object-position: top;
`;
const TopTitle = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
`;
const Name = styled.span`
  font-weight: 600;
`;
const UserTitle = styled.span`
  font-weight: 300;
`;
const ShowBottom = styled.div`
  margin-top: 20px;
`;
const BottomTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
`;
const Username = styled.span`
  margin-left: 10px;
`;
const Info = styled.div`
  display: flex;
  align-items: center;
  margin: 20px 0;
  &.small {
    margin: 5px 0;
  }
  & svg {
    font-size: 14px;
  }
`;
const Left = styled.div``;
const Right = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const UpdateTitle = styled.span`
  font-size: 22px;
  font-weight: 600;
`;
const Form = styled.form`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  @media (max-width: 992px) {
    flex-direction: column;
    gap: 20px;
    width: 100%;
  }
`;
const Form2 = styled.form`
  display: flex;
  flex-direction: column;
  margin: 30px;
`;
const Item = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;
const Label = styled.label`
  margin-bottom: 5px;
  font-size: 14px;
  & svg {
    margin-right: 10px;
  }
`;
const TextInput = styled.input`
  border: none;
  width: 250px;
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
    font-size: 12px;
  }
`;
const Upload = styled.div`
  display: flex;
  align-items: center;
`;
const UploadImg = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 10px;
  object-fit: cover;
  margin-right: 20px;
`;
const UploadInput = styled.input`
  display: none;
`;
const UploadLabel = styled.label`
  & svg {
    cursor: pointer;
  }
`;
const UploadButton = styled.button`
  margin-top: 5px;
  border: none;
  border-radius: 0.2rem;
  cursor: pointer;
  padding: 5px;
  background: var(--orange-color);
  color: var(--white-color);
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

const Wallet = styled.div`
  position: absolute;
  top: 30px;
  right: 20px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 0.2rem;
  align-items: center;
  background-color: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev3)" : "var(--light-ev3)"};
  @media (max-width: 992px) {
    padding: 0 10px;
    position: static;
    margin: 10px;
    flex-direction: row;
  }
`;
const Wbalance = styled.div`
  font-size: 10px;
`;
const Wamount = styled.div`
  font-size: 25px;
  font-weight: 300;
  @media (max-width: 992px) {
    font-size: 20px;
    margin-left: 10px;
  }
`;
const AccButton = styled.div`
  margin-left: 5px;
  padding: 5px;
  border-radius: 0.2rem;
  cursor: pointer;
  &:hover {
    background: var(--malon-color);
  }
`;
const InfoCont = styled.div`
  padding: 0 20px;
`;
const Key = styled.div`
  flex: 1;
`;
const Value = styled.div`
  flex: 2;
  margin-left: 15px;
`;

const Textarea = styled.textarea`
  background: none;
  height: 100px;
  &:focus-visible {
    outline: none;
    border: 1px solid var(--orange-color);
    color: ${(props) => (props.mode === "pagebodydark" ? "white" : "black")};
  }
`;

const OptionCont = styled.div`
  margin: 10px 0;
`;
const Plans = styled.div`
  & a {
    color: var(--orange-color);
    text-decoration: underline;
  }
`;
const Plan = styled.div`
  display: flex;
  align-items: center;
  margin: 8px 0;
  justify-content: space-between;
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

const Tips = styled.span`
  position: relative;
  &:hover::after {
    content: "${(props) => props.tips}";
    width: 400px;
    position: absolute;
    border-radius: 0.5rem;
    left: -180px;
    top: 20px;
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
      font-size: 11px;
      left: -90px;
      top: 20px;
      width: 200px;
    }
  }
  & svg {
    margin-left: 10px;
    color: #d4d4d4;
  }
`;

const Option = styled.div`
  margin: 8px 0;
  display: flex;
  justify-content: space-between;
`;

const Status = styled.div`
  & svg {
    margin-right: 10px;
  }
  &.active {
    color: var(--orange-color);
  }
  &.banned {
    color: var(--malon-color);
  }
`;

const Imagediv = styled.div`
  position: relative;
`;

const Badge = styled.img`
  width: 20px !important;
  object-fit: cover !important;
`;

const Input = styled.input`
  width: 100%;
  height: 30px;
  border: 1px solid
    ${(props) =>
      props.mode === "pagebodydark" ? "var(--dark-ev3)" : "var(--light-ev3)"};
  background: none;
  padding-left: 10px;
  margin-right: 5;
  color: ${(props) =>
    props.mode === "pagebodydark"
      ? "var(--white-color)"
      : "var(--black-color)"};
  &:focus {
    outline: none;
    border: 1px solid var(--orange-color);
  }
  &::placeholder {
    font-size: 14px;
  }
`;

const Button = styled.div`
  padding: 5px 7px;
  cursor: pointer;
  color: white;
  background: var(--orange-color);
  border-radius: 0.2rem;
  &:hover {
    background: var(--malon-color);
  }
`;

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, user: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_REQUEST":
      return { ...state, loadingUpdate: true };
    case "UPDATE_SUCCESS":
      return { ...state, loadingUpdate: false };
    case "UPDATE_FAIL":
      return { ...state, loadingUpdate: false };
    case "UPLOAD_REQUEST":
      return { ...state, loadingUpload: true };
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

export default function User() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { mode, userInfo } = state;
  const params = useParams();
  const { id } = params;

  const [
    { loading, error, loadingUpdate, user, loadingUpload, errorUpload },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
    loadingUpdate: "",
    user: {},
  });

  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [phone, setPhone] = useState("");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState("");
  const [active, setActive] = useState("");
  const [badge, setBadge] = useState("");
  const [influencer, setInfluencer] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [showModelAddress, setShowModelAddress] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [username, setUsername] = useState("");

  const [input, setInput] = useState({});
  const [errorInput, setErrorInput] = useState("");

  const [bundle, setBundle] = useState("");

  useEffect(() => {
    try {
      dispatch({ type: "FETCH_REQUEST" });

      if (id) {
        const fetchUser = async () => {
          try {
            const { data } = await axios.get(`/api/users/seller/${id}`, {
              headers: {
                Authorization: `Bearer ${userInfo.token}`,
              },
            });
            dispatch({ type: "FETCH_SUCCESS", payload: data });
            setRebundleStatus(data.rebundle.status);
            setNewsletterStatus(data.newsletter);
            setActive(`${data.active}`);
            setBadge(`${data.badge}`);
            setBundle(data.rebundle.status);
            setInfluencer(`${data.influencer}`);
          } catch (error) {
            signoutHandler();
          }
        };
        fetchUser();
      } else {
        const fetchUser = async () => {
          const { data } = await axios.get(`/api/users/profile/user`, {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          });
          dispatch({ type: "FETCH_SUCCESS", payload: data });
          setBundle(data.rebundle.status);
          setNewsletterStatus(data.newsletter);
          setRebundleStatus(data.rebundle.status);
        };
        fetchUser();
      }
    } catch (err) {
      dispatch({ type: "FETCH_FAIL" });
      console.log(getError(err));
    }
  }, [id, userInfo]);

  const [balance, setBalance] = useState(0);
  useEffect(() => {
    try {
      if (id) {
        const getBalance = async () => {
          const { data } = await axios.get(`/api/accounts/balance/${id}`, {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          setBalance(data);
        };
        getBalance();
      } else {
        const getBalance = async () => {
          const { data } = await axios.get("/api/accounts/balance", {
            headers: { authorization: `Bearer ${userInfo.token}` },
          });
          setBalance(data);
        };
        getBalance();
      }
    } catch (err) {
      console.log(getError(err));
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    console.log("alone");
    e.preventDefault();

    try {
      if (!id && password !== confirmPassword) {
        ctxDispatch({
          type: "SHOW_TOAST",
          payload: {
            message: "Password do not match",
            showStatus: true,
            state1: "visible1 error",
          },
        });
        return;
      }
      if (username.length > 0) {
        const confirm = window.confirm(
          "Are you sure you want to edit your username? The next edit window  will be after 30 days"
        );
        if (!confirm) {
          return;
        }
      }

      if (rebundleStatus && !bundle) {
        setRebundleError("Click activate to make Rebundle active ");
        return;
      }

      dispatch({ type: "UPDATE_REQUEST" });

      const { data } = await axios.put(
        id ? `/api/users/${user._id}` : `/api/users/profile`,
        {
          _id: user._id,
          firstName,
          lastName,
          email,
          dob,
          phone,
          username,
          address: {
            street: input.street,
            apartment: input.apartment,
            state: input.state,
            zipcode: input.zipcode,
          },
          image,
          active,
          influencer,
          badge,
          about,
          password,
          accountName: input.accountName,
          accountNumber: input.accountNumber,
          bankName: input.bankName,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      if (!(id && userInfo.isAdmin)) {
        ctxDispatch({ type: "USER_SIGNIN", payload: data });
      }
      dispatch({ type: "UPDATE_SUCCESS" });
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: "User Updated",
          showStatus: true,
          state1: "visible1 success",
        },
      });
      navigate(id ? "/dashboard/userlist" : `../../seller/${user._id}`);
    } catch (err) {
      console.log(getError(err));
      dispatch({ type: "UPDATE_FAIL" });
      ctxDispatch({
        type: "SHOW_TOAST",
        payload: {
          message: getError(err),
          showStatus: true,
          state1: "visible1 errorr",
        },
      });
    }
  };

  const addressValidate = (e) => {
    e.preventDefault();
    let valid = true;
    if (!input.street) {
      handleError("Enter your street", "street");
      valid = false;
    }
    // if (!input.apartment) {
    //   handleError("Enter your apartment", "apartment");
    //   valid = false;
    // }
    if (!input.state) {
      handleError("Select your province", "province");
      valid = false;
    }
    if (!input.zipcode) {
      handleError("Enter your zip code", "zipcode");
      valid = false;
    }

    if (valid) {
      submitHandler(e);
    }
  };

  const accountValidate = (e) => {
    e.preventDefault();
    let valid = true;
    if (!input.accountNumber) {
      handleError("Enter a valid account number", "accountNumber");
      valid = false;
    }
    if (!input.accountName) {
      handleError("Enter a valid account name", "accountName");
      valid = false;
    }
    if (!input.bankName) {
      handleError("Select a valid bank", "bankName");
      valid = false;
    }

    if (valid) {
      submitHandler(e);
    }
  };

  const handleOnChange = (text, input) => {
    setInput((prevState) => ({ ...prevState, [input]: text }));
  };
  const handleError = (errorMessage, input) => {
    setErrorInput((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  const uploadHandler = async (e) => {
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

  const daydiff =
    user.usernameUpdate &&
    30 - timeDifference(new Date(user.usernameUpdate), new Date());

  const [rebundleStatus, setRebundleStatus] = useState("");
  const [rebundleCount, setRebundleCount] = useState(0);
  const [loadingRebundle, setLoadingRebundle] = useState(false);
  const [rebundleError, setRebundleError] = useState("");

  const [newsletterStatus, setNewsletterStatus] = useState(user.newsletter);

  const handleRebundle = async (value) => {
    if (value) {
      const { data } = await axios.put("/api/users/bundle", value, {
        headers: {
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      setBundle(data.status);
      return;
    }
    if (!rebundleCount) {
      setRebundleError("Enter the quantity of item(s) for Rebundle");
      return;
    }
    try {
      setLoadingRebundle(true);
      const { data } = await axios.put(
        "/api/users/bundle",
        { status: rebundleStatus, count: rebundleCount },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      );
      setBundle(data.status);
      setRebundleStatus(data.status);
      setLoadingRebundle(false);
    } catch (err) {
      setLoadingRebundle(false);
      console.log(getError(err));
    }
  };

  const handleNewsletter = async () => {
    try {
      if (newsletterStatus) {
        // Unsubscribe from the newsletter
        await axios.delete("/api/newsletters", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setNewsletterStatus(false);
        ctxDispatch({
          type: "SHOW_TOAST",
          payload: {
            message: "Unsubscribed from newsletter",
            showStatus: true,
            state1: "visible1 error",
          },
        });
      } else {
        // Subscribe to the newsletter
        await axios.post(`/api/newsletters/${region()}`, {
          email: user.email,
          emailType: "Newsletter",
        });
        setNewsletterStatus(true);
        ctxDispatch({
          type: "SHOW_TOAST",
          payload: {
            message: "Subscribed for newsletter",
            showStatus: true,
            state1: "visible1 success",
          },
        });
      }
    } catch (error) {
      console.log("Error updating newsletter status:", error);
    }
  };

  return (
    <Container>
      <TitleCont>
        <Title>Edit User</Title>
      </TitleCont>
      <UserContainer>
        <Show mode={mode}>
          <ShowTop>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Imagediv>
                <Image src={user.image} alt="p" />
                {user.badge && (
                  <div
                    className="seller_profile_badge"
                    style={{ right: "0px", bottom: "0px" }}
                  >
                    <Badge src="https://res.cloudinary.com/emirace/image/upload/v1661148671/Icons-28_hfzerc.png" />
                  </div>
                )}
              </Imagediv>
              <TopTitle>
                <Name>
                  {user.name || user.firstName} {user.lastName}
                </Name>
                <UserTitle>
                  {user.isAdmin ? "Admin" : user.isSeller ? "Seller" : "Buyer"}
                </UserTitle>
                {user.active ? (
                  <Status className="active">
                    <FontAwesomeIcon icon={faBolt} /> Active
                  </Status>
                ) : (
                  <Status className="banned">
                    <FontAwesomeIcon icon={faBolt} /> Banned
                  </Status>
                )}
              </TopTitle>
            </div>
            <Wallet mode={mode}>
              <Wbalance>Wallet Balance</Wbalance>
              <Wamount>
                {balance.currency}
                {balance && balance.balance.toFixed(2)}
              </Wamount>
            </Wallet>
          </ShowTop>
          <ShowBottom>
            <BottomTitle>Account Details</BottomTitle>
            <Info>
              <FontAwesomeIcon icon={faUser} />
              <Username>@{user.username}</Username>
            </Info>
            <Info>
              <FontAwesomeIcon icon={faDotCircle} />
              <Username>@{user._id}</Username>
            </Info>
            <Info>
              <FontAwesomeIcon icon={faCalendarDays} />
              <Username>DOB {user.dob && user.dob.substring(0, 10)}</Username>
            </Info>
            <BottomTitle>Account Details</BottomTitle>

            <Info>
              <FontAwesomeIcon icon={faPhone} />
              <Username>{user.phone}</Username>
            </Info>
            <Info>
              <FontAwesomeIcon icon={faEnvelope} />
              <Username>{user.email}</Username>
            </Info>
            <Info>
              <FontAwesomeIcon icon={faLocationDot} />
              <Username>Address Information</Username>

              <AccButton
                onClick={() => {
                  setShowModelAddress(!showModelAddress);
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
              </AccButton>
            </Info>
            {user?.address?.street && (
              <InfoCont>
                <Info className="small">
                  <Key>Street</Key>
                  <Value>{user.address.street}</Value>
                </Info>
                <Info className="small">
                  <Key>Apartment / Complex</Key>
                  <Value>{user.address.apartment}</Value>
                </Info>
                <Info className="small">
                  <Key>State</Key>
                  <Value>{user.address.state}</Value>
                </Info>
                <Info className="small">
                  <Key>Zipcode</Key>
                  <Value>{user.address.zipcode}</Value>
                </Info>
              </InfoCont>
            )}
            <Info>
              <FontAwesomeIcon icon={faMoneyBill} />
              <Username>Bank Account Detail</Username>
              {(userInfo.isAdmin ||
                (!user.accountNumber && !userInfo.isAdmin)) && (
                <AccButton onClick={() => setShowModel(!showModel)}>
                  <FontAwesomeIcon icon={faPlus} />
                </AccButton>
              )}
              <Tips
                mode={mode}
                tips={`Note: Your Account details cannot be changed once saved, please contact admin or support  center to make any change`}
              >
                <FontAwesomeIcon icon={faQuestionCircle} />
              </Tips>
              <SmallModel showModel={showModel} setShowModel={setShowModel}>
                <Form2>
                  <p>
                    To become a Seller, kindly provide your banking details
                    where you can transfer your earnings deposited in your
                    Repeddle wallet
                  </p>
                  <Item>
                    <Label>Account Name</Label>
                    <TextInput
                      mode={mode}
                      name="accountName"
                      placeholder={user.accountName}
                      type="text"
                      onChange={(e) =>
                        handleOnChange(e.target.value, "accountName")
                      }
                      onFocus={() => handleError("", "accountName")}
                    />
                  </Item>
                  {errorInput.accountName && (
                    <div style={{ color: "red" }}>{errorInput.accountName}</div>
                  )}
                  <Item>
                    <Label>Account Number</Label>
                    <TextInput
                      mode={mode}
                      placeholder={user.accountNumber}
                      name="accountNumber"
                      type="number"
                      onChange={(e) =>
                        handleOnChange(e.target.value, "accountNumber")
                      }
                      onFocus={() => handleError("", "accountNumber")}
                    />
                  </Item>
                  {errorInput.accountNumber && (
                    <div style={{ color: "red" }}>
                      {errorInput.accountNumber}
                    </div>
                  )}
                  <Item>
                    <Label>Bank Name</Label>
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
                        onChange={(e) =>
                          handleOnChange(e.target.value, "bankName")
                        }
                        onFocus={() => handleError("", "bankName")}
                        displayEmpty
                      >
                        {region() === "NGN"
                          ? banks.Nigeria.map((x) => (
                              <MenuItem value={x.name}>{x.name}</MenuItem>
                            ))
                          : banks.SouthAfrica.map((x) => (
                              <MenuItem value={x.name}>{x.name}</MenuItem>
                            ))}
                      </Select>
                    </FormControl>
                  </Item>
                  {errorInput.bankName && (
                    <div style={{ color: "red" }}>{errorInput.bankName}</div>
                  )}
                  <div style={{ color: "var(--malon-color)" }}>
                    Note: This cannot be change once saved, contact support to
                    make any changes.
                  </div>
                  <UploadButton onClick={accountValidate}>Update</UploadButton>
                </Form2>
              </SmallModel>
            </Info>
            {user.accountNumber && (
              <InfoCont>
                <Info className="small">
                  <Key>Account Name</Key>
                  <Value>{user.accountName}</Value>
                </Info>
                <Info className="small">
                  <Key>Account Number</Key>
                  <Value>{user.accountNumber}</Value>
                </Info>
                <Info className="small">
                  <Key>Bank Name</Key>
                  <Value>{user.bankName}</Value>
                </Info>
              </InfoCont>
            )}
            <SmallModel
              showModel={showModelAddress}
              setShowModel={setShowModelAddress}
            >
              <Form2>
                <p>
                  The provided address may be use for return should there be a
                  need. This address is not displayed to buyers.
                </p>
                <Item>
                  <Label>Street</Label>
                  <TextInput
                    mode={mode}
                    name="street"
                    type="text"
                    onChange={(e) => handleOnChange(e.target.value, "street")}
                    onFocus={() => handleError("", "street")}
                  />
                </Item>
                {errorInput.street && (
                  <div style={{ color: "red" }}>{errorInput.street}</div>
                )}
                <Item>
                  <Label>Apartment/Complex</Label>
                  <TextInput
                    mode={mode}
                    name="apartment"
                    type="text"
                    onChange={(e) =>
                      handleOnChange(e.target.value, "apartment")
                    }
                    onFocus={() => handleError("", "apartment")}
                  />
                </Item>
                {errorInput.apartment && (
                  <div style={{ color: "red" }}>{errorInput.apartment}</div>
                )}
                <Item>
                  <Label>{region() === "NGN" ? "State" : "Province"}</Label>
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
                      value={input.state}
                      onChange={(e) => handleOnChange(e.target.value, "state")}
                      onFocus={() => handleError("", "state")}
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
                </Item>
                {errorInput.state && (
                  <div style={{ color: "red" }}>{errorInput.state}</div>
                )}
                <Item>
                  <Label>Zip Code</Label>
                  <TextInput
                    mode={mode}
                    name="zipcode"
                    value={input.zipcode}
                    type="number"
                    onChange={(e) => handleOnChange(e.target.value, "zipcode")}
                    onFocus={() => handleError("", "zipcode")}
                  />
                </Item>
                <div style={{ color: "var(--malon-color)" }}>
                  Note: This can be editted later in your profile screen
                </div>
                {errorInput.zipcode && (
                  <div style={{ color: "red" }}>{errorInput.zipcode}</div>
                )}
                <UploadButton onClick={addressValidate}>Update</UploadButton>
              </Form2>
            </SmallModel>
          </ShowBottom>
        </Show>
        <Update mode={mode}>
          <UpdateTitle>Edit</UpdateTitle>
          <Form onSubmit={submitHandler}>
            <Left>
              <Item>
                <Label>Username</Label>
                {daydiff > 0 && (
                  <div
                    style={{ fontSize: "12px", color: "var(--malon-color)" }}
                  >
                    updated {moment(user.usernameUpdate).fromNow()}, next update
                    in {daydiff} days
                  </div>
                )}
                {console.log("daydiff", daydiff)}
                <TextInput
                  mode={mode}
                  disabled={daydiff > 0}
                  placeholder={user.username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Item>
              <Item>
                <Label>First Name</Label>
                <TextInput
                  mode={mode}
                  placeholder={user.firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Item>

              <Item>
                <Label>Last Name</Label>
                <TextInput
                  mode={mode}
                  placeholder={user.lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Item>
              <Item>
                <Label>Email</Label>
                <TextInput
                  name="email"
                  type="email"
                  mode={mode}
                  disabled={id ? false : true}
                  placeholder={user.email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Item>
              <Item>
                <Label>DOB</Label>
                <TextInput
                  type="date"
                  mode={mode}
                  name="DOB"
                  placeholder={user.dob && user.dob.substring(0, 10)}
                  onChange={(e) => setDob(e.target.value)}
                />
              </Item>
              <Item>
                <Label>Phone</Label>
                <TextInput
                  mode={mode}
                  type="text"
                  name="phone"
                  placeholder={user.phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Item>
              <Item>
                <Label>About</Label>
                <Textarea
                  mode={mode}
                  onChange={(e) => setAbout(e.target.value)}
                >
                  {user.about}
                </Textarea>
              </Item>
            </Left>
            <Right>
              <Upload>
                {loadingUpload ? (
                  <LoadingBox></LoadingBox>
                ) : (
                  <UploadImg
                    src={
                      image
                        ? image
                        : user.image
                        ? user.image
                        : "/images/pimage.png"
                    }
                    alt=""
                  />
                )}
                <UploadLabel htmlFor="file">
                  <FontAwesomeIcon icon={faUpload} />
                </UploadLabel>
                <UploadInput
                  type="file"
                  id="file"
                  onChange={(e) => uploadHandler(e)}
                />
              </Upload>
              <div>
                {id && userInfo.isAdmin ? (
                  <>
                    <Label>Active</Label>
                    <div
                      style={{ fontSize: "12px", color: "var(--malon-color)" }}
                    >
                      updated {moment(user.activeUpdate).fromNow()}
                    </div>
                    <Gender mode={mode}>
                      <input
                        checked={active === "true"}
                        type="radio"
                        name="gender"
                        id="yes"
                        value={true}
                        onChange={(e) => setActive(e.target.value)}
                      />
                      <Label htmlFor="yes">Yes</Label>
                      <input
                        checked={active === "false"}
                        type="radio"
                        name="gender"
                        id="no"
                        value={false}
                        onClick={(e) => setActive(e.target.value)}
                      />
                      <Label htmlFor="no">No</Label>
                    </Gender>
                    <Label>Badge</Label>
                    <Gender mode={mode}>
                      <input
                        checked={badge === "true"}
                        type="radio"
                        name="badge"
                        id="badgeyes"
                        value={true}
                        onClick={(e) => setBadge(e.target.value)}
                      />
                      <Label htmlFor="badgeyes">Yes</Label>
                      <input
                        checked={badge === "false"}
                        type="radio"
                        name="badge"
                        id="badgeno"
                        value={false}
                        onChange={(e) => setBadge(e.target.value)}
                      />
                      <Label htmlFor="badgeno">No</Label>
                    </Gender>
                    <Label>Influencer</Label>
                    <Gender mode={mode}>
                      <input
                        checked={influencer === "true"}
                        type="radio"
                        name="influencer"
                        id="influenceryes"
                        value={true}
                        onClick={(e) => setInfluencer(e.target.value)}
                      />
                      {console.log("influencer", influencer)}
                      <Label htmlFor="influenceryes">Yes</Label>
                      <input
                        checked={influencer === "false"}
                        type="radio"
                        name="influencer"
                        id="influencerno"
                        value={false}
                        onChange={(e) => setInfluencer(e.target.value)}
                      />
                      <Label htmlFor="influencerno">No</Label>
                    </Gender>
                  </>
                ) : (
                  <>
                    <Item>
                      <Label>Password</Label>
                      <TextInput
                        mode={mode}
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </Item>
                    <Item>
                      <Label>Confirm Password</Label>
                      <TextInput
                        mode={mode}
                        name="confirmPassword"
                        type="password"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </Item>
                    <Option>
                      <Label>Subscribe to Newsletter</Label>
                      <Switch
                        mode={mode}
                        checked={newsletterStatus}
                        onChange={handleNewsletter}
                      />
                    </Option>
                    <OptionCont>
                      <Option>
                        <Label>
                          <FontAwesomeIcon icon={faTruck} />
                          <Name>Re:Bundle</Name>
                          <Tips
                            mode={mode}
                            tips={`
            Re:bundle allows buyers to shop multiple items from your store and only pay for delivery once! The buyer will be charged delivery on their first purchase, and, if they make any additional purchases within the next 2 hours, free delivery will then automatically apply. Shops who enable bundling sell more and faster.       `}
                          >
                            <FontAwesomeIcon icon={faQuestionCircle} />
                          </Tips>
                        </Label>
                        <Switch
                          mode={mode}
                          checked={rebundleStatus}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setRebundleStatus(e.target.checked);
                            } else {
                              setRebundleStatus(e.target.checked);
                              handleRebundle({ status: false, count: 0 });
                            }
                          }}
                        ></Switch>
                      </Option>
                      <div
                        style={{
                          width: "100%",
                          height: "1px",
                          background: "#d4d4d4",
                        }}
                      />
                      {rebundleStatus && (
                        <Plans>
                          {bundle ? (
                            <div>
                              <FontAwesomeIcon
                                icon={faCheck}
                                style={{ color: "var(--orange-color)" }}
                              />
                            </div>
                          ) : (
                            <>
                              <div style={{ fontWeight: "11px" }}>
                                Please input numbers of how many item(s) you are
                                willing to pack in delivery bag(s) for a buyer
                                when Rebundle is active
                              </div>
                              <Plan>
                                <Input
                                  mode={mode}
                                  type="number"
                                  onChange={(e) =>
                                    setRebundleCount(e.target.value)
                                  }
                                  onFocus={() => setRebundleError("")}
                                />
                                {loadingRebundle ? (
                                  <LoadingBox />
                                ) : (
                                  <Button onClick={() => handleRebundle(null)}>
                                    Activate
                                  </Button>
                                )}
                              </Plan>
                              {rebundleError && (
                                <div style={{ color: "red" }}>
                                  {rebundleError}
                                </div>
                              )}
                            </>
                          )}
                          <Link to="/rebundle" target="_blank">
                            More on Re:bundle
                          </Link>
                        </Plans>
                      )}
                    </OptionCont>
                  </>
                )}
              </div>
              <UploadButton type="submit">Update</UploadButton>
              {loadingUpdate ? <LoadingBox></LoadingBox> : ""}
            </Right>
          </Form>
        </Update>
      </UserContainer>
    </Container>
  );
}
