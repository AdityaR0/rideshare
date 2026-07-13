const User = require("../models/User");
const CoinTransaction = require("../models/CoinTransaction");
const rewards = require("../config/rewards");

const giveRideCoins = async ({
  userId,
  rideAmount,
  reason = "Ride Completed",
}) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Premium users get 10%
    // Normal users get 5%
    const percentage = user.isPremium ? 10 : 5;

    const coins = Math.floor((rideAmount * percentage) / 100);

    if (coins <= 0) {
      return;
    }

    // Add coins
    user.rideCoins += coins;
    user.totalRideCoinsEarned += coins;

    await user.save();

    // Expire after 90 days
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 90);

    // Save transaction
    await CoinTransaction.create({
      user: user._id,
      coins,
      transactionType: "credit",
      reason,
      expiryDate,
    });

    console.log(`✅ ${coins} RideCoins added to ${user.name}`);
  } catch (err) {
    console.error("RideCoin Service Error:", err);
  }
};



/**
 * Calculate RideCoin redemption for payment
 */
const calculateRideCoinDiscount = ({
  rideFare,
  availableCoins,
  isPremium,
}) => {
  // Premium users
  if (isPremium) {
    const maxDiscount = Math.floor(
      (rideFare * rewards.PREMIUM_REDEEM_LIMIT) / 100
    );

    const coinsUsed = Math.min(maxDiscount, availableCoins);

    return {
      rideFare,
      coinsUsed,
      payableAmount: rideFare - coinsUsed,
    };
  }

  // Normal users
  let redeemPercent = 0;

  for (const rule of rewards.REDEMPTION_RULES) {
    if (
      rideFare >= rule.minFare &&
      rideFare <= rule.maxFare
    ) {
      redeemPercent = rule.percent;
      break;
    }
  }

  const maxDiscount = Math.floor(
    (rideFare * redeemPercent) / 100
  );

  const coinsUsed = Math.min(maxDiscount, availableCoins);

  return {
    rideFare,
    coinsUsed,
    payableAmount: rideFare - coinsUsed,
  };
};



module.exports = {
  giveRideCoins,
  calculateRideCoinDiscount,
};