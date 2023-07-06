import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
    like: { type: String },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    sellerName: { type: String },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    images: [String],
    tags: [String],
    video: { type: String },
    brand: { type: String },
    color: { type: String },
    category: { type: String, required: true },
    product: { type: String },
    subCategory: { type: String },
    material: { type: String },
    description: { type: String, required: true },
    sizes: { type: Array, required: true, default: [] },
    userBuy: { type: Array, default: [] },
    deliveryOption: { type: Array },
    condition: { type: String, required: true },
    shippingLocation: { type: String, required: true },
    keyFeatures: { type: String },
    specification: { type: String },
    overview: { type: String },
    price: { type: Number, required: true },
    actualPrice: { type: Number },
    rating: { type: Number, required: true },
    currency: {
      type: String,
      enum: ["N ", "R "],
      required: true,
    },
    numReviews: { type: Number, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    shares: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    reviews: [reviewSchema],
    sold: { type: Boolean },
    soldAll: { type: Boolean, default: false },
    badge: { type: Boolean },
    meta: {},
    active: { type: Boolean },
    vintage: { type: Boolean },
    luxury: { type: Boolean },
    luxuryImage: { type: String },
    countInStock: { type: Number, required: true },
    region: { type: String, enum: ["NGN", "ZAR"], required: true },
    productId: { type: String },
    viewcount: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
