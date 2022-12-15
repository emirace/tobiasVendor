import mongoose from "mongoose";

const rebundleSellerSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, expires: 3600 * 2, default: Date.now() },
  count: { type: Number, default: 3 },
});

const RebundleSeller = mongoose.model("rebundleSeller", rebundleSellerSchema);
export default RebundleSeller;
