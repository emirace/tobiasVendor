import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderItems: [{}],
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
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
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
