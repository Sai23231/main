import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const bookingSchema = new mongoose.Schema(
  {
    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: false,
      index: true
    },
    venueId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Venue",
      required: false,
      index: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "Pending",
      enum: ["Pending", "Approved", "Rejected", "Cancelled", "Completed"]
    },
    // Additional booking details
    eventType: {
      type: String,
      default: "Wedding"
    },
    guestCount: {
      type: Number,
      default: 0
    },
    specialRequirements: {
      type: String,
      default: ""
    },
    // Vendor response
    vendorResponse: {
      message: String,
      respondedAt: Date,
      respondedBy: String
    },
    // Pricing information
    quotedPrice: {
      type: Number,
      default: 0
    },
    finalPrice: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

bookingSchema.plugin(mongooseAggregatePaginate);

export default mongoose.model("Booking", bookingSchema);
