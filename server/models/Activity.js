import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  userId: { type: String, required: true },
  page: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Activity = mongoose.model("Activity", activitySchema);
export default Activity;
