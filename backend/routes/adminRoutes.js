import express from 'express';
import { acceptUser, approvePasswordChange } from '../controllers/adminController.js';


const router = express.Router()



router.put("/:id" , acceptUser)
router.patch("/change-password/approve/:id", approvePasswordChange) // Assuming approvePasswordChange is imported from the adminController.js


export default router;