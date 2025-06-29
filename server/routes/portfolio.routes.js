import express from 'express';
import { 
  uploadPortfolioImages, 
  removePortfolioImage, 
  getPortfolio, 
  moderatePortfolioImage, 
  getPendingPortfolioImages 
} from '../controllers/portfolio.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { verifyVendor } from '../middleware/verifyVendor.js';
import { verifyVenue } from '../middleware/verifyVenue.js';
import { verifyAdmin } from '../middleware/verifyAdmin.js';
import { upload } from '../middleware/multerConfig.js';

const router = express.Router();

// Vendor portfolio routes
router.post('/vendor/portfolio/upload', 
  verifyToken, 
  verifyVendor, 
  upload.array('images', 10), 
  uploadPortfolioImages
);
router.delete('/vendor/portfolio/:imageId', 
  verifyToken, 
  verifyVendor, 
  removePortfolioImage
);
router.get('/vendor/portfolio', 
  verifyToken, 
  verifyVendor, 
  getPortfolio
);

// Venue portfolio routes
router.post('/venue/portfolio/upload', 
  verifyToken, 
  verifyVenue, 
  upload.array('images', 10), 
  uploadPortfolioImages
);
router.delete('/venue/portfolio/:imageId', 
  verifyToken, 
  verifyVenue, 
  removePortfolioImage
);
router.get('/venue/portfolio', 
  verifyToken, 
  verifyVenue, 
  getPortfolio
);

// Admin portfolio moderation routes
router.get('/admin/portfolio/pending', 
  verifyToken, 
  verifyAdmin, 
  getPendingPortfolioImages
);
router.put('/admin/portfolio/:userId/:imageId', 
  verifyToken, 
  verifyAdmin, 
  moderatePortfolioImage
);

export default router; 