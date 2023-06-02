import mongoose from "mongoose";

const returnSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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

const Return = mongoose.model("Return", returnSchema);
export default Return;
