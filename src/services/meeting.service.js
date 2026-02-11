const { Op } = require("sequelize");
const Meeting = require("../models/Meeting");

const getMeetings = async ({ userId, startDate, endDate }) => {
  const where = {};

  if (userId) {
    where.userId = userId;
  }

  if (startDate && endDate) {
    where.startTime = { [Op.gte]: new Date(startDate) };
    where.endTime = { [Op.lte]: new Date(endDate) };
  }

  return await Meeting.findAll({
    where,
    order: [["startTime", "ASC"]],
  });
};


const { updateMeeting } = require("../controllers/meeting.controller");

const deleteMeeting = async (id) => {

  const meeting = await Meeting.findByPk(id);

  if (!meeting) {
    const error = new Error("Meeting not found");
    error.status = 404;
    throw error;
  }

  await meeting.destroy();

  return true;
};

module.exports = {
  getMeetings,
  updateMeeting,
  deleteMeeting,
};