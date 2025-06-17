import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sponsor', required: true },
  amount: { type: String, required: true }, // Amount sponsor is proposing to sponsor the event
  message: { type: String, required: true }, // Message & Terms from the sponsor to the event organizer
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Rejected'], 
    default: 'Pending' 
  },
  date: { type: Date, default: Date.now }
});

const Proposal = mongoose.model("Proposal", proposalSchema);

export default Proposal;
