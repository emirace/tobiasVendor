import mongoose from "mongoose";

const expoPushTokenShema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const ExpoPushToken = mongoose.model("ExpoPushToken", expoPushTokenShema);
export default ExpoPushToken;
