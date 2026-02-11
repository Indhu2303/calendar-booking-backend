const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Meeting = sequelize.define("Meeting", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});


module.exports = Meeting;