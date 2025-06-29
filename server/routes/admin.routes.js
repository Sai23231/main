import express from 'express';
import {
  adminRegister,
  adminLogin,
  adminLogout,
  getAdminProfile,
  updateAdminProfile,
  getPendingVendors,
  approveVendor,
  rejectVendor,
  getAllVendors,
  addVendor
} from '../controllers/admin.controller.js';
import { verifyAdmin } from '../middleware/verifyToken.js';

const router = express.Router();

// Admin authentication routes
router.post('/register', adminRegister);
router.post('/login', adminLogin);
router.post('/logout', adminLogout);

// Protected admin routes - use verifyAdmin for better security
router.use(verifyAdmin);

// Admin profile routes
router.get('/profile', getAdminProfile);
router.put('/profile', updateAdminProfile);

// Vendor management routes
router.get('/vendors/pending', getPendingVendors);
router.get('/vendors', getAllVendors);
router.post('/vendors/approve/:vendorId', approveVendor);
router.post('/vendors/reject/:vendorId', rejectVendor);
router.post('/vendors/add', addVendor);

export default router; 