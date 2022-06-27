import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    user: { type: String, required: true },
    reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    admin: { type: Boolean, default: false },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model('Report', reportSchema);
export default Report;
