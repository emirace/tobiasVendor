import mongoose from "mongoose";

const nonLoginSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    country: { type: String, required: true },
    address: { type: String, required: true },
    code: { type: String },
    phone: { type: Number },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const NonLogin = mongoose.model("NonLogin", nonLoginSchema);
export default NonLogin;
