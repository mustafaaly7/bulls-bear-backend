import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        firstname: {
            type: String,
            required: true,
        },
        lastname: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },

        phone_number: {
            type: String,
            minlength: 10,  // minimum length (e.g., local numbers)
            maxlength: 15,  // E.164 standard max length
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "admin", "guest"],
            default: "guest",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        walletBalance: {
      type: Number,
      default: 0, // user starts with 0
    },
    cryptoHoldings: [
      {
        asset: { type: String }, // e.g., 'ethereum'
        symbol: { type: String }, // e.g., 'ETH'
        amount: { type: Number, default: 0 }, // Number of tokens user owns
      },
    ],
         watchlist: [
      {
        type: Schema.Types.ObjectId,
        ref: "Watchlist", // Reference to Watchlist model
      },
    ],


    },

    { timestamps: true }
);

const UserModel = mongoose.model("Users", userSchema);
export default UserModel;