import express from 'express';
import { 
  createServiceInquiry,
  getAllServiceInquiries,
  getUserServiceInquiries,
  updateServiceInquiryStatus,
  getServiceInquiryById
} from '../controllers/serviceInquiry.controller.js';
import { verifyToken, verifyAdmin } from '../middleware/verifyToken.js';

const router = express.Router();

// Public routes
router.post('/create', createServiceInquiry);

// Protected routes (require authentication)
router.get('/user-inquiries', verifyToken, getUserServiceInquiries);
router.get('/:id', verifyToken, getServiceInquiryById);

// Admin routes (require admin authentication)
router.get('/admin/all', verifyAdmin, getAllServiceInquiries);
router.put('/admin/:id/status', verifyAdmin, updateServiceInquiryStatus);

export default router; 