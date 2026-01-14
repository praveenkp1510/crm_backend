require("dotenv").config();
const express = require("express");
const cors = require("cors");
const os = require("os");
const { sequelize } = require("./models");
const bcrypt = require("bcryptjs");
const Owner = require("./models/Owner");
const authRoutes = require("./routes/authRoutes");
const ownerRoutes = require("./routes/ownerRoutes");

const app = express();
// app.use(cors());
app.use(express.json());

app.use(
  cors({
    origin: "*", // Allows all origins (good for development)
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/owner", ownerRoutes);

// Change this:
const PORT = process.env.PORT || 5100;

// Helper to get your IP
const getLocalIp = () => {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
};

sequelize
  .sync() // Instead of sync({force: true}), just check connection
  .then(async () => {
    console.log("✅ Database connected successfully (Manual Tables Detected).");

    try {
      const hashedPassword = await bcrypt.hash("ProOwner@123", 10);

      const [owner, created] = await Owner.findOrCreate({
        where: { email: "ProductOwner@gmail.com" },
        defaults: {
          fullName: "K P Praveen",
          password: hashedPassword,
          mobile: "9688553316",
          role: "Owner",
          isActive: true,
        },
      });

      if (created) {
        console.log("🎁 Initial Product Owner created successfully!");
      } else {
        console.log("ℹ️ Product Owner already exists in database.");
      }
    } catch (seedError) {
      console.error("❌ Seeding Error:", seedError.message);
    }

    const IP = getLocalIp();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`-------------------------------------------`);
      console.log(`🚀 SERVER IS LIVE`);
      console.log(`🌐 NETWORK: http://${IP}:${PORT}`);
      console.log(`-------------------------------------------`);
    });
  })
  .catch((err) => console.error("❌ DB CONNECTION ERROR:", err));
