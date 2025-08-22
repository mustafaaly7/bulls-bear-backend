import express from 'express';
import { acceptUser, approveRejectrequest, approveTransaction, getAllUsers, getAllusersTransactions, getUserpasswordRequests, getUserprofileRequests, } from '../controllers/adminController.js';


const router = express.Router()

router.get("/users", getAllUsers)
router.get("/user-requests", getUserprofileRequests)
router.put("/:id", acceptUser)
router.get("/password-requests", getUserpasswordRequests)
router.patch("/change-password/approve/:id", approveRejectrequest)
router.get("/get-all-transactions" , getAllusersTransactions)
router.put("/transactions/:id", approveTransaction);


export default router;