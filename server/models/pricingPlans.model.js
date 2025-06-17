import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema({
  plan: {
    type: String,
    required: true,
  },
  eventDate: {
    type: Date,
    required: true,
  },
  requirements: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

const Plan = mongoose.model("Plan", PlanSchema);

export default Plan;
