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
} from "../controllers/proposal.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const router = Router();

router.get('/',verifyToken, getAllProposals);
router.post('/create', verifyToken, createProposal);
router.get('/event/:eventId', verifyToken, getProposalsByEvent); //Event Dashboard - Get all proposals for a specific event
router.get('/sponsor/:sponsorId', verifyToken, getProposalsBySponsor); //Event Dashboard - Get all proposals made by a specific sponsor
router.get('/sponsorProposals', verifyToken, getAllUserProposals); //User Dashboard - Get all proposals made by the logged-in sponsor
router.get('/status/:status', verifyToken, getAllProposalsByStatus); //Admin Dashboard - Get all proposals by status (Pending, Approved, Rejected)

router
  .get('/:proposalId', verifyToken, getProposalById)
  .put('/:proposalId', verifyToken, updateProposalStatus)
  .delete('/:proposalId', verifyToken, deleteProposal);

export default router;