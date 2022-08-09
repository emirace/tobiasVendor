import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    txnType: { type: String, enum: ["credit", "debit"], required: true },
    purpose: {
      type: String,
      enum: ["deposit", "withdrawal", "transfer", "reversal"],
      required: true,
    },
    amount: { type: Number, required: true },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    reference: { type: String, unique: true },
    balanceBefore: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    metadata: Object,
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
