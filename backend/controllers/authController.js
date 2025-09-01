import SendResponse from "../helpers/sendResponse.js";
import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import PasswordChangeRequest from "../models/passwordModel.js";
dotenv.config();

export const signup = async (req, res) => {
    const { firstname, lastname, email, password,phone_number } = req.body;  
try {

    if (!firstname || !lastname || !email || !password || !phone_number) {
        return SendResponse(res, 400, true, null, "All fields are required");
    }   

    //check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        return SendResponse(res, 400, true, null, "User already exists");
    }   

const newuser = new UserModel({
        firstname,
        lastname,   
        email,
        password,   
        phone_number
    });


    const savedUser = await newuser.save();
    SendResponse(res, 201, false, savedUser, "User created successfully wait for admin approval");


    
} catch (error) {
    SendResponse(res , 500, true, null, error.message);

}
}



export const login =async (req, res) => {
try {
    const{email ,phone_number,password} = req.body
if (!email && !phone_number) {
      return SendResponse(res, 400, true, null, "Email or phone number is required");
    }

    // must provide password as well
    if (!password) {
      return SendResponse(res, 400, true, null, "Password is required");
    }

const user = await UserModel.findOne({
      $or: [{ email }, { phone_number }],
    }).select("+password");


 if (!user) {
      return SendResponse(res, 404, true, null, "User not found");
    }

    // Compare plain-text password
    if (user.password !== password) {
      return SendResponse(res, 401, true, null, "Invalid credentials");
    }

    const token  = jwt.sign({ id: user._id, role:user.role }, process.env.AUTH_SECRET, {
      expiresIn: "7d",
    });
    // If you want to return token/session later, you can add here
    return SendResponse(res, 200, false, {token,user}, "Login successful");




} catch (error) {
    SendResponse(res, 500, true, null, error.message);
}

}



export const requestPasswordChange = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return SendResponse(res, 404, true, null, "User not found");
    }

    if (user.password !== oldPassword) {
      return SendResponse(res, 400, true, null, "Old password is incorrect");
    }

    // check if there’s already a pending request
    const existingRequest = await PasswordChangeRequest.findOne({
      userId: req.user.id,
      status: "pending", // assuming you have a status field
    });

    if (existingRequest) {
      return SendResponse(
        res,
        400,
        true,
        null,
        "You already have a pending password change request"
      );
    }

    const request = await PasswordChangeRequest.create({
      userId: req.user.id,
      oldPassword,
      newPassword,
      status: "pending", // mark as pending initially
    });

    return SendResponse(
      res,
      201,
      false,
      request,
      "Password change request submitted"
    );
  } catch (err) {
    return SendResponse(res, 500, true, null, err.message);
  }
};


export const getUserProfile = async(req,res)=>{
try {
  

  const user = await UserModel.findById(req.user.id).select("-password");
  if (!user) {
    return SendResponse(res, 404, true, null, "User not found");
  }
  SendResponse(res, 200, false, user, "User profile retrieved successfully");



} catch (error) {
  SendResponse(res, 500, true, null, error.message);
}

}
