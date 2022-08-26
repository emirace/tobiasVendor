import mongoose from "mongoose";

const returnSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    resolution: { type: String, required: true },
    reason: { type: String, required: true },
    sending: { type: String, required: true },
    refund: { type: String, required: true },
    image: { type: String },
    others: { type: String },
  },
  {
    timestamps: true,
  }
);

const Return = mongoose.model("Return", returnSchema);
export default Return;
