import mongoose from 'mongoose';
import findOrCreate from 'mongoose-findorcreate';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    image: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    isAdmin: { type: Boolean, default: false, required: true },
    isSeller: { type: Boolean, default: true, required: true },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    saved: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    sold: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    about: { type: String },
    dob: { type: Date },
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    wallet: { type: Number, default: 0 },
    phone: { type: Number },
    googleId: { type: String },
    address: { type: String },
    numReviews: { type: Number, default: 0 },
    badge: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);
userSchema.plugin(findOrCreate);

const User = mongoose.model('User', userSchema);
export default User;
