import mongoose from "mongoose";

const recentViewSchema = new mongoose.Schema(
  {
    score: { type: Number, required: true },
    numViews: { type: Number, required: true },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const RecentView = mongoose.model("RecentView", recentViewSchema);
export default RecentView;
