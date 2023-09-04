import mongoose from "mongoose";

const subCategoriesSchema = new mongoose.Schema({
  name: { type: String },
  items: [
    {
      name: { type: String },
      isCategory: { type: Boolean, default: true },
      path: { type: String, default: null },
    },
  ],
  isCategory: { type: Boolean, default: true },
  path: { type: String, default: null },
});

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    isCategory: { type: Boolean, default: true },
    path: { type: String, default: null },
    subCategories: [subCategoriesSchema],
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
