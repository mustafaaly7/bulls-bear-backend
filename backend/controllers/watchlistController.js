import SendResponse from "../helpers/sendResponse.js"
import UserModel from "../models/userModel.js";
import Watchlist from "../models/watchlistModel.js";



export const getWatchlist =async (req, res) => {
try {
const watchlists = await Watchlist.find({userId: req.user.id}).populate("userId", "name email")
if(!watchlists || watchlists.length === 0) {
    return SendResponse(res, 404, null, false, "No watchlist found for this user.");    
}

SendResponse(res, 200, watchlists, true, "Watchlist retrieved successfully.");



    
} catch (error) {
    SendResponse(res, 500, null, false, error.message, );


}

}




export const addWatchlist =async (req, res) => {
try {

    const { assetType, assetSymbol } = req.body;

    // Create new watchlist item
    const watchItem = new Watchlist({ 
      userId: req.user.id,
      assetType,
      assetSymbol
    });
    await watchItem.save();

    // Push reference into user.watchlist
    const user = await UserModel.findByIdAndUpdate(
      req.user.id,
      { $push: { watchlist: watchItem._id } },
      { new: true }
    ).populate("watchlist");

    SendResponse(res, 201, user.watchlist, true, "Watchlist updated successfully.");
  




    

    
} catch (error) {
    SendResponse(res, 500, null, false, error.message, );


}

}




export const removeWatchlist =async (req, res) => {
try {
const watchId = req.params.id;
const watchItem = await Watchlist.findByIdAndDelete(watchId);
if (!watchItem) {
    return SendResponse(res, 404, null, false, "Watchlist item not found.");
}
// Remove reference from user's watchlist
await UserModel.findByIdAndUpdate(
    req.user.id,
    { $pull: { watchlist: watchId } },
    { new: true }
);  
SendResponse(res, 200, null, true, "Watchlist item removed successfully.");
    

    
} catch (error) {
    SendResponse(res, 500, null, false, error.message, );


}

}





