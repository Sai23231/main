import mongoose,{Schema} from "mongoose";

const vendorListSchema = new Schema({
    name: { type: String, required: true },
    CoverImage: { type: String },
    rating: { type: String  },
    location: { type: String, required: true },
    type: { type: String, required: true },
    pricing: {
      package: { type: String, required: true },
      price: { type: String, required: true }
    },
    contact: {
      phone: { type: String, required: true }
    },
    photos: [{ type: String ,required:true}],
    description: { type: String, required: true },
    services: [{ type: String }],
    averageRating: { type: Number, default: 0 }
  }, { timestamps: true });

const VendorList = mongoose.model("VendorList", vendorListSchema);
export default VendorList;
