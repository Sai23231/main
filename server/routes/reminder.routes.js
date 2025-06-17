import express from "express";
import Reminder from "../models/reminder.model.js";

const router = express.Router();

// Get all reminders
router.get("/", async (_, res) => {
  try {
    const reminders = await Reminder.find();
    res.json(reminders); // Return all reminders
  } catch (error) {
    res.status(500).json({ message: error.message }); // Return an error if something goes wrong
  }
});

// Create a new reminder
router.post("/", async (req, res) => {
  const { date, message } = req.body;

  // Validation: Ensure required fields are provided
  if (!date || !message) {
    return res
      .status(400)
      .json({ message: "Both date and message are required." });
  }

  try {
    const reminder = new Reminder({ date, message });

    // Save the reminder to the database
    const savedReminder = await reminder.save();
    res.status(201).json(savedReminder); // Return the saved reminder with status 201
  } catch (error) {
    res.status(400).json({ message: error.message }); // Return an error if saving the reminder fails
  }
});

export default router;
