import mongoose from "mongoose";

const otherBrandSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const OtherBrand = mongoose.model("OtherBrand", otherBrandSchema);
export default OtherBrand;
