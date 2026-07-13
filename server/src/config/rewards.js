// =========================================
// RIDECOINS CONFIGURATION
// =========================================

module.exports = {
  // Welcome bonus for new users
  WELCOME_BONUS: 25,

  // Ride completion reward
  NORMAL_REWARD_PERCENT: 5,
  PREMIUM_REWARD_PERCENT: 10,

  // Redeem limits
  NORMAL_REDEEM_LIMIT: 30,
  PREMIUM_REDEEM_LIMIT: 50,

  // Coin validity
  COIN_VALIDITY_DAYS: 90,


  // Automatic RideCoin Redemption Rules
REDEMPTION_RULES: [
  {
    minFare: 0,
    maxFare: 199,
    percent: 5,
  },
  {
    minFare: 200,
    maxFare: 499,
    percent: 10,
  },
  {
    minFare: 500,
    maxFare: 999,
    percent: 15,
  },
  {
    minFare: 1000,
    maxFare: 1999,
    percent: 20,
  },
  {
    minFare: 2000,
    maxFare: Infinity,
    percent: 30,
  },
],
};