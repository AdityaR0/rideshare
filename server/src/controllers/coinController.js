const User = require("../models/User");
const CoinTransaction = require("../models/CoinTransaction");

exports.getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("rideCoins isPremium");

    const transactions = await CoinTransaction.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.json({
      balance: user.rideCoins,
      premium: user.isPremium,
      transactions,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Unable to fetch wallet",
    });
  }
};

