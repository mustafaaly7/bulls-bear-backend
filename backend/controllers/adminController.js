import SendResponse from "../helpers/sendResponse.js";
import PasswordChangeRequest from "../models/passwordModel.js";
import UserModel from "../models/userModel.js";

export const acceptUser = async (req, res) => {
    const  userId  = req.params.id;
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


export const approvePasswordChange = async (req, res) => {
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


