import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    externalReference: { type: String, required: true },
    accountID: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
    amount: { type: Number, equired: true },
    lastResponse: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
