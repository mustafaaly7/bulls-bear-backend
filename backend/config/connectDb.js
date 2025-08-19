import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
export const ConnectDb =  async()=>{
try {
    const connect = await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("Database connected successfully:", connect.connection.host);




} catch (error) {
    console.error("Database connection failed:", error);
}



}
