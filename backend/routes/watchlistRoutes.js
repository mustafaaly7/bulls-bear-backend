import express from 'express';
import { authenticateUser } from '../middleware/authenticareUser.js';
import { addWatchlist, getWatchlist, removeWatchlist } from '../controllers/watchlistController.js';


const router = express.Router()

router.get('/' , authenticateUser , getWatchlist)
router.post("/add-to-watchlist",authenticateUser, addWatchlist);
router.put("/remove-from-watchlist/:id", authenticateUser, removeWatchlist);



export default router;
