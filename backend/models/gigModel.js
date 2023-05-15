import mongoose from "mongoose";

const gigSchema = new mongoose.Schema(
  {
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    status: { type: Boolean, default: false },
    meta: {},
  },
  {
    timestamps: true,
  }
);

const Gig = mongoose.model("Gig", gigSchema);
export default Gig;
