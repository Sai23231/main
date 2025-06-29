import express from 'express';
import { 
  submitRequest, 
  getAllRequests, 
  handleRequest, 
  getUserRequests, 
  deleteRequest 
} from '../controllers/updateRequest.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { verifyVendor } from '../middleware/verifyVendor.js';
import { verifyVenue } from '../middleware/verifyVenue.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';

const router = express.Router();

// Vendor routes
router.post('/vendor/update-request', verifyToken, verifyVendor, submitRequest);
router.get('/vendor/update-requests', verifyToken, verifyVendor, getUserRequests);
router.delete('/vendor/update-request/:id', verifyToken, verifyVendor, deleteRequest);

// Venue routes
router.post('/venue/update-request', verifyToken, verifyVenue, submitRequest);
router.get('/venue/update-requests', verifyToken, verifyVenue, getUserRequests);
router.delete('/venue/update-request/:id', verifyToken, verifyVenue, deleteRequest);

// Admin routes
router.get('/admin/update-requests', verifyToken, verifyAdmin, getAllRequests);
router.put('/admin/update-requests/:id', verifyToken, verifyAdmin, handleRequest);

export default router; 