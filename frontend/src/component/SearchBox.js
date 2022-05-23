import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const submitHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search/?query=${query}` : '/search');
  };
  return (
    <Form className="d-flex me-auto  search-box-size " onSubmit={submitHandler}>
      <div className="btn-cont input-group ml-4 border-0 shadow-sm rounded-pill ">
        <div className="input-group-prepend pleft border-0">
          <button
            className="btn btn-link bg-transparent search-btn border-0 rounded-pill text-info"
            type="submit"
            id="button-search"
          >
            <i className="fas fa-search"></i>
          </button>
        </div>
        <Form.Control
          type="text"
          name="q"
          id="q"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search anything..."
          aria-label="Search Products..."
          aria-describedby="button-search"
          className=" bg-transparent searchbtn border-0 rounded-pill"
        ></Form.Control>
      </div>
    </Form>
  );
}
