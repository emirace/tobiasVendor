import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Contact from '../models/contactModel.js';
import { isAdmin, isAuth } from '../utils.js';
import Newsletters from '../models/newslettersModel.js';

const contactRouter = express.Router();

// Create a new contact form submission
contactRouter.post(
  '/:region',
  expressAsyncHandler(async (req, res) => {
    try {
      const { region } = req.params;
      const url = region === 'NGN' ? 'com' : 'co.za';
      const { name, email, category, subject, message, file } = req.body;

      const newContact = new Contact({
        name,
        email,
        category,
        subject,
        message,
        file,
      });

      let newsletter = await Newsletters.findOne({ email });

      if (newsletter) {
        newsletter.isDeleted = false;
        newsletter.url = url;
      } else {
        newsletter = new Newsletters({
          email,
          emailType: 'Newsletter',
          url,
        });
      }
      console.log('newsletter', newsletter);
      await newsletter.save();

      const savedContact = await newContact.save();
      res.status(201).json(savedContact);
    } catch (err) {
      console.error('Error saving contact:', err);
      res.status(500).json({ error: 'Error saving contact', err });
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
      const contacts = await Contact.find({})
        .sort({ assignTo: 1, createdAt: -1 })
        .exec();
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
      const contact = await Contact.findById(contactId);
      if (!contact) {
        return res.status(404).json({ error: 'Contact not found' });
      }
      contact.assignTo = req.user.username;
      const updatedContact = await contact.save();
      res.json(updatedContact);
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
