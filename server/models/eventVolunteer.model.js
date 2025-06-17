// models/EventVolunteer.js
import mongoose from 'mongoose';

const eventVolunteerSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Volunteer',
    required: true
  },
  assignedRole: {
    type: String, // Optional: e.g., "Registration", "Logistics"
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent same volunteer being added twice to the same event
eventVolunteerSchema.index({ eventId: 1, volunteerId: 1 }, { unique: true });

const EventVolunteer = mongoose.model('EventVolunteer', eventVolunteerSchema);

export default EventVolunteer;
