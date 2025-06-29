import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
  venueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue' },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  eventDate: { type: String, required: true },
  eventType: { type: String, required: true },
  guestCount: { type: Number, required: true },
  venue: { type: String },
  additionalServices: { type: String },
  budget: { type: String },
  specialRequirements: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'rejected', 'cancelled', 'completed'], 
    default: 'pending' 
  },
  quotedPrice: { type: Number },
  vendorResponse: {
    message: { type: String },
    respondedAt: { type: Date },
    respondedBy: { type: mongoose.Schema.Types.ObjectId }
  },
  notes: [{ 
    text: { type: String },
    addedBy: { type: mongoose.Schema.Types.ObjectId },
    addedAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Check if model already exists to prevent recompilation
const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);
export default Booking; 