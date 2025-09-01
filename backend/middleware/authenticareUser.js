import UserModel from "../models/userModel.js"
import SendResponse from "../helpers/sendResponse.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();



export  function authenticateUser(req,res,next){
const bearerToken = req.headers?.authorization;
if(!bearerToken) return SendResponse(res , 404 , null ,true , "Token not found")

    const token = bearerToken.split(' ')[1]
    const decoded  = jwt.verify(token , process.env.AUTH_SECRET)
    
    req.user = decoded
    console.log("bearerToken => " , req.user.id);
// console.log("decoded => " , decoded);
next()

}



export function authorizeAdmin(req,res,next){
    const bearerToken = req.headers?.authorization;
    
if(!bearerToken) return SendResponse(res , 404 , null ,true , "Token not found")

    const token = bearerToken.split(' ')[1]
    const decoded  = jwt.verify(token , process.env.AUTH_SECRET)
 console.log("decoded.role => " , decoded.role)
    if(decoded.role !== 'admin') return SendResponse(res , 403 , null ,true , "You are not authorized to access this resource")
    req.user = decoded
    console.log("bearerToken => " , req.user.id);
// console.log("decoded => " , decoded);
next()
}