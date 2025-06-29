import mongoose from 'mongoose';

const serviceInquirySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional for non-logged in users
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  vision: {
    type: String,
    required: true
  },
  service: {
    service: String,
    category: String,
    fee: String,
    description: String,
    icon: String
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'confirmed', 'cancelled'],
    default: 'pending'
  },
  adminNotes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

export default mongoose.model('ServiceInquiry', serviceInquirySchema); 