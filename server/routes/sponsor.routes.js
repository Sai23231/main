import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
    createSponsor,
    deleteSponsor,
    getAllSponsors,
    getSponsorById,
    getSponsorInfoById,
    getSponsorsByBudget,
    getSponsorsByIndustry,
    updateSponsor,
} from "../controllers/sponsor.controller.js";

const router = Router();

router.get('/', getAllSponsors);
router.post('/create', verifyToken, createSponsor);
router.get('/industry/:industry', verifyToken, getSponsorsByIndustry);
router.get('/budget/:budget', verifyToken, getSponsorsByBudget);

router
.get('/sponsorInfo', verifyToken, getSponsorInfoById) // For User Dashboard
.put('/sponsorInfo', verifyToken, updateSponsor)  // For User Dashboard
.delete('/sponsorInfo', verifyToken, deleteSponsor) // For User Dashboard

router.get('/:id', verifyToken, getSponsorById); // For Event Dashboard

export default router;