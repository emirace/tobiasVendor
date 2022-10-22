import React, { useContext, useEffect, useReducer, useState } from "react";
import styled from "styled-components";
import {
  faCalendarDays,
  faEnvelope,
  faLocationDot,
  faMoneyBill,
  faPhone,
  faPlus,
  faUpload,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Store } from "../../Store";
import axios from "axios";
import { getError, timeDifference } from "../../utils";
import LoadingBox from "../LoadingBox";
import SmallModel from "../SmallModel";
import moment from "moment";

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
  top: 0;
  right: 20px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 0.2rem;
  align-items: center;
  background-color: ${(props) =>
    props.mode === "pagebodydark" ? "var(--dark-ev3)" : "var(--light-ev3)"};
`;
const Wbalance = styled.div`
  font-size: 10px;
`;
const Wamount = styled.div`
  font-size: 25px;
  font-weight: 300;
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
  const [address, setAddress] = useState("");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState("");
  const [active, setActive] = useState("");
  const [badge, setBadge] = useState("");
  const [influencer, setInfluencer] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    try {
      dispatch({ type: "FETCH_REQUEST" });

      if (id) {
        const fetchUser = async () => {
          const { data } = await axios.get(`/api/users/seller/${id}`, {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          });
          dispatch({ type: "FETCH_SUCCESS", payload: data });
          setActive(`${data.active}`);
          setBadge(`${data.badge}`);
          setInfluencer(`${data.influencer}`);
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
      const getBalance = async () => {
        const { data } = await axios.get("/api/accounts/balance", {
          headers: { authorization: `Bearer ${userInfo.token}` },
        });
        setBalance(data);
      };
      getBalance();
    } catch (err) {
      console.log(getError(err));
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
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
        if (
          window.confirm(
            "Are you sure you want to edit your username? The next edit window  will be after 30 days"
          )
        ) {
          return;
        }
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
          address,
          image,
          active,
          influencer,
          badge,
          password,
          accountName,
          accountNumber,
          bankName,
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
    }
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

  return (
    <Container>
      <TitleCont>
        <Title>Edit User</Title>
      </TitleCont>
      <UserContainer>
        <Show mode={mode}>
          <ShowTop>
            <Image src={user.image} alt="p" />
            <TopTitle>
              <Name>
                {user.name || user.firstName} {user.lastName}
              </Name>
              <UserTitle>
                {user.isAdmin ? "Admin" : user.isSeller ? "Seller" : "Buyer"}
              </UserTitle>
            </TopTitle>
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
              <Username>{user.address}</Username>
            </Info>
            <Info>
              <FontAwesomeIcon icon={faMoneyBill} />
              <Username>Bank Account Detail</Username>
              <AccButton onClick={() => setShowModel(!showModel)}>
                <FontAwesomeIcon icon={faPlus} />
              </AccButton>
              <SmallModel showModel={showModel} setShowModel={setShowModel}>
                <Form2>
                  <Item>
                    <Label>Account Name</Label>
                    <TextInput
                      mode={mode}
                      name="accountName"
                      placeholder={user.accountName}
                      type="text"
                      onChange={(e) => setAccountName(e.target.value)}
                    />
                  </Item>
                  <Item>
                    <Label>Account Number</Label>
                    <TextInput
                      mode={mode}
                      placeholder={user.accountNumber}
                      name="accountNumber"
                      type="number"
                      onChange={(e) => setAccountNumber(e.target.value)}
                    />
                  </Item>
                  <Item>
                    <Label>Bank Name</Label>
                    <TextInput
                      mode={mode}
                      name="bankName"
                      placeholder={user.bankName}
                      type="text"
                      onChange={(e) => setBankName(e.target.value)}
                    />
                  </Item>
                  <UploadButton onClick={submitHandler}>Update</UploadButton>
                </Form2>
              </SmallModel>
            </Info>

            <Info>
              <Username>{user.accountName}</Username>
              <Username>{user.accountNumber}</Username>
              <Username>{user.bankName}</Username>
            </Info>
          </ShowBottom>
        </Show>
        <Update mode={mode}>
          <UpdateTitle>Edit</UpdateTitle>
          <Form onSubmit={submitHandler}>
            <Left>
              <Item>
                <Label>Username</Label>
                {daydiff && (
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
                  disabled={daydiff}
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
                  mode={mode}
                  placeholder={user.email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Item>
              <Item>
                <Label>DOB</Label>
                <TextInput
                  type="date"
                  mode={mode}
                  placeholder={user.dob && user.dob.substring(0, 10)}
                  onChange={(e) => setDob(e.target.value)}
                />
              </Item>
              <Item>
                <Label>Phone</Label>
                <TextInput
                  mode={mode}
                  placeholder={user.phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Item>
              <Item>
                <Label>Address</Label>
                <TextInput
                  mode={mode}
                  placeholder={user.address}
                  onChange={(e) => setAddress(e.target.value)}
                />
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
