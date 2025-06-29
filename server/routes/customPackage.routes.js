import express from 'express';
import { createCustomPackage, getUserPackages } from '../controllers/customPackage.controller.js';
const router = express.Router();

router.post('/', createCustomPackage);
router.get('/user/:userId', getUserPackages);

export default router; 