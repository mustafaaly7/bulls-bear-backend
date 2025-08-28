import express from 'express';
import { authenticateUser } from '../middleware/authenticareUser.js';
import { buyCrypto, getSingleTrade, getTradeHistory, getUsertrades } from '../controllers/tradeController.js';


const router = express.Router()

router.post("/buy",buyCrypto);
router.get("/" ,getTradeHistory )
router.get('/my-trades' , authenticateUser,getUsertrades )
router.get('/:id' ,getSingleTrade )



export default router
