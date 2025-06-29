import Admin from "../models/Admin.model.js";

export const verifyAdmin = async (req, res, next) => {
  try {
    const userId = req.id; // Set by verifyToken
    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }
    const admin = await Admin.findById(userId);
    if (!admin) {
      return res.status(403).json({ success: false, message: "Admin access required" });
    }
    req.admin = admin;
    next();
  } catch (error) {
    console.error("Error in verifyAdmin middleware:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}; 