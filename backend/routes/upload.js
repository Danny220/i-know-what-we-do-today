const express = require("express");
const auth = require("../middleware/auth");
const cloudinary = require("cloudinary").v2;
const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// POST /api/upload/signature - Generate a signature for secure upload
router.post("/signature", auth, (req, res) => {
  const timestamp = Math.round(new Date().getTime() / 1000);

  const signature = cloudinary.utils.api_sign_request(
    { timestamp },
    process.env.CLOUDINARY_API_SECRET,
  );

  res.json({ timestamp, signature });
});

module.exports = router;
