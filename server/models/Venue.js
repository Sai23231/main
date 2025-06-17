import mongoose from "mongoose";
const venueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  averageRating: {
    service: { type: Number, default: 0 },
    quality: { type: Number, default: 0 },
    value: { type: Number, default: 0 },
  },
  reviewCount: { type: Number, default: 0 },
});

const Venue = mongoose.model("Venue", venueSchema);
export default Venue;
