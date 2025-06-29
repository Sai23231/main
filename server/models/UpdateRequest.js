import mongoose from 'mongoose';

const updateRequestSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    refPath: 'userType' 
  },
  userType: { 
    type: String, 
    enum: ['Vendor', 'Venue'], 
    required: true 
  },
  userName: { 
    type: String 
  },
  field: { 
    type: String, 
    required: true 
  },
  value: { 
    type: String, 
    required: true 
  },
  reason: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  adminNote: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

// Check if model already exists to prevent recompilation
const UpdateRequest = mongoose.models.UpdateRequest || mongoose.model('UpdateRequest', updateRequestSchema);
export default UpdateRequest; 