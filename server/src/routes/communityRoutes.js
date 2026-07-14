const express = require("express");
const { protect } = require("../middleware/authMiddleware");
// const { getMyCommunity } = require("../controllers/communityController");
// const { getMyCommunity, joinLocalCommunity } = require("../controllers/communityController");
const {
  getMyCommunity,
  joinLocalCommunity,
  sendCommunityOTP,
  verifyCommunityOTP,
  getTMSLMembers,
  getInfosysMembers,
  createPost,
  getPosts,
  addComment,
} = require("../controllers/communityController");

const router = express.Router();

router.get("/my", protect, getMyCommunity);

// Community Posts
router.post("/post", protect, createPost);
router.get("/posts/:community", protect, getPosts);
router.post("/comment/:id", protect, addComment);

router.post("/join-local", protect, joinLocalCommunity);

router.post(
  "/send-otp",
  protect,
  sendCommunityOTP
);

router.post(
  "/verify-otp",
  protect,
  verifyCommunityOTP
);

router.get(
  "/tmsl-members",
  protect,
  getTMSLMembers
);

router.get(
  "/infosys-members",
  protect,
  getInfosysMembers
);

module.exports = router;
