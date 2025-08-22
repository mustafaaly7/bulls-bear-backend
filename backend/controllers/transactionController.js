import SendResponse from "../helpers/sendResponse.js"
import { Transaction } from "../models/transactionModel.js"
import UserModel from "../models/userModel.js"



export const requestDeposit = async(req,res)=>{
try {
const {amount} = req.body
const userId = req.user.id
if(!amount || amount <= 0){
    return SendResponse(res,400,false,null,"Invalid amount")
}

const transaction = new Transaction({
    userId,
    amount,
    purpose:'deposit',
    status:'pending',
    createdAt: new Date()
})

await transaction.save()
SendResponse(res,200,true,transaction,"Deposit request created successfully")

    
} catch (error) {
    SendResponse(res,500,false,null,error.message)
}



}

export const requestWithdraw = async (req, res) => {
  try {
    const { amount } = req.body;
    const userId = req.user.id;

    if (!amount || amount <= 0) {
      return SendResponse(res, 400, false, null, "Invalid amount");
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return SendResponse(res, 404, false, null, "User not found");
    }

    if (!user.walletBalance || user.walletBalance < amount) {
      return SendResponse(res, 400, false, null, "Insufficient balance");
    }

    const transaction = new Transaction({
      userId,
      amount,
      purpose: "withdraw",
      status: "pending",
      createdAt: new Date(),
    });

    await transaction.save();

    // // ✅ Optionally freeze funds by deducting balance immediately
    // user.balance -= amount;
    // await user.save();

    SendResponse(res, 200, true, transaction, "Withdraw request created successfully");
  } catch (error) {
    SendResponse(res, 500, false, null, error.message);
  }
};




export const getUserTransactions = async (req, res) => {
  try {
 const userId = req.user.id;
 const transactions = await Transaction.find({userId}).sort({createdAt:-1}).populate('userId','name email')
 if(!transactions){
    return SendResponse(res,404,false,null,"You've no transactions yet")
 }
  SendResponse(res,200,true,transactions,"User transactions fetched successfully")
    



  } catch (error) {
 SendResponse(res,500,false,null,error.message)   
  }
}