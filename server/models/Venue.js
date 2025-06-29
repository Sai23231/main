import mongoose from "mongoose";
const simpleVenueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  averageRating: {
    service: { type: Number, default: 0 },
    quality: { type: Number, default: 0 },
    value: { type: Number, default: 0 },
  },
  reviewCount: { type: Number, default: 0 },
});

const SimpleVenue = mongoose.model("SimpleVenue", simpleVenueSchema);
export default SimpleVenue;
