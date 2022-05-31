import axios from 'axios';
import React, { useContext, useReducer, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import LoadingBox from '../component/LoadingBox';
import { Store } from '../Store';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
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
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
};
export default function ProfileScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [password, setPassword] = useState('');
  const [image, setImage] = useState('');
  const [about, setAbout] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const [sellerName, setSellerName] = useState(userInfo.seller.name || '');
  // const [sellerLogo, setSellerLogo] = useState(userInfo.seller.logo || '');
  // const [sellerDescription, setsellerDescription] = useState(
  //   userInfo.seller.description || ''
  // );

  const [{ loadingUpdate, loadingUpload }, dispatch] = useReducer(reducer, {
    loadingUpdate: false,
    loadingUpload: false,
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        '/api/users/profile',
        {
          _id: userInfo._id,
          name,
          email,
          password,
          image,
          about,
          // sellerName,
          // sellerLogo,
          // sellerDescription,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      ctxDispatch({ type: 'USER_SIGNIN', payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
      toast.success('User updated successfully');
    } catch (err) {
      dispatch({ type: 'FETCH_FAIL' });
      toast.error(getError(err));
    }
  };

  const uploadFileHandler = async (e, fileType) => {
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    try {
      dispatch({ type: 'UPLOAD_REQUEST' });
      console.log('b4 axios');
      const { data } = await axios.post('/api/upload', bodyFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      dispatch({ type: 'UPLOAD_SUCCESS' });
      setImage(data.secure_url);
      toast.success('Image uploaded successfully, click Update to apply It');
    } catch (err) {
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  return (
    <div className="container small-container">
      <Helmet>
        <title>User Profile</title>
      </Helmet>
      <h1>User Profile</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3" controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group as={Col} className="mb-3" controlId="image">
          <Form.Label>Change Profile Image</Form.Label>
          <Form.Control
            required
            type="file"
            onChange={(e) => uploadFileHandler(e, 'image')}
          />
          {loadingUpload ? <LoadingBox></LoadingBox> : ''}
        </Form.Group>
        <Form.Group as={Col} className="mb-3" controlId="description">
          <Form.Label>About</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            required
            placeholder="Tell us more about you"
            defaultValue={about}
            onChange={(e) => setAbout(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="confirmPassword"
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>
        {/* {userInfo.isSeller && (
          <>
            <h2>Seller</h2>
            <Form.Group className="mb-3" controlId="sellerName">
              <Form.Label>Seller Name</Form.Label>
              <Form.Control
                type="text"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="sellerLogo">
              <Form.Label>Seller Logo</Form.Label>
              <Form.Control
                value={sellerLogo}
                type="text"
                onChange={(e) => setSellerLogo(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="sellerDescription">
              <Form.Label>Seller Description</Form.Label>
              <Form.Control
                type="text"
                value={sellerDescription}
                onChange={(e) => setsellerDescription(e.target.value)}
              />
            </Form.Group>
          </> 
        )}*/}
        <div className="mb-3">
          <button type="submit" className=" search-btn1">
            Update
          </button>
        </div>
      </Form>
    </div>
  );
}
