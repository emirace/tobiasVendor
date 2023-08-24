import mongoose from "mongoose";

const subCategoriesSchema = new mongoose.Schema({
  name: { type: String },
  items: [{ name: { type: String }, path: { type: String, default: null } }],
  path: { type: String, default: null },
});

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String },
    path: { type: String, default: null },
    subCategories: [subCategoriesSchema],
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
