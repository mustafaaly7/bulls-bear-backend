import express from "express";
import SendResponse from "./helpers/sendResponse.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { ConnectDb } from "./config/connectDb.js";
import watchlistRoutes from  './routes/watchlistRoutes.js'
import transactionRoutes from "./routes/transactionRoutes.js"

const app = express();
app.use(express.json());

ConnectDb()


app.get("/", (req, res) => {
    SendResponse(res , 200 , false ,null , "Welcome to the API");
}
)

app.use("/api/admin", adminRoutes);
app.use("/api/auth",authRoutes );
app.use("/api/watchlist",watchlistRoutes );
app.use("/api/transaction",transactionRoutes );


app.listen(3000, () => {  console.log("Server is running on port 3000");
});