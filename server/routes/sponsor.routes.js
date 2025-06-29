import { Router } from "express";
import { verifyToken, verifyAdmin } from "../middleware/verifyToken.js";
import {
    createSponsor,
    deleteSponsor,
    getAllSponsors,
    getActiveSponsors,
    getSponsorById,
    getSponsorInfoById,
    getSponsorsByBudget,
    getSponsorsByIndustry,
    updateSponsor,
    getSponsorStats,
    processPayment,
    getAllPayments
} from "../controllers/sponsor.controller.js";

const router = Router();

// Public routes (no authentication needed)
router.get('/active', getActiveSponsors); // For event organizers to see active sponsors

// Admin routes (require admin authentication)
router.get('/', verifyAdmin, getAllSponsors); // Admin: Get all sponsors
router.get('/admin/all', verifyAdmin, getAllSponsors); // Admin: Get all sponsors (alternative route)
router.post('/create', verifyAdmin, createSponsor); // Admin: Create sponsor
router.get('/stats', verifyAdmin, getSponsorStats); // Admin: Get sponsor statistics
router.get('/payments', verifyAdmin, getAllPayments); // Admin: Get all payments
router.post('/payment/process', verifyAdmin, processPayment); // Admin: Process payment

// Filter routes
router.get('/industry/:industry', getSponsorsByIndustry); // Public: Get sponsors by industry
router.get('/budget/:budget', verifyAdmin, getSponsorsByBudget); // Admin: Get sponsors by budget

// Individual sponsor routes
router.get('/:id', verifyAdmin, getSponsorById); // Admin: Get sponsor by ID
router.put('/:id', verifyAdmin, updateSponsor); // Admin: Update sponsor
router.delete('/:id', verifyAdmin, deleteSponsor); // Admin: Delete sponsor

// Legacy routes (for backward compatibility)
router.get('/sponsorInfo', verifyToken, getSponsorInfoById); // For User Dashboard

export default router;