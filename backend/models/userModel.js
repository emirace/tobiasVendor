import mongoose from 'mongoose';

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
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false, required: true },
    isSeller: { type: Boolean, default: false, required: true },
    followers: [{ type: mongoose.Schema.Types.ObjectID, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectID, ref: 'User' }],
    likes: [{ type: mongoose.Schema.Types.ObjectID, ref: 'Product' }],
    saved: [{ type: mongoose.Schema.Types.ObjectID, ref: 'Product' }],
    about: { type: String },
    reviews: [reviewSchema],
    rating: { type: Number, required: true, default: 0 },
    phone: { type: Number, default: 0 },
    numReviews: { type: Number, required: true, default: 0 },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
