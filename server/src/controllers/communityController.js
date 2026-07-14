const User = require("../models/User");
const OTP = require("../models/OTP");
const sendOTPEmail = require("../utils/sendEmail");
const CommunityPost = require("../models/CommunityPost");
const Ride = require("../models/Ride");
const Booking = require("../models/Booking");

// GET my community members
exports.getMyCommunity = async (req, res) => {
  try {
    const user = req.user;

    if (!user.community) {
      return res.json({ community: null, members: [] });
    }

    const members = await User.find({
      community: user.community,
    }).select("name role vehicles workingAt");

    // res.json({
    //   community: user.community,
    //   members,
    // });
    res.json({
  community: user.community,
  officialCommunities: user.officialCommunities || [],
  members,
});
  } catch (err) {
    res.status(500).json({ message: "Community fetch failed" });
  }
};
exports.joinLocalCommunity = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // already joined
    if (user.community === "local") {
      return res.json({ message: "Already joined" });
    }

    user.community = "local";
    await user.save();

    res.json({ success: true, message: "Joined local community" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Join failed" });
  }
};
exports.sendCommunityOTP = async (req, res) => {
  try {
    const { email, communityName } = req.body;

    if (!email || !communityName) {
      return res.status(400).json({
        message: "Email and community required",
      });
    }

    // TMSL verification
    if (
      communityName === "tmsl" &&
      !email.endsWith("@ticollege.org")
    ) {
      return res.status(400).json({
        message: "Use official TMSL email",
      });
    }

    // Infosys verification
    if (
      communityName === "infosys" &&
      !email.endsWith("@infosys.com")
    ) {
      return res.status(400).json({
        message: "Use official Infosys email",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    await OTP.deleteMany({ email });

    await OTP.create({
      email,
      otp,
      expiresAt: new Date(
        Date.now() + 10 * 60 * 1000
      ),
    });

    await sendOTPEmail(email, otp);

    res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to send OTP",
    });
  }
};
exports.verifyCommunityOTP = async (req, res) => {
  try {
    const {
      email,
      otp,
      communityName,
    } = req.body;

    const record = await OTP.findOne({
      email,
      otp,
    });

    if (!record) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (
      new Date(record.expiresAt) <
      new Date()
    ) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    const user = await User.findById(
      req.user._id
    );

    const alreadyJoined =
      user.officialCommunities.find(
        (c) =>
          c.communityName === communityName
      );

    if (!alreadyJoined) {
      user.officialCommunities.push({
        communityName,
        verifiedEmail: email,
        verified: true,
      });
    }

    await user.save();

    await OTP.deleteMany({ email });

    res.json({
      success: true,
      message:
        "Community joined successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Verification failed",
    });
  }
};

exports.getTMSLMembers = async (req, res) => {
  try {
    const members = await User.find({
      officialCommunities: {
        $elemMatch: {
          communityName: "tmsl",
          verified: true,
        },
      },
    }).select("name role vehicles workingAt");

    res.json({ members });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch TMSL members",
    });
  }
};

exports.getInfosysMembers = async (req, res) => {
  try {
    const members = await User.find({
      officialCommunities: {
        $elemMatch: {
          communityName: "infosys",
          verified: true,
        },
      },
    }).select("name role vehicles workingAt");

    res.json({ members });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch Infosys members",
    });
  }
};

// ===============================
// CREATE COMMUNITY POST
// ===============================
exports.createPost = async (req, res) => {
  try {
    const user = req.user;
    const { message, attachRide, community } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    // Decide community automatically
    // Validate selected community

if (community === "local") {

  if (user.community !== "local") {
    return res.status(403).json({
      message: "You are not a member of Local Community",
    });
  }

}

else if (community === "tmsl") {

  const joined = user.officialCommunities.some(
    c =>
      c.communityName === "tmsl" &&
      c.verified
  );

  if (!joined) {
    return res.status(403).json({
      message: "You are not a member of TMSL Community",
    });
  }

}

else if (community === "infosys") {

  const joined = user.officialCommunities.some(
    c =>
      c.communityName === "infosys" &&
      c.verified
  );

  if (!joined) {
    return res.status(403).json({
      message: "You are not a member of Infosys Community",
    });
  }

}

else {

  return res.status(400).json({
    message: "Invalid community",
  });

}

let rideId = null;

if (attachRide) {

    const ride = await Ride.findOne({
        driver: user._id,
        status: "OPEN"
    });

    // Driver checked the box but has no active ride
    if (!ride) {
        return res.status(400).json({
            success: false,
            message: "You don't have any active ride to attach."
        });
    }

    rideId = ride._id;
}

    const post = await CommunityPost.create({
  community,
  user: user._id,
  message,
  ride: rideId,
});

const populatedPost = await CommunityPost.findById(post._id)
.populate("user", "name role profileImage")
.populate(
  "ride",
  `
origin
destination
date
pricePerSeat
seatsAvailable
vehicleName
vehicleType
vehicleNumber
status
driver
`
);

    res.status(201).json(populatedPost);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to create post",
    });
  }
};

// ===============================
// GET COMMUNITY POSTS
// ===============================
exports.getPosts = async (req, res) => {
  try {
    const user = req.user;

    const requestedCommunity = req.params.community;

let community = "";

if (requestedCommunity === "local") {

  community = "local";

}
else if (
  requestedCommunity === "tmsl" &&
  user.officialCommunities.some(
    c => c.communityName === "tmsl" && c.verified
  )
) {

  community = "tmsl";

}
else if (
  requestedCommunity === "infosys" &&
  user.officialCommunities.some(
    c => c.communityName === "infosys" && c.verified
  )
) {

  community = "infosys";

}
else {

  return res.status(403).json({
    message: "Access denied",
  });

}
console.log("Current Community:", community);
const posts = await CommunityPost.find({
  community,
})
.populate("user", "name role profileImage")
.populate("comments.user", "name role profileImage")
.populate(
  "ride",
  `
origin
destination
date
pricePerSeat
seatsAvailable
vehicleName
vehicleType
vehicleNumber
status
driver
`
)
.sort({ createdAt: -1 });

const postsWithBooking = await Promise.all(

posts.map(async (post) => {

if (!post.ride) {
return {
...post.toObject(),
bookingStatus: null,
};
}

const booking = await Booking.findOne({
ride: post.ride._id,
passenger: req.user._id,
});

return {
...post.toObject(),
bookingStatus: booking ? booking.status : null,
};

})

);

    res.json(postsWithBooking);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to fetch posts",
    });
  }
};

// ===============================
// ADD COMMENT TO A POST
// ===============================
exports.addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        message: "Comment cannot be empty",
      });
    }

    const post = await CommunityPost.findById(id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    let userCommunity = "";

if (req.user.community === "local") {
  userCommunity = "local";
} else if (
  req.user.officialCommunities.some(
    c => c.communityName === "tmsl" && c.verified
  )
) {
  userCommunity = "tmsl";
} else if (
  req.user.officialCommunities.some(
    c => c.communityName === "infosys" && c.verified
  )
) {
  userCommunity = "infosys";
}

if (post.community !== userCommunity) {
  return res.status(403).json({
    message: "You cannot comment on another community's post",
  });
}

    post.comments.push({
      user: req.user._id,
      text,
    });

    await post.save();

    const updatedPost = await CommunityPost.findById(id)
      .populate("user", "name role profileImage")
      .populate("comments.user", "name role profileImage");

    res.json(updatedPost);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to add comment",
    });
  }
};
