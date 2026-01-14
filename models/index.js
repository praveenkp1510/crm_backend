const sequelize = require("../config/db");
const User = require("./User");
const Owner = require("./Owner"); // Add this

const db = {
  User,
  Owner, // Add this
  sequelize,
};

module.exports = db;
