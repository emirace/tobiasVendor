import mongoose from "mongoose";
import findOrCreate from "mongoose-findorcreate";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userId: { type: String },
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
    like: { type: String },
    type: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);
const buyerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    social_id: { type: String },
    lastName: { type: String, required: true },
    image: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    isAdmin: { type: Boolean, default: false, required: true },
    isSeller: { type: Boolean, default: false, required: true },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    saved: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    sold: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    about: { type: String },
    dob: { type: Date },
    activeUpdate: { type: Date, default: Date.now() },
    usernameUpdate: { type: Date },
    reviews: [reviewSchema],
    buyers: [buyerSchema],
    rating: { type: Number, default: 0 },
    wallet: { type: Number, default: 0 },
    accountNumber: { type: Number },
    phone: { type: String },
    googleId: { type: String },
    accountName: { type: String },
    bankName: { type: String },
    earnings: { type: Number, default: 0 },
    address: {
      apartment: { type: String },
      street: { type: String },
      state: { type: String },
      zipcode: { type: Number },
    },
    numReviews: { type: Number, default: 0 },
    badge: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    influencer: { type: Boolean, default: false },
    isVerifiedEmail: { type: Boolean, default: false, required: true },
    resetPasswordToken: { type: String },
    resetEmailToken: { type: String },
    resetPasswordExpire: { type: String },
    resetEmailExpire: { type: String },
    region: { type: String, enum: ["NGN", "ZAR"], required: true },
    rebundle: {
      status: { type: Boolean, default: false },
      count: { type: Number, defalut: 0 },
    },
  },
  {
    timestamps: true,
  }
);
userSchema.plugin(findOrCreate);

const User = mongoose.model("User", userSchema);
export default User;
