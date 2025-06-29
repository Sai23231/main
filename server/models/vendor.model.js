import mongoose from "mongoose";

const vendorSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  location: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  CoverImage: { 
    type: String, 
    default: "" 
  },
  rating: { 
    type: String, 
    default: "0.0" 
  },
  reviews: { 
    type: Number, 
    default: 0 
  },
  averageRating: { 
    type: Number, 
    default: 0 
  },
  pricing: {
    package: { type: String, default: "Standard Package" },
    price: { type: String, default: "Contact for pricing" }
  },
  contact: {
    phone: { type: String, required: true },
    email: { type: String, required: true },
    website: { type: String, default: "" }
  },
  photos: [{ 
    type: String 
  }],
  services: [{ 
    type: String 
  }],
  businessDetails: {
    address: { type: String, default: "" },
    experience: { type: String, default: "" },
    teamSize: { type: String, default: "" },
    languages: [{ type: String }],
    specializations: [{ type: String }]
  },
  businessHours: {
    monday: { type: String, default: "" },
    tuesday: { type: String, default: "" },
    wednesday: { type: String, default: "" },
    thursday: { type: String, default: "" },
    friday: { type: String, default: "" },
    saturday: { type: String, default: "" },
    sunday: { type: String, default: "" }
  },
  socialMedia: {
    facebook: { type: String, default: "" },
    instagram: { type: String, default: "" },
    twitter: { type: String, default: "" },
    linkedin: { type: String, default: "" }
  },
  status: { 
    type: String, 
    enum: ["pending", "approved", "rejected"], 
    default: "pending" 
  },
  submittedAt: { 
    type: Date, 
    default: Date.now 
  },
  approvedAt: { 
    type: Date 
  },
  approvedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Admin' 
  },
  bookings: [{
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
    createdAt: { type: Date, default: Date.now }
  }],
  portfolio: [{
    url: { type: String, required: true },
    publicId: { type: String },
    filename: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    uploadedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Check if model already exists to prevent recompilation
const Vendor = mongoose.models.Vendor || mongoose.model("Vendor", vendorSchema);
export default Vendor; 