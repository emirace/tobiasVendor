import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema(
  {
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    conversationType: { type: String, required: true },
    needRespond: { type: Boolean, default: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    guest: { type: Boolean, default: false },
    guestEmail: { type: String },
    canReply: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model('Conversation', conversationSchema);
export default Conversation;
