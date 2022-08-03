import mongoose from "mongoose";

const bestSellerSchema = new mongoose.Schema(
  {
    score: { type: Number, required: true },
    numViews: { type: Number, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BestSeller = mongoose.model("bestSeller", bestSellerSchema);
export default BestSeller;
