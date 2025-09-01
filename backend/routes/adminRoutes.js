import express from 'express';
import { acceptUser, approveRejectrequest, approveTransaction, getAllUsers, getAllusersTransactions, getUserpasswordRequests, getUserprofileRequests, } from '../controllers/adminController.js';
import { authorizeAdmin } from '../middleware/authenticareUser.js';


const router = express.Router()

router.get("/users",authorizeAdmin, getAllUsers)
router.get("/user-requests",authorizeAdmin, getUserprofileRequests)
router.put("/:id",authorizeAdmin, acceptUser)
router.get("/password-requests",authorizeAdmin, getUserpasswordRequests)
router.patch("/change-password/approve/:id",authorizeAdmin, approveRejectrequest)
router.get("/get-all-transactions" ,authorizeAdmin, getAllusersTransactions)
router.put("/transactions/:id",authorizeAdmin, approveTransaction);


export default router;