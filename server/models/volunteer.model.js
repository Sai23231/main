// models/Volunteer.js
import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Volunteer will also login as user right..
    required: true,
    unique: true
  },
  fullName: {
    type: String,
    required: true
  },
  interests: {
    type: [String], // E.g. ['Logistics', 'Hospitality']
    default: []
  },
  availability: {
    type: String, // E.g. 'Weekends', 'Full-time', etc.
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

export default Volunteer;
