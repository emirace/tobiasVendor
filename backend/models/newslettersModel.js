import mongoose from "mongoose";

const newslettersSchema = new mongoose.Schema(
  {
    emailType: { type: String, required: true },
    email: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const Newsletters = mongoose.model("Newsletters", newslettersSchema);
export default Newsletters;
