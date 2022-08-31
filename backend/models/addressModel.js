import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    meta: {},
  },
  {
    timestamps: true,
  }
);

const Address = mongoose.model("Address", addressSchema);
export default Address;
