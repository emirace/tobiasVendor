import mongoose from "mongoose";

const returnSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reason: { type: String, required: true },
    sending: { type: Object, required: true },
    refund: { type: String, required: true },
    image: { type: String },
    others: { type: String },
    region: { type: String, enum: ["NGN", "ZAR"], required: true },
    adminReason: { type: String },
    status: {
      type: String,
      enum: ["Approve", "Decline", "Pending"],
      default: "Pending",
    },
    returnDelivery: {},
  },
  {
    timestamps: true,
  }
);

const Return = mongoose.model("Return", returnSchema);
export default Return;
