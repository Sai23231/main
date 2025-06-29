import express from 'express';
import {
    addVenueReview,
    addVendorReview,
    getVenueReviewsById,
    getVendorReviewsById
} from '../controllers/review.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();
router.post("/addVenueReview/:venueId", verifyToken, addVenueReview);

router.post("/addVendorReview/:vendorId", verifyToken, addVendorReview);

router.get("/getVenueReviewsById/:venueId", getVenueReviewsById);

router.get("/getVendorReviewsById/:vendorId", getVendorReviewsById);

export default router;