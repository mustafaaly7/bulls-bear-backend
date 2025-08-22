import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  purpose: { // deposit | withdraw
    type: String,
    enum: ["deposit", "withdraw"],
    required: true
  },
  status: { // pending | approved | rejected
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: {
    type: Date
  }
});

export const Transaction = mongoose.model("Transaction", transactionSchema);