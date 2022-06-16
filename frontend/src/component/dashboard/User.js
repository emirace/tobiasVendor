import React, { useContext, useEffect, useReducer, useState } from 'react';
import styled from 'styled-components';
import {
  faCalendarDays,
  faEnvelope,
  faLocationDot,
  faPhone,
  faUpload,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Store } from '../../Store';
import axios from 'axios';
import { getError } from '../../utils';
import LoadingBox from '../LoadingBox';

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
`;
const UserContainer = styled.div`
  display: flex;
  margin-top: 20px;
`;
const Show = styled.div`
  flex: 1;
  padding: 20px;
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev1)' : 'var(--light-ev1)'};
  border-radius: 0.2rem;
`;
const Update = styled.div`
  flex: 2;
  padding: 20px;
  background: ${(props) =>
    props.mode === 'pagebodydark' ? 'var(--dark-ev1)' : 'var(--light-ev1)'};
  border-radius: 0.2rem;
  margin-left: 20px;
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
      props.mode === 'pagebodydark' ? 'var(--dark-ev3)' : 'var(--light-ev3)'};
  background: none;
  padding-left: 10px;
  color: ${(props) =>
    props.mode === 'pagebodydark'
      ? 'var(--white-color)'
      : 'var(--black-color)'};
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
      content: '';
      display: inline-block;
      visibility: visible;
      border-radius: 15px;
      position: relative;
      top: -2px;
      left: -1px;
      background-color: ${(props) =>
        props.mode === 'pagebodydark'
          ? 'var(--black-color)'
          : 'var(--white-color)'};
      border: 1px solid var(--orange-color);
    }
    &:checked::after {
      width: 15px;
      height: 15px;
      content: '';
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
    props.mode === 'pagebodydark' ? 'var(--dark-ev3)' : 'var(--light-ev3)'};
`;
const Wbalance = styled.div`
  font-size: 10px;
`;
const Wamount = styled.div`
  font-size: 25px;
  font-weight: 300;
`;

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, user: action.payload };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true };
    case 'UPLOAD_SUCCESS':
      return { ...state, loadingUpload: false, errorUpload: '' };
    case 'UPLOAD_FAIL':
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
    error: '',
    loadingUpdate: '',
    user: {},
  });
  console.log('user', user);

  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState('');
  const [active, setActive] = useState('');
  const [badge, setBadge] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    try {
      dispatch({ type: 'FETCH_REQUEST' });
      if (id) {
        const fetchUser = async () => {
          const { data } = await axios.get(`/api/users/seller/${id}`, {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          });
          dispatch({ type: 'FETCH_SUCCESS', payload: data });
        };
        fetchUser();
      }
    } catch (err) {
      dispatch({ type: 'FETCH_FAIL' });
      console.log(err);
    }
  }, [id, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/users/${user._id}`,
        {
          _id: user._id,
          name,
          email,
          dob,
          phone,
          address,
          image,
          active,
          badge,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'UPDATE_SUCCESS' });
      ctxDispatch({
        type: 'SHOW_TOAST',
        payload: {
          message: 'User Updated',
          showStatus: true,
          state1: 'visible1 success',
        },
      });
      navigate('/dashboard/userlist');
    } catch (err) {
      console.log(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  const uploadHandler = async (e) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });
      setImage(data.secure_url);
      ctxDispatch({
        type: 'SHOW_TOAST',
        payload: {
          message: 'Image Uploaded',
          showStatus: true,
          state1: 'visible1 success',
        },
      });
    } catch (err) {
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
      ctxDispatch({
        type: 'SHOW_TOAST',
        payload: {
          message: 'Failed uploading image',
          showStatus: true,
          state1: 'visible1 error',
        },
      });
      console.log(getError(err));
    }
  };

  return (
    <Container>
      <TitleCont>
        <Title>Edit User</Title>
        <Link to="/dashboard/newuser">
          <AddButton>Create</AddButton>
        </Link>
      </TitleCont>
      <UserContainer>
        <Show mode={mode}>
          <ShowTop>
            <Image src={user.image} alt="p" />
            <TopTitle>
              <Name>{user.name}</Name>
              <UserTitle>{user.isAdmin ? 'Admin' : 'Seller'}</UserTitle>
            </TopTitle>
            <Wallet mode={mode}>
              <Wbalance>Wallet Balance</Wbalance>
              <Wamount>$30</Wamount>
            </Wallet>
          </ShowTop>
          <ShowBottom>
            <BottomTitle>Account Details</BottomTitle>
            <Info>
              <FontAwesomeIcon icon={faUser} />
              <Username>@{user.name}</Username>
            </Info>
            <Info>
              <FontAwesomeIcon icon={faCalendarDays} />
              <Username>
                Joined {user.dob && user.dob.substring(0, 10)}
              </Username>
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
          </ShowBottom>
        </Show>
        <Update mode={mode}>
          <UpdateTitle>Edit</UpdateTitle>
          <Form onSubmit={submitHandler}>
            <Left>
              <Item>
                <Label>Full Name</Label>
                <TextInput
                  mode={mode}
                  placeholder={user.name}
                  onChange={(e) => setName(e.target.value)}
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
                        : '/images/pimage.png'
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
                <Label>Active</Label>
                <Gender mode={mode}>
                  <input
                    checked={
                      active === 'yes' ? true : user.active ? true : false
                    }
                    type="radio"
                    name="gender"
                    id="yes"
                    value="yes"
                    onChange={(e) => setActive(e.target.value)}
                  />
                  <Label htmlFor="yes">Yes</Label>
                  <input
                    checked={
                      active === 'no' ? true : !user.active ? true : false
                    }
                    type="radio"
                    name="gender"
                    id="no"
                    value="no"
                    onClick={(e) => setActive(e.target.value)}
                  />
                  <Label htmlFor="no">No</Label>
                </Gender>
                <Label>Badge</Label>
                <Gender mode={mode}>
                  <input
                    checked={badge === 'yes' ? true : user.badge ? true : false}
                    type="radio"
                    name="badge"
                    id="badgeyes"
                    value="yes"
                    onClick={(e) => setBadge(e.target.value)}
                  />
                  <Label htmlFor="badgeyes">Yes</Label>
                  <input
                    checked={badge === 'no' ? true : !user.badge ? true : false}
                    type="radio"
                    name="badge"
                    id="badgeno"
                    value="no"
                    onChange={(e) => setBadge(e.target.value)}
                  />
                  <Label htmlFor="badgeno">No</Label>
                </Gender>
              </div>
              <UploadButton type="submit">Update</UploadButton>
              {loadingUpdate ? <LoadingBox></LoadingBox> : ''}
            </Right>
          </Form>
        </Update>
      </UserContainer>
    </Container>
  );
}
