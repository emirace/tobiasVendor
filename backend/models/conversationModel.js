import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    members: { type: Array, required: true },
    conversationType: { type: String, required: true },
    needRespond: { type: Boolean, default: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    guest: { type: Boolean, default: false },
    guestEmail: { type: String },
  },
  {
    timestamps: true,
  }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
