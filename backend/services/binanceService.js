import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

// const BINANCE_API_URL = process.env.BINANCE_API_URL;
const BINANCE_API_URL = process.env.BINANCE_API_URL || "https://api.binance.com";

// Fetch live price of a given symbol (e.g., BTCUSDT, ETHUSDT)
export const getCryptoPrice = async (symbol) => {
  try {
    const response = await axios.get(`${BINANCE_API_URL}/api/v3/ticker/price`, {
      params: { symbol },
    });

    // console.log("Binance API Response:", response.data);
    return parseFloat(response.data.price);
  } catch (error) {
    console.error("Binance API Error:", error.message);
    throw new Error("Failed to fetch price from Binance");
  }
};