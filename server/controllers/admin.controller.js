import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from "../models/Admin.model.js";
import VendorList from "../models/vendor.model.js";

// Admin Registration
export const adminRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Admin with this email already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword
    });

    return res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });

  } catch (error) {
    console.error("Admin registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: "admin" },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" }
    );

    // Set cookie
    res.cookie("adminToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });

  } catch (error) {
    console.error("Admin login error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get admin profile
export const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.id;
    
    const admin = await Admin.findById(adminId).select('-password');
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    return res.status(200).json({
      success: true,
      admin
    });

  } catch (error) {
    console.error("Get admin profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Update admin profile
export const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.id;
    const { name, email } = req.body;

    const admin = await Admin.findByIdAndUpdate(
      adminId,
      { name, email },
      { new: true, runValidators: true }
    ).select('-password');

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      admin
    });

  } catch (error) {
    console.error("Update admin profile error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// Get all pending vendor registrations
export const getPendingVendors = async (req, res) => {
  try {
    const pendingVendors = await VendorList.find({ status: "pending" })
      .select('-password')
      .sort({ submittedAt: -1 });

    res.status(200).json({
      success: true,
      vendors: pendingVendors
    });
  } catch (error) {
    console.error("Error fetching pending vendors:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending vendors"
    });
  }
};

// Approve vendor registration
export const approveVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const adminId = req.id; // From auth middleware

    console.log('Approving vendor:', vendorId, 'by admin:', adminId);

    if (!vendorId) {
      return res.status(400).json({
        success: false,
        message: "Vendor ID is required"
      });
    }

    const vendor = await VendorList.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    console.log('Current vendor status:', vendor.status);

    if (vendor.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Vendor is not in pending status. Current status: ${vendor.status}`
      });
    }

    // Update vendor status
    vendor.status = "approved";
    vendor.approvedAt = new Date();
    vendor.approvedBy = adminId;
    
    // Save the updated vendor
    const updatedVendor = await vendor.save();
    
    console.log('Vendor approved successfully:', updatedVendor._id);

    res.status(200).json({
      success: true,
      message: "Vendor approved successfully",
      vendor: {
        id: updatedVendor._id,
        name: updatedVendor.name,
        email: updatedVendor.email,
        status: updatedVendor.status,
        approvedAt: updatedVendor.approvedAt
      }
    });
  } catch (error) {
    console.error("Error approving vendor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to approve vendor",
      error: error.message
    });
  }
};

// Reject vendor registration
export const rejectVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { reason } = req.body;
    const adminId = req.id;

    console.log('Rejecting vendor:', vendorId, 'by admin:', adminId, 'reason:', reason);

    if (!vendorId) {
      return res.status(400).json({
        success: false,
        message: "Vendor ID is required"
      });
    }

    if (!reason || reason.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Rejection reason is required"
      });
    }

    const vendor = await VendorList.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    console.log('Current vendor status:', vendor.status);

    if (vendor.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Vendor is not in pending status. Current status: ${vendor.status}`
      });
    }

    // Update vendor status
    vendor.status = "rejected";
    vendor.rejectedAt = new Date();
    vendor.rejectedBy = adminId;
    vendor.rejectionReason = reason.trim();
    
    // Save the updated vendor
    const updatedVendor = await vendor.save();
    
    console.log('Vendor rejected successfully:', updatedVendor._id);

    res.status(200).json({
      success: true,
      message: "Vendor rejected successfully",
      vendor: {
        id: updatedVendor._id,
        name: updatedVendor.name,
        email: updatedVendor.email,
        status: updatedVendor.status,
        rejectedAt: updatedVendor.rejectedAt,
        rejectionReason: updatedVendor.rejectionReason
      }
    });
  } catch (error) {
    console.error("Error rejecting vendor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to reject vendor",
      error: error.message
    });
  }
};

// Get all vendors with status filter
export const getAllVendors = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const vendors = await VendorList.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await VendorList.countDocuments(query);

    res.status(200).json({
      success: true,
      vendors,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error("Error fetching vendors:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch vendors"
    });
  }
};

// Add vendor manually (admin function)
export const addVendor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      location,
      type,
      description,
      services,
      pricing,
      contact,
      photos
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !location || !type || !description) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields"
      });
    }

    // Check if vendor already exists
    const existingVendor = await VendorList.findOne({
      $or: [{ email }, { 'contact.phone': phone }]
    });

    if (existingVendor) {
      return res.status(400).json({
        success: false,
        message: "A vendor with this email or phone number already exists"
      });
    }

    // Generate a default password
    const defaultPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const newVendor = await VendorList.create({
      name,
      email,
      password: hashedPassword,
      location,
      type,
      pricing: pricing || { package: "Standard Package", price: "Contact for pricing" },
      contact: {
        phone: contact?.phone || phone,
        email: contact?.email || email
      },
      photos: photos || [],
      description,
      services: services || [],
      averageRating: 0,
      status: "approved",
      approvedAt: new Date(),
      approvedBy: req.id,
      addedByAdmin: true
    });

    res.status(201).json({
      success: true,
      message: "Vendor added successfully",
      vendor: {
        id: newVendor._id,
        name: newVendor.name,
        email: newVendor.email,
        password: defaultPassword // Return the generated password
      }
    });
  } catch (error) {
    console.error("Error adding vendor:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add vendor"
    });
  }
};

// Admin Logout
export const adminLogout = async (req, res) => {
  try {
    // Clear the admin token cookie
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    return res.status(200).json({
      success: true,
      message: "Admin logged out successfully"
    });

  } catch (error) {
    console.error("Admin logout error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}; 