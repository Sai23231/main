import mongoose from "mongoose";

const ReminderSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  message: { type: String, required: true },
  isMilestone: { type: Boolean, default: false },
});

const Reminder = mongoose.model("Reminder", ReminderSchema);

export default Reminder;
