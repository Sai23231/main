import { Router } from "express";
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getAllUserEvents,
  getEventById,
  getEventsByOrganizer,
  getEventsByType,
  updateEvent,
} from "../controllers/event.controller.js";
import verifyToken from "../middleware/verifyToken.js";
import { upload } from "../middleware/multerConfig.js";

const router = Router();

router.get('/', getAllEvents);
router.get('/type/:eventType',verifyToken,getEventsByType); 
router.get('/organizer/:organizerName',verifyToken,getEventsByOrganizer);  // For Event Dashboard
router.get('/organizerEvents',verifyToken, getAllUserEvents); // For User Dashboard

router.post('/create', 
  verifyToken, 
  upload.fields([
    { name: 'CoverImage', maxCount: 1 },
    { name: 'EventPdf', maxCount: 1 }
  ]), 
createEvent);

router
  .get('/:eventId',verifyToken,getEventById)
  .put('/:eventId',
    verifyToken,
    upload.fields([
    { name: 'CoverImage', maxCount: 1 },
    { name: 'EventPdf', maxCount: 1 }
    ]), 
  updateEvent)
  .delete('/:eventId',verifyToken,deleteEvent);

export default router;