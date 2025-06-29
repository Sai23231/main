import Venue from "../models/Venue.model.js";

export const verifyVenue = async (req, res, next) => {
  try {
    const userId = req.id; // From verifyToken middleware
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    // Check if user is a venue
    const venue = await Venue.findById(userId);
    if (!venue) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Venue account required."
      });
    }

    // Check if venue is approved or pending (allow pending for testing)
    if (venue.status === 'rejected') {
      return res.status(403).json({
        success: false,
        message: "Your venue account has been rejected. Please contact support."
      });
    }

    // Add venue info to request
    req.venue = venue;
    next();
  } catch (error) {
    console.error('Error in verifyVenue middleware:', error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
}; 