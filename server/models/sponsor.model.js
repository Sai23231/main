import mongoose from 'mongoose';

const sponsorSchema = new mongoose.Schema({
  // Admin-controlled fields
  name: {
    type: String,
    required: true
  },
  industry: {
    type: String,
    required: true
  },
  budget: {
    type: String,
    required: true
  },
  companyDescription: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  contactEmail: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  
  // Deliverables and sponsorship details
  deliverables: [{
    type: {
      type: String,
      enum: ['financial', 'in-kind', 'services', 'products', 'marketing', 'other'],
      required: true
    },
    description: {
      type: String,
      required: true
    },
    value: {
      type: String,
      default: ''
    }
  }],
  preferredEventTypes: [{
    type: String,
    enum: ['wedding', 'corporate', 'birthday', 'anniversary', 'graduation', 'other']
  }],
  targetAudience: {
    type: String,
    default: ''
  },
  sponsorshipLevels: [{
    name: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    benefits: [String]
  }],
  
  // Admin control fields
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  adminNotes: {
    type: String,
    default: ''
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Payment and commission tracking
  totalSponsoredAmount: {
    type: Number,
    default: 0
  },
  totalCommissionPaid: {
    type: Number,
    default: 0
  },
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'online_payment', 'check', 'other'],
    default: 'bank_transfer'
  },
  bankDetails: {
    accountName: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String
  }
}, { timestamps: true });

const Sponsor = mongoose.model("Sponsor", sponsorSchema);

export default Sponsor;
