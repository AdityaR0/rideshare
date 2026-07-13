const User = require("../models/User");
const CoinTransaction = require("../models/CoinTransaction");
const rewards = require("../config/rewards");

/**
 * Give RideCoins to a user
 */
const giveRideCoins = async ({
  userId,
  coins,
  reason,
}) => {
  try {
    // Find user
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Add RideCoins
user.rideCoins += coins;

// Increase total earned RideCoins
user.totalRideCoinsEarned += coins;

await user.save();

    // Expiry Date
    const expiryDate = new Date();

    expiryDate.setDate(
      expiryDate.getDate() + rewards.COIN_VALIDITY_DAYS
    );

    // Save transaction
    await CoinTransaction.create({
      user: user._id,
      coins,
      transactionType: "credit",
      reason,
      expiryDate,
    });

    return true;
  } catch (error) {
    console.error("RideCoins Error:", error.message);
    return false;
  }
};

module.exports = {
  giveRideCoins,
};