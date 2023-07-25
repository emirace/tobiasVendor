import React, { useContext, useState } from "react";
import styled from "styled-components";
import { compressImageUpload } from "../utils";
import { Store } from "../Store";
import axios from "axios";
import ContactSuccess from "../component/ContactSuccess";
import LoadingBox from "../component/LoadingBox";

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 10px auto;
  padding: 20px;
`;
const FormHeading = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;
const FormLabel = styled.label`
  margin-bottom: 0.5rem;
`;

const FormInput = styled.input`
  padding: 0.5rem;
  margin-bottom: 1rem;
`;

const FormTextarea = styled.textarea`
  padding: 0.5rem;
  margin-bottom: 1rem;
`;

const FormSelect = styled.select`
  padding: 0.5rem;
  margin-bottom: 1rem;
`;

const FormButton = styled.button`
  padding: 0.75rem 1rem;
  background-color: var(--orange-color);
  color: #fff;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: var(--malon-color);
  }
`;

const ContactUs = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    subject: "",
    message: "",
    file: null,
  });
  const [contactSuccess, setContactSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const [loading, setLoading] = useState(false);
  const handleFileChange = async (e) => {
    setLoading(true);
    const imageUrl = await compressImageUpload(
      e.target.files[0],
      1024,
      userInfo.token,
      formData.file
    );
    setFormData({ ...formData, file: imageUrl });
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission here, e.g., send the data to a server or perform any other actions.
    try {
      // Send the POST request using Axios
      await axios.post("/api/contacts", formData);

      // Reset the form after successful submission (optional)
      setFormData({
        name: "",
        email: "",
        category: "",
        subject: "",
        message: "",
        file: null,
      });
      setContactSuccess(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Error submitting contact form:", error);
    }
  };

  return contactSuccess ? (
    <ContactSuccess />
  ) : (
    <ContactForm onSubmit={handleSubmit}>
      <FormHeading>Contact Us</FormHeading>
      <FormLabel htmlFor="name">Your Name</FormLabel>
      <FormInput
        type="text"
        id="name"
        name="name"
        value={formData.name}
        onChange={handleChange}
      />

      <FormLabel htmlFor="email">Your Email</FormLabel>
      <FormInput
        type="email"
        id="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
      />

      <FormLabel htmlFor="category">Select Category</FormLabel>
      <FormSelect
        id="category"
        name="category"
        value={formData.category}
        onChange={handleChange}
      >
        <option value="">Select a category</option>
        <option value="General Inquiry">General Inquiry</option>
        <option value="Support">Support</option>
        <option value="Feedback">Feedback</option>
        {/* Add more categories here */}
      </FormSelect>

      <FormLabel htmlFor="subject">Subject</FormLabel>
      <FormInput
        type="text"
        id="subject"
        name="subject"
        value={formData.subject}
        onChange={handleChange}
      />

      <FormLabel htmlFor="message">Message</FormLabel>
      <FormTextarea
        id="message"
        name="message"
        value={formData.message}
        onChange={handleChange}
      />

      <FormLabel htmlFor="file">Attach Image</FormLabel>
      <FormInput
        type="file"
        id="file"
        name="file"
        onChange={handleFileChange}
      />
      {loading && <LoadingBox />}

      <FormButton type="submit">Submit</FormButton>
    </ContactForm>
  );
};

export default ContactUs;
