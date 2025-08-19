import express from 'express';
import { login, requestPasswordChange, signup } from '../controllers/authController.js';
import { authenticateUser } from '../middleware/authenticareUser.js';


const router = express.Router()



router.post("/signup" , signup)
router.post("/login" , login)
router.post("/request-password-change", authenticateUser, requestPasswordChange)


export default router;