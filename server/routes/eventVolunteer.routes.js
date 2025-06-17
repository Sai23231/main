import { Router } from "express";
import {
  assignVolunteerToEvent,
  getEventsByVolunteerId,
  getUserVolunteeredEvents,
  getVolunteersByEventId,
  removeVolunteerFromEvent,
  updateVolunteerRoleInEvent,
} from "../controllers/eventVolunteer.controller.js";
import verifyToken from "../middleware/verifyToken.js";

const router = Router();

router.use(verifyToken);
// Event Dashboard
router.post('/assignVolunteer', assignVolunteerToEvent)
router.get('/getVolunteersByEventId/:eventId', getVolunteersByEventId);
router.get('/getEventsByVolunteerId/:volunteerId', getEventsByVolunteerId);

// User Dashboard
router.get('/getUserVolunteeredEvents', getUserVolunteeredEvents);

// Admin or Event Dashboard
router.delete('/unassignVolunteer', removeVolunteerFromEvent);
router.put('/updateVolunteerRole', updateVolunteerRoleInEvent);

export default router;
