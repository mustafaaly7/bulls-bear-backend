import mongoose, { Schema } from "mongoose";

const watchlistSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    assetType: {
      type: String,
      enum: ["stock", "crypto", "forex"], // based on your Figma "discover" pages
      required: true,
    },
    assetSymbol: {
      type: String,
      required: true, // e.g. "AAPL", "BTC", "ETH"
    },
    // addedAt: {
    //   type: Date,
    //   default: Date.now,
    // },
  },
  { timestamps: true }
);

const Watchlist = mongoose.model("Watchlist", watchlistSchema);
export default Watchlist;
