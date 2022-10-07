import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  read: { type: Boolean, default: false },
  notifyType: { type: String, required: true },
  itemId: { type: String, required: true },
  userImage: { type: String },
  msg: { type: String },
  link: { type: String },
  createdAt: { type: Date, expires: 3600, default: Date.now() },
});

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
