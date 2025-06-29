import express from "express";
import {
    getVenues, 
    getVenueReviews,
    addReview,
    addVenue,
    getVenueDetails,
    getVenueProfile,
    updateVenueProfile,
    uploadVenueImage,
    uploadVenuePortfolio,
    removeVenuePortfolioImage,
    venueLogin,
    venueLogout,
    checkVenueAuth
} from "../controllers/venue.controller.js";
import { upload, handleMulterError } from "../middleware/multerConfig.js"
import { verifyToken, verifyVenue } from "../middleware/verifyToken.js";

const router = express.Router();

// Public routes
router.get("/", getVenues);
router.get("/venuereviews/:venueId", getVenueReviews);
router.post("/venuereviews/:venueId", addReview);
router.post("/create",
    upload.fields([
    { name: 'coverImgSrc', maxCount: 1 },
    { name: 'photos', maxCount: 10 }
    ]),
    handleMulterError,
    addVenue);
router.get("/venueDetails/:venueId", getVenueDetails);

// Venue authentication routes
router.post("/login", venueLogin);
router.post("/logout", venueLogout);

// Protected venue routes (require venue authentication)
router.get("/profile", verifyVenue, getVenueProfile);
router.put("/profile", verifyVenue, updateVenueProfile);
router.get("/check-auth", verifyVenue, checkVenueAuth);
router.post("/upload-image", verifyVenue, upload.single('image'), uploadVenueImage);
router.post("/upload-portfolio", verifyVenue, upload.array('images', 10), uploadVenuePortfolio);
router.delete("/remove-portfolio-image", verifyVenue, removeVenuePortfolioImage);

export default router;
