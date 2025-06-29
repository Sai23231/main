import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import Admin from '../models/Admin.model.js';
import VendorList from '../models/vendor.model.js';
import Venue from '../models/Venue.model.js';

export const verifyToken = async (req, res, next) => {
  try {
    // Check for different token types
    const userToken = req.cookies.token;
    const adminToken = req.cookies.adminToken;
    const vendorToken = req.cookies.vendorToken;
    
    let token = userToken || adminToken || vendorToken;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided."
      });
    }

    // Verify token
    const jwtSecret = process.env.ACCESS_TOKEN_SECRET || "fallback-secret";
    const decoded = jwt.verify(token, jwtSecret);

    // Set user ID and role based on token type
    req.id = decoded.id || decoded.userId;
    req.role = decoded.role;

    // Verify user exists based on role
    if (decoded.role === 'admin') {
      const admin = await Admin.findById(req.id);
      if (!admin) {
        return res.status(401).json({
          success: false,
          message: "Invalid admin token"
        });
      }
    } else if (decoded.role === 'vendor') {
      const vendor = await VendorList.findById(req.id);
      if (!vendor) {
        return res.status(401).json({
          success: false,
          message: "Invalid vendor token"
        });
      }
    } else {
      // Regular user
      const user = await User.findById(req.id);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid user token"
        });
      }
    }

    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({
      success: false,
      message: "Invalid token"
    });
  }
};

// Middleware to verify admin role specifically
export const verifyAdmin = async (req, res, next) => {
  try {
    const adminToken = req.cookies.adminToken;
    
    if (!adminToken) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Admin token required."
      });
    }

    const jwtSecret = process.env.ACCESS_TOKEN_SECRET || "fallback-secret";
    const decoded = jwt.verify(adminToken, jwtSecret);

    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Admin role required."
      });
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin token"
      });
    }

    req.id = decoded.id;
    req.role = 'admin';
    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    return res.status(401).json({
      success: false,
      message: "Invalid admin token"
    });
  }
};

// Middleware to verify vendor role specifically
export const verifyVendor = async (req, res, next) => {
  try {
    const vendorToken = req.cookies.vendorToken;
    
    if (!vendorToken) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Vendor token required."
      });
    }

    const jwtSecret = process.env.ACCESS_TOKEN_SECRET || "fallback-secret";
    const decoded = jwt.verify(vendorToken, jwtSecret);

    if (decoded.role !== 'vendor') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Vendor role required."
      });
    }

    const vendor = await VendorList.findById(decoded.id);
    if (!vendor) {
      return res.status(401).json({
        success: false,
        message: "Invalid vendor token"
      });
    }

    // Allow both approved and pending vendors to access portfolio features
    // Only reject rejected vendors
    if (vendor.status === "rejected") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Vendor account has been rejected."
      });
    }

    req.id = decoded.id;
    req.role = 'vendor';
    next();
  } catch (error) {
    console.error('Vendor verification error:', error);
    return res.status(401).json({
      success: false,
      message: "Invalid vendor token"
    });
  }
};

// Middleware to verify venue role specifically
export const verifyVenue = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token required."
      });
    }

    const jwtSecret = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET || "fallback-secret";
    const decoded = jwt.verify(token, jwtSecret);

    if (decoded.role !== 'venue') {
      return res.status(403).json({
        success: false,
        message: "Access denied. Venue role required."
      });
    }

    const venue = await Venue.findById(decoded.id);
    if (!venue) {
      return res.status(401).json({
        success: false,
        message: "Invalid venue token"
      });
    }

    // Allow both approved and pending venues to access features
    // Only reject rejected venues
    if (venue.status === "rejected") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Venue account has been rejected."
      });
    }

    req.id = decoded.id;
    req.role = 'venue';
    next();
  } catch (error) {
    console.error('Venue verification error:', error);
    return res.status(401).json({
      success: false,
      message: "Invalid venue token"
    });
  }
};