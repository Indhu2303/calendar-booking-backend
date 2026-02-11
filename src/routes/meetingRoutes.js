const express = require("express");
console.log("meetingRoutes file loaded=========");
const router = express.Router();
const meetingController = require("../controllers/meeting.controller");
const { Op } = require("sequelize");
const Meeting = require("../models/Meeting");




router.post("/", async (req, res) => {
  try {
    
    // ✅ BODY VALIDATION FIRST
    if (!req.body || !req.body.startTime || !req.body.endTime || !req.body.userId) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    // ✅ SAFE DESTRUCTURING AFTER VALIDATION
    const { title, userId } = req.body;
    const startTime = new Date(req.body.startTime);
    const endTime = new Date(req.body.endTime);

    

    // ✅ OVERLAP CHECK
    const overlappingMeeting = await Meeting.findOne({
      where: {
        userId,
        startTime: { [Op.lt]: endTime },
        endTime: { [Op.gt]: startTime },
      },
    });

    

    if (overlappingMeeting) {
      return res.status(409).json({
        error: "Time slot already booked",
      });
    }

    // ✅ CREATE MEETING
    const meeting = await Meeting.create({
      title,
      startTime,
      endTime,
      userId,
    });

    return res.status(201).json({
      message: "Meeting created",
      meeting,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


router.get("/", meetingController.getMeetings);
router.put("/:id", meetingController.updateMeeting);
router.delete("/:id", meetingController.deleteMeeting);
module.exports = router;