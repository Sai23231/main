import express from "express";
import {
    getVenues, 
    getVenueReviews,
    addReview,
    addVenue,
    getVenueDetails
} from "../controllers/venue.controller.js";
import { upload } from "../middleware/multerConfig.js"

const router = express.Router();

router.get("/", getVenues);
router.get("/venuereviews/:venueId", getVenueReviews);
router.post("/venuereviews/:venueId", addReview);
router.post("/create",
    upload.fields([
    { name: 'coverImgSrc', maxCount: 1 },
    { name: 'photos', maxCount: 10 }
    ]),
    addVenue);
router.get("/venueDetails/:venueId", getVenueDetails);

export default router;
