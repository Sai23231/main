import express from "express";
import {
    getAllVendors,
    getVendorById,
    getVendorByIdOnly,
    getVendorProfile,
    updateVendorProfile,
    createVendor,
    getMultipleVendorsById,
    claimVendor,
    vendorLogin,
    vendorLogout,
    checkVendorAuth,
    uploadVendorImage,
    uploadPortfolioImages,
    removePortfolioImage
} from "../controllers/vendor.controller.js";
import { upload } from "../middleware/multerConfig.js"
import { verifyToken, verifyVendor } from "../middleware/verifyToken.js";

const router = express.Router();

// Public routes
router.post("/register", createVendor);
router.post("/login", vendorLogin);
router.post("/logout", vendorLogout);
router.post("/claim", claimVendor);

// Protected routes (require vendor authentication)
// Vendor profile management (protected)
router.get("/profile", verifyVendor, getVendorProfile);
router.put("/profile", verifyVendor, updateVendorProfile);
router.get("/check-auth", verifyVendor, checkVendorAuth);
router.post("/upload-image", verifyVendor, upload.single('image'), uploadVendorImage);

// Portfolio management routes
router.post("/upload-portfolio", verifyVendor, upload.array('images', 10), uploadPortfolioImages);
router.delete("/remove-portfolio-image", verifyVendor, removePortfolioImage);

// Vendor data routes (public)
router.get("/id/:vendorId", getVendorByIdOnly);
router.get("/:type", getAllVendors);
router.get("/:type/:vendorId", getVendorById);
router.post("/:type/multiple", getMultipleVendorsById);

export default router;