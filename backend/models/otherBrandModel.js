import mongoose from "mongoose";

const otherBrandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    isAdded: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const OtherBrand = mongoose.model("OtherBrand", otherBrandSchema);
export default OtherBrand;
