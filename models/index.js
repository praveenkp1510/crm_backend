const sequelize = require("../config/db");
const User = require("./User");

// Centralized Database Object
const db = {
  User,
  sequelize,
};

// Exporting the database object
module.exports = db;
