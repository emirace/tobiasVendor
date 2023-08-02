import mongoose from 'mongoose';

// Define the Contact schema
const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    file: {
      type: String,
    },
    assignTo: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Create the Contact model
const Contact = mongoose.model('Contact', contactSchema);
export default Contact;
