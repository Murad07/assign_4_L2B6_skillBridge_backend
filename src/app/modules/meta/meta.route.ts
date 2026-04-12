import express from 'express';
import { MetaController } from './meta.controller.js';

const router = express.Router();

router.get('/public-stats', MetaController.getPublicStats);

export const MetaRoutes = router;
