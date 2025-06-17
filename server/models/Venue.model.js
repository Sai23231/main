import mongoose, { Schema } from "mongoose";

// const VenueSchema = new Schema({
//   title: { type: String, required: true },
//   location: { type: String, required: true },
//   pax: { type: String, required: true },
//   guests: { type: String, required: true },
//   vegPrice: { type: String, default:"NA" },
//   nonVegPrice: { type: String, default:"NA" },
//   price: { type: String, required: true },
//   imgSrc: { type: String, required: true },
//   detailUrl: { type: String, required: true },
//   averageRating: { type: Number, default: 0 }
// });

const VenueSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  location: { type: String, required: true },
  pax: { type: String, required: true },
  guests: { type: String, required: true },
  capacity: {
    seating: { type: Number, required: true },
    maxCapacity: { type: Number, required: true },
  },
  price: {
    veg: { type: String, required: true },
    nonVeg: { type: String, default: null },
  },
  rentPrice: { type: String, required: true },
  coverImgSrc: { type: String, required: true },
  contact: {
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  photos: [{ type: String }], // Array of image URLs
  categories: [{ type: String }],
  services: {
    banquetType: [{ type: String }], // List of banquet types
    serves: [{ type: String }], // List of serving options
  },
  policies: {
    timingSlots: [{ type: String }],
    changingRoom: [{ type: String }],
    parking: [{ type: String }],
    advancePayment: [{ type: String }],
    taxes: [{ type: String }],
    cancellation: [{ type: String }],
    food: [{ type: String }],
    decoration: [{ type: String }],
    lodging: [{ type: String }],
    OtherPolicies: [{ type: String }],
    Alcohol: [{ type: String }],
  },
  mapEmbedUrl: { type: String, required: true },
  // detailUrl: { type: String, required: true },
  averageRating: { type: Number, default: 0 },
});
const Venue = mongoose.model("Venue", VenueSchema);
export default Venue;
