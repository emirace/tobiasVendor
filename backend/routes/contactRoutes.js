import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Contact from '../models/contactModel.js';
import { isAdmin, isAuth } from '../utils.js';

const contactRouter = express.Router();

// Create a new contact form submission
contactRouter.post(
  '/',
  expressAsyncHandler(async (req, res) => {
    try {
      const { name, email, category, subject, message, file } = req.body;

      const newContact = new Contact({
        name,
        email,
        category,
        subject,
        message,
        file,
      });

      const savedContact = await newContact.save();
      res.status(201).json(savedContact);
    } catch (err) {
      console.error('Error saving contact:', err);
      res.status(500).json({ error: 'Error saving contact' });
    }
  })
);

// Get all contact form submissions
contactRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    try {
      const contacts = await Contact.find({});
      res.json(contacts);
    } catch (err) {
      console.error('Error fetching contacts:', err);
      res.status(500).json({ error: 'Error fetching contacts' });
    }
  })
);

// Get a single contact form submission by ID
contactRouter.get(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const contactId = req.params.id;

    try {
      const contact = await Contact.findById(contactId);
      if (!contact) {
        res.status(404).json({ error: 'Contact not found' });
      } else {
        res.json(contact);
      }
    } catch (err) {
      console.error('Error fetching contact:', err);
      res.status(500).json({ error: 'Error fetching contact' });
    }
  })
);

// Update a contact form submission by ID
contactRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const contactId = req.params.id;
    const updateData = req.body;

    try {
      const updatedContact = await Contact.findByIdAndUpdate(
        contactId,
        updateData,
        { new: true }
      );
      if (!updatedContact) {
        res.status(404).json({ error: 'Contact not found' });
      } else {
        res.json(updatedContact);
      }
    } catch (err) {
      console.error('Error updating contact:', err);
      res.status(500).json({ error: 'Error updating contact' });
    }
  })
);

// Delete a contact form submission by ID
contactRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const contactId = req.params.id;

    try {
      const deletedContact = await Contact.findByIdAndDelete(contactId);
      if (!deletedContact) {
        res.status(404).json({ error: 'Contact not found' });
      } else {
        res.json({ message: 'Contact deleted successfully' });
      }
    } catch (err) {
      console.error('Error deleting contact:', err);
      res.status(500).json({ error: 'Error deleting contact' });
    }
  })
);

// ... (existing code) ...
export default contactRouter;
