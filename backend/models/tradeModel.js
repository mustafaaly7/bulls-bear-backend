import mongoose, { Schema } from "mongoose";


const tradeSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    asset: { type: String, required: true }, // e.g., 'ethereum'
    symbol: { type: String, required: true }, // e.g., 'ETH'
    usdAmount: { type: Number, required: true }, // How much USD used
    cryptoAmount: { type: Number, required: true }, // How much ETH bought
    pricePerToken: { type: Number, required: true }, // ETH price at purchase
    type: { type: String, enum: ["buy", "sell"], default: "buy" },
    status: { type: String, enum: ["completed", "failed"], default: "completed" },
  },
  { timestamps: true }
);

const TradeModel = mongoose.model("Trades", tradeSchema);
export default TradeModel;
