import { Router } from "express";
import {
    createVendor,
    getAllVendors,
    getMultipleVendorsById,
    getVendorById
} from "../controllers/vendor.controller.js";
import { upload } from "../middleware/multerConfig.js"

const router = Router();

router.get('/multipleVendors/:type', getMultipleVendorsById);
router.get('/:type',getAllVendors);
router.get('/:type/:vendorId', getVendorById);
router.post('/create', 
    upload.fields([
        { name: 'CoverImage', maxCount: 1 },
        { name: 'photos', maxCount: 10 }
        ]),
    createVendor);

export default router;