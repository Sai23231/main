import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  // Payment details
  proposalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Proposal",
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true
  },
  sponsorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sponsor",
    required: true
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  
  // Amount details
  amount: {
    type: Number,
    required: true
  },
  platformAmount: {
    type: Number,
    default: 0
  },
  organizerAmount: {
    type: Number,
    default: 0
  },
  
  // Payment method and status
  paymentMethod: {
    type: String,
    enum: ["bank_transfer", "razorpay", "cash", "other"],
    default: "bank_transfer"
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending"
  },
  
  // Transaction details
  transactionId: {
    type: String,
    default: ""
  },
  bankTransferDetails: {
    type: Object,
    default: {}
  },
  
  // Razorpay fields (for compatibility)
  razorpay_order_id: {
    type: String,
    default: ""
  },
  razorpay_payment_id: {
    type: String,
    default: ""
  },
  razorpay_signature: {
    type: String,
    default: ""
  },
  
  // Timestamps
  paymentDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for better query performance
paymentSchema.index({ sponsorId: 1 });
paymentSchema.index({ eventId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paymentDate: -1 });

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment; 