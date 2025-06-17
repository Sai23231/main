import { Router } from "express";
import {
  createVolunteer,
  deleteVolunteer,
  getAllVolunteers,
  getUserVolunteerInfoById,
  getVolunteerById,
  getVolunteersByAvailability,
  getVolunteersByInterest,
  updateVolunteer,
} from "../controllers/volunteer.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const router = Router();

router.get('/',getAllVolunteers);
//  User Dashboard
router.post('/create',verifyToken,createVolunteer); // Create a new volunteer profile (requires login)
router.get('/userVolunteerInfo',verifyToken,getUserVolunteerInfoById)  // Get the logged-in user's volunteer profile
      .put('/userVolunteerInfo', verifyToken, updateVolunteer) // Update the logged-in user's volunteer profile
      .delete('/userVolunteerInfo', verifyToken, deleteVolunteer); // Delete the logged-in user's volunteer profile

// Event Dashboard
router.get('/interests/:interest',verifyToken,getVolunteersByInterest); // Get volunteers by interest 
router.get('/availability/:availability',verifyToken,getVolunteersByAvailability); // Get volunteers by availability

router.get('/:volunteerId',verifyToken,getVolunteerById); // Get a specific volunteer by ID

export default router;