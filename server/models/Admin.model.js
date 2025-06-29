import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "admin",
      enum: ["admin", "super_admin"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    permissions: {
      vendorManagement: {
        type: Boolean,
        default: true,
      },
      sponsorManagement: {
        type: Boolean,
        default: true,
      },
      userManagement: {
        type: Boolean,
        default: true,
      },
      systemSettings: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance (removed duplicate email index)
adminSchema.index({ role: 1 });

// Check if model already exists to prevent recompilation
const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export default Admin; 