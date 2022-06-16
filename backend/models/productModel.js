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

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    seller: { type: mongoose.Schema.Types.ObjectID, ref: 'User' },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    images: [String],
    video: { type: String },
    brand: { type: String },
    category: { type: String, required: true },
    description: { type: String, required: true },
    sizes: { type: Array, required: true, default: [] },
    condition: { type: String, required: true },
    shippingLocation: { type: String, required: true },
    keyFeatures: { type: String },
    specification: { type: String },
    overview: { type: String },
    price: { type: Number, required: true },
    actualPrice: { type: Number },
    rating: { type: Number, required: true },
    numReviews: { type: Number, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    reviews: [reviewSchema],
    sold: { type: Boolean },
    badge: { type: Boolean },
    active: { type: Boolean },
    countInStock: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
