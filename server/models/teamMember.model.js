import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const TeamMember = mongoose.model("TeamMember", teamMemberSchema);
export default TeamMember;
