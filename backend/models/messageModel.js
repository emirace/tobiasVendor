import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    conversationId: { type: String },
    sender: { type: String },
    text: { type: String },
    image: { type: String },
    link: { type: String, default: null },
  },

  {
    timestamps: true,
  }
);

const Message = mongoose.model('Message', messageSchema);
export default Message;
