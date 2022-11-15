import mongoose from "mongoose";

const guestUserSchema = new mongoose.Schema(
  {
    username: { type: String },
    email: { type: String },
    guest: { type: Boolean },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/emirace/image/upload/v1667253235/download_vms4oc.png",
    },
  },
  {
    timestamps: true,
  }
);

const GuestUser = mongoose.model("GuestUser", guestUserSchema);
export default GuestUser;
