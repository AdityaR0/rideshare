// server/src/routes/sosRoutes.js
const express = require("express");
const { exec } = require("child_process");
const path = require("path");

const router = express.Router();

// POST /api/sos/trigger
router.post("/trigger", (req, res) => {
  const pythonFile = path.join(__dirname, "../../../alert/alert.py");
  console.log("Running Python SOS script:", pythonFile);

  exec(`python "${pythonFile}"`, (error, stdout, stderr) => {
    console.log("STDOUT:", stdout);
    console.log("STDERR:", stderr);

    // If Python script fails but stdout contains success, treat it as success
    if (error && !stdout.includes("✅ SOS SMS sent")) {
      console.error("SOS ERROR:", error.message);
      return res.status(500).json({ success: false, error: error.message });
    }

    return res.json({ success: true, message: "✅ SOS alert sent!", output: stdout });
  });
});

module.exports = router;
