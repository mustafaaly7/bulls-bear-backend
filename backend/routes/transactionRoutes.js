import express from 'express';
import { authenticateUser } from '../middleware/authenticareUser.js';
import { getUserTransactions, requestDeposit, requestWithdraw } from '../controllers/transactionController.js';


const router = express.Router()

router.get("/"  ,authenticateUser , getUserTransactions)
router.post("/deposit"  ,authenticateUser , requestDeposit)
router.post("/withdraw"  ,authenticateUser , requestWithdraw)



export default router;
