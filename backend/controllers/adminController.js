import { populate } from "dotenv";
import SendResponse from "../helpers/sendResponse.js";
import PasswordChangeRequest from "../models/passwordModel.js";
import UserModel from "../models/userModel.js";
import { Transaction } from "../models/transactionModel.js";

export const acceptUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const findUser = await UserModel.findById(userId);
    if (!findUser) {
      return SendResponse(res, 404, true, null, "User not found");
    }

    if (findUser.role === "admin") {
      return SendResponse(res, 400, true, null, "Admin cannot be accepted");
    }
    if (findUser.isVerified) {
      return SendResponse(res, 400, true, null, "User already accepted");
    }
    findUser.isVerified = true;
    findUser.role = "user"; // Change role to user after acceptance
    const updatedUser = await findUser.save();
    SendResponse(res, 200, false, updatedUser, "User accepted successfully");

  } catch (error) {

    SendResponse(res, 500, true, null, error.message);

  }
}

export const getUserprofileRequests = async (req, res) => {
  try {
    const usersRequests = await UserModel.find({ isVerified: false });
    if (!usersRequests || usersRequests.length === 0) {
      return SendResponse(res, 404, true, null, "No user requests found");
    }
    SendResponse(res, 200, false, usersRequests, "User requests retrieved successfully");



  } catch (error) {
    SendResponse(res, 500, true, null, error.message);
  }
}


export const getUserpasswordRequests = async (req, res) => {
  try {
    const requests = await PasswordChangeRequest.find().populate("userId");
    if (!requests || requests.length === 0) {
      return res.status(404).json({ message: "No password change requests found" });
    }
    SendResponse(res, 200, false, requests, "Password change requests retrieved successfully");


  } catch (error) {
    SendResponse(res, 500, true, null, error.message);
  }
}


export const approveRejectrequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // "approve" or "reject"

    const request = await PasswordChangeRequest.findById(id).populate("userId");
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (action === "approve") {
      request.status = "approved";
      request.approvedAt = Date.now();

      // Update user’s password
      request.userId.password = request.newPassword;
      await request.userId.save();
    } else {
      request.status = "rejected";
    }

    await request.save();
    res.status(200).json({ message: `Request ${action}d successfully`, request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find().populate("watchlist").select("-password -__v");
    if (!users || users.length === 0) {
      return SendResponse(res, 404, true, null, "No users found");
    }
    SendResponse(res, 200, false, users, "Users retrieved successfully");

  } catch (error) {
    SendResponse(res, 500, true, null, error.message);
  }
}



export const getAllusersTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate("userId", "username email walletBalance")

    if (!transactions || transactions.length === 0) {
      return SendResponse(res, 404, true, null, "No transactions found");
    }
    SendResponse(res, 200, false, transactions, "Transactions retrieved successfully");



  } catch (error) {

    SendResponse(res, 500, true, null, error.message);
  }

}



export const approveTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    const transaction = await Transaction.findById(id)
    if (!transaction) return SendResponse(res, 404, true, null, "Transaction not found");

    if (transaction.status != "pending") return SendResponse(res, 400, true, null, "transaction already processed")

    // find user
    const user = await UserModel.findById(transaction.userId);
    if (!user) {
      return SendResponse(res, 404, true, null, "User not found");
    }


    if (action === "approve") {
      transaction.status = "approved";

      if (transaction.purpose === "deposit") {
        user.walletBalance += transaction.amount;
      } else if (transaction.purpose === "withdraw") {
        if (user.walletBalance < transaction.amount) {
          return SendResponse(res, 400, true, null, "Insufficient wallet balance for withdrawal");
        }
        user.walletBalance -= transaction.amount;
      }

      await user.save();
    } else if (action === "reject") {
      transaction.status = "rejected";
    } else {
      return SendResponse(res, 400, true, null, "Invalid action");
    }

    await transaction.save();

    SendResponse(res, 200, false, transaction, `Transaction ${transaction.status} successfully`);




  } catch (error) {
    SendResponse(res, 500, true, null, error.message);
  }
}