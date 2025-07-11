import express from 'express';
import {
  getProviders
} from '../../server/controllers/providerController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.get('/', asyncHandler(getProviders));

export default router;
