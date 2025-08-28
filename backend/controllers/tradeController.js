import SendResponse from "../helpers/sendResponse.js"
import TradeModel from "../models/tradeModel.js";
import UserModel from "../models/userModel.js";
import { getCryptoPrice } from "../services/binanceService.js";



export const buyCrypto = async (req, res) => {
  try {
    const { symbol, usdAmount, email } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return SendResponse(res, 404, false, null, "User not found")
    }

    if (user.walletBalance < usdAmount) return SendResponse(res, 400, false, null, "Insufficient wallet balance")

    const price = await getCryptoPrice(symbol);

    const tokensBought = usdAmount / price;
    user.walletBalance -= usdAmount;

    const existingAsset = user.cryptoHoldings.find(
      (h) => h.symbol === symbol.replace("USDT", "")
    );

    if (existingAsset) {
      existingAsset.amount += tokensBought;
    } else {
      user.cryptoHoldings.push({
        asset: symbol,
        symbol: symbol.replace("USDT", ""),
        amount: tokensBought,
      });
    }

    await user.save();

    await TradeModel.create({
      userId: user._id,
      asset: symbol,
      symbol: symbol.replace("USDT", ""),
      usdAmount,
      cryptoAmount: tokensBought,
      pricePerToken: price,
      type: "buy",
      status: "completed",
    });

    return SendResponse(res, 200, false, {
      user,
      bought: tokensBought,
      price,
      newWalletBalance: user.walletBalance,
      holdings: user.cryptoHoldings,
    }, "Crypto purchase successful")


  } catch (error) {
    SendResponse(res, 500, true, null, error.message)
  }

}


export const getTradeHistory = async (req, res) => {

  try {
    const alltrades = await TradeModel.find().populate("userId", "firstname lastname email -_id walletBalance").sort({ createdAt: -1 });
    if (!alltrades || alltrades.length === 0) {
      return SendResponse(res, 404, false, null, "No trades found")
    }
    return SendResponse(res, 200, false, alltrades, "All trades fetched successfully")



  } catch (error) {
    SendResponse(res, 500, true, null, error.message)
  }
}


export const getUsertrades = async (req, res) => {
  try {
    const userId = req.user.id
    const usertrades = await TradeModel.find({ userId }).populate("userId", " email firstname lastname walletBalance").sort({ createdAt: -1 });
    if (!usertrades || usertrades.length === 0) {
      return SendResponse(res, 404, false, null, "No trades found for this user")
    }
    SendResponse(res, 200, false, usertrades, "User trades fetched successfully")



  } catch (error) {
    SendResponse(res, 500, true, null, error.message)
  }

}


export const getSingleTrade = async (req, res) => {
  try {
const {id} = req.params
const singleTrade =  await TradeModel.findById(id).populate("userId", " email firstname lastname walletBalance cryptoHoldings -_id watchlist").sort({ createdAt: -1 });
if (!singleTrade) return SendResponse(res, 404, false, null, "Trade not found")
SendResponse(res, 200, false, singleTrade, "Trade fetched successfully")  
  } catch (error) {
 SendResponse(res, 500, true, null, error.message)   
  }
}