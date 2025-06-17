import bcrypt from "bcryptjs";
import Vendor from "../models/vendor.register.model.js";
import { generateAccessToken } from "../utils/accessToken.js";

// Registration controller
export const registerVendor = async (req, res) => {
  try {
    const { name, email, phone, city, password, businessType } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !city || !password || !businessType) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Check if vendor already exists
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res
        .status(400)
        .json({ success: false, message: "Vendor already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new vendor
    const newVendor = new Vendor({
      name,
      email,
      phone,
      city,
      password: hashedPassword,
      businessType,
    });

    await newVendor.save();

    const data = {
      email: newVendor.email,
      password: newVendor.password,
    };

    // Generate token
    const token = generateAccessToken(data);

    res.status(201)
    .cookie("token", token, { httpOnly: true })
    .json({
      success: true,
      message: "Vendor registered successfully",
      // token,
      newVendor: {
        id: newVendor._id,
        email: newVendor.email,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Login controller
export const loginVendor = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    // Validate required fields
    if (!identifier || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // Find vendor by email or phone
    const vendor = await Vendor.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });
    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    // Generate JWT token
    const data = {
      id: vendor._id,
      email: vendor.email,
    };
    const token = generateAccessToken(data);

    res.status(200)
    .cookie("token", token, { httpOnly: true })
    .json({
      success: true,
      message: "Login successful",
      // token,
      vendor: {
        id: vendor._id,
        email: vendor.email,
        phone: vendor.phone,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
