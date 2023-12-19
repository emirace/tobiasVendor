import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: { type: String },
    sender: { type: String },
    text: { type: String },
    image: { type: String },
    type: { type: String, enum: ["email", "message"], default: "message" },
    emailMessages: [
      {
        type: { type: String },
        content: { type: String },
        href: { type: String },
      },
    ],
  },

  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);
export default Message;
