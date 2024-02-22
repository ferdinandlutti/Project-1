const express = require("express");
const router = express.Router();
router.post("/pictures/upload", async (req, res) => {
  const { files } = req.body; // Assuming 'files' contains Cloudinary URLs
  try {
    // Example: Store image URLs in the user's profile in your database
    // You might need to authenticate the user and find their profile first
    const userId = req.user.id; // Example: Get user ID from authenticated session
    const user = await User.findById(userId);
    user.profilePicture = files[0].photo_url; // Example: Update profile picture URL
    await user.save();
    res.json({ ok: true, message: "Profile picture updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, message: "An error occurred" });
  }
});
