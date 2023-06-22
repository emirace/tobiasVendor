import mongoose from 'mongoose';

const newslettersSchema = new mongoose.Schema(
  {
    emailType: { type: String, required: true },
    email: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    url: { type: String, enum: ['com', 'co.za'], required: true },
  },
  {
    timestamps: true,
  }
);

const Newsletters = mongoose.model('Newsletters', newslettersSchema);
export default Newsletters;
