import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    content: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Article = mongoose.model("Article", articleSchema);

export default Article;
