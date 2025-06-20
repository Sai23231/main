import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      // required: true,
    },
    phoneNumber: {
      type: String,
      // required: true,
      // unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
