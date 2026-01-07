const Owner = require("../models/Owner");
const bcrypt = require("bcryptjs");

exports.ownerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // DEBUG LOG 1: See what the frontend is sending
    console.log("--- Login Attempt ---");
    console.log("Input Email:", email);

    const owner = await Owner.findOne({ where: { email } });

    if (!owner) {
      // DEBUG LOG 2: If not found, see who IS in the database
      const allOwners = await Owner.findAll();
      const existingEmails = allOwners.map((o) => o.email);

      console.log("❌ Owner not found in DB.");
      console.log("Emails currently in DB:", existingEmails);

      return res.status(404).json({
        success: false,
        message: "Owner account not found.",
        debug_found_in_db: existingEmails, // This helps you see the mistake in the browser
      });
    }

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials." });
    }

    owner.lastLogin = new Date();
    await owner.save();

    res.status(200).json({
      success: true,
      user: { fullName: owner.fullName, email: owner.email },
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
