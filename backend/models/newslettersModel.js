import mongoose from "mongoose";

const newslettersSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Newsletters = mongoose.model("Newsletters", newslettersSchema);
export default Newsletters;
