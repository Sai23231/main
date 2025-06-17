import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  organizerId: {    // Organizer will also login as user right..
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  organizerName: {
    type: String,
    required: true
  },
  eventName: {
    type: String,
    required: true
  },
  eventType: { 
    type: String, 
    required: true 
  },
  description: {
    type: String,
    required: true
  },
  coverImg: {
    type: String,
    required: true
  },
  eventPdf: {
    type: String, 
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Event = mongoose.model("Event", eventSchema);

export default Event;

