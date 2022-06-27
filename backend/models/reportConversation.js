import mongoose from 'mongoose';

const reportConversationSchema = new mongoose.Schema(
  {
    user: { type: String },
  },
  {
    timestamps: true,
  }
);

const ReportConversation = mongoose.model(
  'ReportConversation',
  reportConversationSchema
);
export default ReportConversation;
