const { User } = require("../models");
const bcrypt = require("bcryptjs");
const SibApiV3Sdk = require("@getbrevo/brevo");

// --- 1. FIXED BREVO SETUP ---
let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Ensure your .env file has BREVO_API_KEY
apiInstance.setApiKey(
  SibApiV3Sdk.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

// --- 2. HELPER FUNCTION ---
const sendEmail = async (email, otp) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.subject = "Your Verification Code";

    // Professional HTML template
    sendSmtpEmail.htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif; color: #333;">
          <h2>Verification Code</h2>
          <p>Your 6-digit code is: <b style="font-size: 24px; color: #86D1D8;">${otp}</b></p>
          <p>This code will expire in 2 minutes.</p>
          <p>If you did not request this, please ignore this email.</p>
        </body>
      </html>`;

    // IMPORTANT: This email MUST be verified in your Brevo Dashboard under "Senders"
    sendSmtpEmail.sender = {
      name: "CRM Admin",
      email: "praveen1510kp@gmail.com", // This MUST be your verified Brevo sender email
    };

    sendSmtpEmail.to = [{ email: email }];

    console.log(`Attempting to send OTP to: ${email}...`);
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("Brevo API Response Success:", data.messageId);
    return data;
  } catch (error) {
    // This will print the EXACT reason from Brevo (e.g., "Sender not verified")
    console.error(
      "❌ BREVO ERROR:",
      error.response
        ? JSON.stringify(error.response.body, null, 2)
        : error.message
    );
    throw error;
  }
};

// --- 3. REGISTER ---
exports.register = async (req, res) => {
  try {
    // 1. Destructure ALL fields sent by the frontend
    const {
      firstName,
      middleName,
      lastName,
      email,
      password,
      role,
      mobile,
      address,
      employerName,
      dob,
    } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Pass all fields to the creation logic
    const newUser = await User.create({
      firstName,
      middleName,
      lastName,
      email,
      password: hashedPassword,
      mobile,
      address,
      employerName,
      dob,
      role: role || "Employee",
    });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    newUser.otp = otp;
    await newUser.save();

    // 3. The Mail Trigger
    await sendEmail(email, otp);

    res
      .status(201)
      .json({ success: true, message: "Registration successful. OTP sent." });
  } catch (error) {
    console.error("DETAILED ERROR:", error); // LOOK AT YOUR TERMINAL FOR THIS
    res
      .status(500)
      .json({
        success: false,
        message: "Registration failed",
        error: error.message,
      });
  }
};

// --- 4. LOGIN ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Account not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Password." });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    await user.save();

    await sendEmail(email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email.",
      email: user.email,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Login failed at mail trigger" });
  }
};

// --- 5. VERIFY OTP ---
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    if (user.otp === otp) {
      user.otp = null;
      await user.save();
      return res.status(200).json({
        success: true,
        message: "OTP Verified",
        user: { firstName: user.firstName, email: user.email },
      });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP code" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Verification server error" });
  }
};

// --- 6. RESEND OTP ---
exports.resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = newOtp;
    await user.save();

    await sendEmail(email, newOtp);

    res
      .status(200)
      .json({ success: true, message: "New OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Resend failed" });
  }
};
exports.getUserProfile = async (req, res) => {
  try {
    const { email } = req.query;
    console.log("Searching for email:", email); // Debug log

    const user = await User.findOne({
      where: { email: email },
      attributes: ["firstName", "lastName", "role", "email"],
    });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    // THIS LINE IS CRUCIAL: It will show the real error in your terminal
    console.error("DATABASE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password", "otp"] }, // Safety: don't send passwords
    });
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching users" });
  }
};
