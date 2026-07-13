const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { getWallet } = require("../controllers/coinController");

router.get("/", protect, getWallet);

module.exports = router;