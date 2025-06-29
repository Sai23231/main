import bcrypt from "bcryptjs";
import VendorList from "../models/vendor.model.js";
import { generateAccessToken } from "../utils/accessToken.js";

// Registration controller
export const registerVendor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      businessName,
      description,
      location,
      businessType,
      services,
      pricing,
      contact,
      photos,
      CoverImage
    } = req.body;

    console.log('Vendor registration request:', { 
      name, email, phone, businessName, businessType, location 
    });

    // Validate required fields
    if (!name || !email || !phone || !password || !businessName || !description || !location || !businessType) {
      return res
        .status(400)
        .json({ 
          success: false, 
          message: "Please fill in all required fields",
          missing: {
            name: !name,
            email: !email,
            phone: !phone,
            password: !password,
            businessName: !businessName,
            description: !description,
            location: !location,
            businessType: !businessType
          }
        });
    }

    // Check if vendor already exists
    const existingVendor = await VendorList.findOne({ 
      $or: [{ email }, { 'contact.phone': phone }] 
    });
    if (existingVendor) {
      return res
        .status(400)
        .json({ success: false, message: "A vendor with this email or phone number already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new vendor with comprehensive data
    const newVendor = new VendorList({
      name: businessName, // Use business name as the main name
      email,
      password: hashedPassword,
      location,
      type: businessType.toLowerCase(), // Store as lowercase for consistency
      CoverImage: CoverImage || (photos && photos.length > 0 ? photos[0] : ""),
      rating: "0.0",
      reviews: 0,
      averageRating: 0,
      pricing: pricing || { package: "Standard Package", price: "Contact for pricing" },
      contact: {
        phone: contact?.phone || phone,
        email: contact?.email || email,
        website: contact?.website || ""
      },
      photos: photos || [],
      description,
      services: services || [],
      businessDetails: {
        address: location,
        experience: "",
        teamSize: "",
        languages: [],
        specializations: []
      },
      businessHours: {},
      socialMedia: {},
      status: "pending",
      submittedAt: new Date(),
      approvedAt: null,
      approvedBy: null
    });

    await newVendor.save();

    console.log('Vendor created successfully:', newVendor._id);

    const data = {
      email: newVendor.email,
      id: newVendor._id
    };

    // Generate token
    const token = generateAccessToken(data);

    res.status(201)
    .cookie("vendorToken", token, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })
    .json({
      success: true,
      message: "Registration submitted successfully! Please wait for admin approval.",
      vendor: {
        id: newVendor._id,
        name: newVendor.name,
        email: newVendor.email,
        status: newVendor.status
      },
    });
  } catch (error) {
    console.error('Vendor registration error:', error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// Login controller
export const loginVendor = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    console.log('Vendor login attempt:', { identifier });

    // Validate required fields
    if (!identifier || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Email/phone and password are required" });
    }

    // Find vendor by email or phone
    const vendor = await VendorList.findOne({
      $or: [{ email: identifier }, { 'contact.phone': identifier }],
    });
    
    if (!vendor) {
      return res
        .status(404)
        .json({ success: false, message: "Vendor not found" });
    }

    // Check if vendor is approved
    if (vendor.status !== "approved") {
      return res
        .status(403)
        .json({ 
          success: false, 
          message: "Your account is pending approval. Please wait for admin approval." 
        });
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
      role: "vendor"
    };
    const token = generateAccessToken(data);

    console.log('Vendor login successful:', vendor._id);

    res.status(200)
    .cookie("vendorToken", token, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })
    .json({
      success: true,
      message: "Login successful",
      vendor: {
        id: vendor._id,
        name: vendor.name,
        email: vendor.email,
        phone: vendor.contact?.phone,
        status: vendor.status,
        type: vendor.type
      },
    });
  } catch (error) {
    console.error('Vendor login error:', error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
