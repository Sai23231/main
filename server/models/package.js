import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    weddingDate: {
      type: Date,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
    },
    additionalRequests: {
      type: String,
      default: "",
    },
    packageName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Package = mongoose.model("Package", packageSchema);

export default Package;
