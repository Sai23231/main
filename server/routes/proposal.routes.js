import { Router } from "express";
import {
    createProposal,
    deleteProposal,
    getAllProposals,
    getAllUserProposals,
    getProposalById,
    getProposalsByEvent,
    getProposalsBySponsor,
    getAllProposalsByStatus,
    updateProposalStatus,
    respondToProposal,
} from "../controllers/proposal.controller.js";
import { verifyToken, verifyAdmin } from "../middleware/verifyToken.js";

const router = Router();

// Admin routes (require admin authentication)
router.get('/', verifyAdmin, getAllProposals);
router.get('/status/:status', verifyAdmin, getAllProposalsByStatus); // Admin Dashboard - Get all proposals by status (Pending, Approved, Rejected)

// User routes (require user authentication)
router.post('/create', verifyToken, createProposal);
router.get('/event/:eventId', verifyToken, getProposalsByEvent); //Event Dashboard - Get all proposals for a specific event
router.get('/sponsor/:sponsorId', verifyToken, getProposalsBySponsor); //Event Dashboard - Get all proposals made by a specific sponsor
router.get('/sponsorProposals', verifyToken, getAllUserProposals); //User Dashboard - Get all proposals made by the logged-in sponsor

router
  .get('/:proposalId', verifyToken, getProposalById)
  .put('/:proposalId', verifyAdmin, updateProposalStatus) // Admin can update status
  .delete('/:proposalId', verifyToken, deleteProposal);

// New route for sponsor responses
router.put('/:proposalId/respond', verifyToken, respondToProposal);

export default router;