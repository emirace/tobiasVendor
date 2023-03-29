import mongoose from 'mongoose';

const subCategoriesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  items: [{ type: String }],
});

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    subCategories: [subCategoriesSchema],
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model('Category', categorySchema);
export default Category;
