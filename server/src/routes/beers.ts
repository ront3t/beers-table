import express from 'express';
import { getBeersByType } from '../controllers/beers';

const router = express.Router();

// Route to get a beer by type
router.get('/beers/:type', getBeersByType);

export default router;
// This file defines the routes for the beers API.