import mongoose, { Schema } from "mongoose";

const passwordChangeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    oldPassword: {
      type: String,
      required: true,
    },
    newPassword: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    requestedAt: {
      type: Date,
      default: Date.now,
    },
    approvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

const PasswordChangeRequest = mongoose.model("PasswordChangeRequest", passwordChangeSchema);
export default PasswordChangeRequest;
