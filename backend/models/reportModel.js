import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    admin: { type: Boolean, default: false },
    text: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const reportSchema = new mongoose.Schema(
  {
    sender: { type: String, required: true },
    reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    reports: [messageSchema],
  },
  {
    timestamps: true,
  }
);

const Report = mongoose.model('Report', reportSchema);
export default Report;
