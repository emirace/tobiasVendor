import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderItems: [{}],
    deliveryMethod: Object,
    paymentMethod: { type: String, required: true },
    paymentReslt: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    itemsPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    seller: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },
    deliveryStatus: { type: String, default: "Pending" },
    status: { type: String },
    reason: { type: String },
    deliveredAt: { type: Date },
    orderId: { type: String },
    region: { type: String, enum: ["NGN", "ZAR"], required: true },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
