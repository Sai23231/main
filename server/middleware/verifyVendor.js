import Vendor from "../models/Vendor.model.js";

export const verifyVendor = async (req, res, next) => {
  try {
    const userId = req.id; // From verifyToken middleware
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // Check if user is a vendor
    const vendor = await Vendor.findById(userId);
    if (!vendor) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Vendor account required."
      });
    }

    // Check if vendor is approved or pending (allow pending for testing)
    if (vendor.status === 'rejected') {
      return res.status(403).json({
        success: false,
        message: "Your vendor account has been rejected. Please contact support."
      });
    }

    // Add vendor info to request
    req.vendor = vendor;
    next();
  } catch (error) {
    console.error('Error in verifyVendor middleware:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}; 