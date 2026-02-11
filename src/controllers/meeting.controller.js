const meetingService = require("../services/meeting.service");

const getMeetings = async (req, res) => {
  try {
    const { userId, startDate, endDate } = req.query;

    const meetings = await meetingService.getMeetings({
      userId,
      startDate,
      endDate,
    });

    res.status(200).json(meetings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching meetings" });
  }
};

const { Op } = require("sequelize");
const Meeting = require("../models/Meeting");

const updateMeeting = async (req, res) => {
  try {
    const meetingId = req.params.id;
    const { title, startTime, endTime } = req.body;

    if (!startTime || !endTime) {
      return res.status(400).json({
        error: "startTime and endTime are required",
      });
    }

    const meeting = await Meeting.findByPk(meetingId);

    if (!meeting) {
      return res.status(404).json({
        error: "Meeting not found",
      });
    }

    // overlap check (exclude same meeting)
    const overlappingMeeting = await Meeting.findOne({
      where: {
        userId: meeting.userId,
        id: { [Op.ne]: meetingId },
        startTime: { [Op.lt]: new Date(endTime) },
        endTime: { [Op.gt]: new Date(startTime) },
      },
    });

    if (overlappingMeeting) {
      return res.status(409).json({
        error: "Time slot already booked",
      });
    }

    // update
    meeting.title = title ?? meeting.title;
    meeting.startTime = new Date(startTime);
    meeting.endTime = new Date(endTime);

    await meeting.save();

    return res.status(200).json({
      message: "Meeting updated",
      meeting,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const deleteMeeting = async (req, res, next) => {
  try {
    const { id } = req.params;

    await meetingService.deleteMeeting(id);

    return res.status(200).json({
      message: "Meeting deleted successfully"
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMeetings,
  updateMeeting,
  deleteMeeting,
};

