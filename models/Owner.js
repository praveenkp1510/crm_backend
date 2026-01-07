const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Owner = sequelize.define("Owner", {
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "K P Praveen"
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mobile: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '9688553316'
  },
  profilePic: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "default-avatar.png"
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "Owner"
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

module.exports = Owner;