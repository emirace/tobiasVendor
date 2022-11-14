import mongoose from "mongoose";

const guestUserSchema = new mongoose.Schema(
  {
    username: { type: String },
    email: { type: String },
    guest: { type: Boolean },
    image: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const GuestUser = mongoose.model("GuestUser", guestUserSchema);
export default GuestUser;
