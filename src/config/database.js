const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "calendar_db",     // database name
  "root",            // mysql username
  "Indhu@2003",   // mysql password
  {
    host: "localhost",
    dialect: "mysql",
  }
);

module.exports = sequelize;