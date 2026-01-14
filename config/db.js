// const { Sequelize } = require('sequelize');
// require('dotenv').config();

// const sequelize = new Sequelize(
//   process.env.DB_NAME,
//   process.env.DB_USER,
//   process.env.DB_PASSWORD,
//   {
//     host: '127.0.0.1', // Force IPv4 to stop the 2-minute hang
//     dialect: 'postgres',
//     port: 5432,
//     logging: console.log, // Temporarily turn this on to see if SQL is running
//     pool: {
//       max: 5,
//       acquire: 5000, // If it doesn't connect in 5s, it's a fail
//       idle: 10000
//     }
//   }
// );

// // TEST CONNECTION IMMEDIATELY
// sequelize.authenticate()
//   .then(() => console.log('🚀 SUCCESS: Database is connected!'))
//   .catch(err => {
//     console.error('❌ DATABASE ERROR: Check your .env credentials and ensure Postgres is running.');
//     console.error(err.message);
//   });

// module.exports = sequelize;

const { Sequelize } = require("sequelize");
require("dotenv").config();

// Use the long string from Neon
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Required for Neon.tech
    },
  },
});

module.exports = sequelize;
