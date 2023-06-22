import mongoose from "mongoose";

const sentSchema = new mongoose.Schema(
  {
    emailName: { type: String },
  },
  {
    timestamps: true,
  }
);

const newslettersSchema = new mongoose.Schema(
  {
    emailType: { type: String, required: true },
    email: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
    url: { type: String, enum: ["com", "co.za"], required: true },
    sent: [sentSchema],
  },
  {
    timestamps: true,
  }
);

const Newsletters = mongoose.model("Newsletters", newslettersSchema);
export default Newsletters;
