import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, required: true },
    status: { type: String, default: "Pending" },
    meta: { type: Object, required: true },
  },
  {
    timestamps: true,
  }
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
