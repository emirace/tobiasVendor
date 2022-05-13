import axios from 'axios';
import React, { useContext, useReducer, useState } from 'react';
import { toast } from 'react-toastify';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'CREATE_REQUEST':
      return { ...state, loading: true };
    case 'CREATE_SUCCESS':
      return { ...state, loading: false };
    case 'CREATE_FAIL':
      return { ...state, loading: false, error: action.payload };

    default:
      break;
  }
};
export default function CreateProductScreen() {
  const [name, setName] = useState('');
  const [image, setImage] = useState('');
  const [images, setImages] = useState([]);
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

  const { state } = useContext();
  const { userInfo } = state;

  const [{ loading, error }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const createHandler = async () => {
    if (window.confirm('Are you sure to create?')) {
      try {
        dispatch({ type: 'CREATE_REQUEST' });
        const { data } = await axios.post(
          '/api/products',
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        toast.success('product created successfully');
        dispatch({ type: 'CREATE_SUCCESS' });
        navigate(`/admin/product/${data.product._id}`);
      } catch (error) {
        toast.error(getError(error));
        dispatch({ type: 'CREATE_FAIL' });
      }
    }
  };
  return <div>CreateProductScreen</div>;
}
