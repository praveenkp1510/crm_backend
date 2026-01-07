const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const User = sequelize.define("User", {
  firstName: { type: DataTypes.STRING, allowNull: false },
  middleName: { type: DataTypes.STRING },
  lastName: { type: DataTypes.STRING, allowNull: false },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  mobile: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.TEXT, allowNull: false },
  employerName: { type: DataTypes.STRING },
  dob: { type: DataTypes.DATEONLY, allowNull: false }, // Store YYYY-MM-DD
  password: { type: DataTypes.STRING, allowNull: false },
  role: {
    type: DataTypes.ENUM("Owner", "Manager", "Employee"),
    defaultValue: "Employee",
  },
  otp: { type: DataTypes.STRING, allowNull: true },
});

module.exports = User;
