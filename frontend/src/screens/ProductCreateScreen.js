import axios from 'axios';
import React, { useContext, useReducer, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getError } from '../utils';
import { Store } from '../Store';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import LoadingBox from '../component/LoadingBox';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false, error: '' };
    case 'CREATE_FAIL':
      return { ...state, loading: false, error: action.payload };
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
export default function ProductCreateScreen() {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [actualPrice, setActualPrice] = useState('');
  const [price, setPrice] = useState('');
  const [shippingLocation, setShippingLocation] = useState('');
  const [specification, setSpecification] = useState('');
  const [size, setSize] = useState('');
  const [condition, setCondition] = useState('');
  const [keyFeatures, setKeyFeatures] = useState([]);
  const [overview, setOverview] = useState('');
  const [countInStock, setCountInStock] = useState('');
  const [validated, setValidated] = useState(false);

  const { state } = useContext(Store);
  const { userInfo } = state;

  const navigate = useNavigate();

  const [{ loading, error, loadingUpload, errorUpload }, dispatch] = useReducer(
    reducer,
    {
      loading: false,
      error: '',
      loadingUpload: false,
      errorUpload: '',
    }
  );

  const createHandler = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
      setValidated(true);
    } else {
      try {
        dispatch({ type: 'CREATE_REQUEST' });
        await axios.post(
          '/api/products',
          {
            name,
            image,
            images,
            video,
            category,
            description,
            brand,
            actualPrice,
            price,
            shippingLocation,
            specification,
            size,
            condition,
            keyFeatures,
            overview,
            countInStock,
          },
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        toast.success('product created successfully');
        dispatch({ type: 'CREATE_SUCCESS' });
        navigate(`/seller/product`);
      } catch (error) {
        toast.error(getError(error));
        dispatch({ type: 'CREATE_FAIL' });
      }
    }
  };

  const uploadFileHandler = async (e, fileType) => {
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
      if (fileType === 'images') {
        setImages([...images, data.secure_url]);
      } else if (fileType === 'image') {
        setImage(data.secure_url);
      } else {
        setVideo(data.secure_url);
      }
      toast.success('Image uploaded successfully, click Update to apply It');
    } catch (err) {
      dispatch({ type: 'UPLOAD_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  return (
    <div className="container">
      <Helmet>
        <title>Create New Product</title>
      </Helmet>
      <h1>Create New Product</h1>
      {errorUpload && <Alert variant="danger">{errorUpload}</Alert>}
      <Form noValidate validated={validated} onSubmit={createHandler}>
        <Form.Group as={Col} className="mb-3" controlId="name">
          <Form.Label>Product Name</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter Product Name"
            defaultValue={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">
            Enter a valid product name!
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} className="mb-3" controlId="image">
          <Form.Label>Upload Image</Form.Label>
          <Form.Control
            required
            type="file"
            onChange={(e) => uploadFileHandler(e, image)}
          />
          {loadingUpload ? <LoadingBox></LoadingBox> : ''}
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">
            Upload main product image!
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} className="mb-3" controlId="images">
          <Form.Label>Upload Additional Images</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => uploadFileHandler(e, images)}
          />
          {loadingUpload ? <LoadingBox></LoadingBox> : ''}
        </Form.Group>
        <Form.Group as={Col} className="mb-3" controlId="video">
          <Form.Label>Upload Video !optional</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => uploadFileHandler(e, 'video')}
          />
          {loadingUpload ? <LoadingBox></LoadingBox> : ''}
        </Form.Group>
        <Form.Group as={Col} className="mb-3" controlId="category">
          <Form.Label>Select Category</Form.Label>
          <Form.Select
            required
            aria-label="Default select example"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Select Category</option>
            <option value="Womenwears">Womenwears</option>
            <option value="Menwear">Menwear</option>
            <option value="Kids">Kids</option>
            <option value="Curve+plus">Curve+plus</option>
            <option value="MiniSkirt">MiniSkirt</option>
            <option value="Others">Others</option>
          </Form.Select>
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">
            Select product Category!
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} className="mb-3" controlId="description">
          <Form.Label>Product Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            required
            placeholder="Enter Product Description"
            defaultValue={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">
            Say something abut your production!
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} className="mb-3" controlId="brand">
          <Form.Label>Product Brand</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Product Brand"
            defaultValue={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </Form.Group>
        <Row>
          <Form.Group as={Col} className="mb-3 col-1" controlId="price">
            <Form.Label>Offer Price</Form.Label>
            <Form.Control
              type="number"
              required
              defaultValue={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Enter a valid product price!
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group as={Col} className="mb-3 col-1" controlId="actualPrice">
            <Form.Label>Actual Price</Form.Label>
            <Form.Control
              type="number"
              defaultValue={actualPrice}
              onChange={(e) => setActualPrice(e.target.value)}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              Enter a valid product price!
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Form.Group as={Col} className="mb-3" controlId="shippingLocation">
          <Form.Label>Shipping Location</Form.Label>
          <Form.Control
            required
            type="text"
            defaultValue={shippingLocation}
            onChange={(e) => setShippingLocation(e.target.value)}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">
            Enter a valid Shipping Location!
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} className="mb-3" controlId="specification">
          <Form.Label>Specification</Form.Label>
          <Form.Control
            placeholder="Product Specification"
            defaultValue={specification}
            onChange={(e) => setSpecification(e.target.value)}
          />
        </Form.Group>
        <Form.Group as={Col} className="mb-3 col-1" controlId="size">
          <Form.Label>Size</Form.Label>
          <Form.Control
            required
            type="text"
            placeholder="Enter Product Size"
            defaultValue={size}
            onChange={(e) => setSize(e.target.value)}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">
            Enter a valid product size!
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} className="mb-3" controlId="condition">
          <Form.Label>Select Condition</Form.Label>
          <Form.Select required onChange={(e) => setCondition(e.target.value)}>
            <option>Select Condition</option>
            <option value="New">New</option>
            <option value="used">Used</option>
          </Form.Select>
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">
            Select a Condition!
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} className="mb-3" controlId="keyFeatures">
          <Form.Label>Key features</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter Product Key Features"
            defaultValue={keyFeatures}
            onChange={(e) => setKeyFeatures(e.target.value)}
          />
        </Form.Group>
        <Form.Group as={Col} className="mb-3" controlId="overview">
          <Form.Label>Product Overview</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter an overview of the Product"
            defaultValue={overview}
            onChange={(e) => setOverview(e.target.value)}
          />
        </Form.Group>
        <Form.Group as={Col} className="mb-3 col-1" controlId="count">
          <Form.Label>Count In Stock</Form.Label>
          <Form.Control
            type="number"
            required
            placeholder="Enter the number of available product"
            defaultValue={countInStock}
            onChange={(e) => setCountInStock(e.target.value)}
          />
          <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          <Form.Control.Feedback type="invalid">
            Enter a valid number!
          </Form.Control.Feedback>
        </Form.Group>
        <div className="mb-3">
          <button type="submit" className="search-btn1 mb-3">
            Submit form
          </button>
          {loading ? <LoadingBox></LoadingBox> : ''}
        </div>
      </Form>
    </div>
  );
}
