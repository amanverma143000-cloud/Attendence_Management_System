import { Router } from 'express';
import { z } from 'zod';
import {
  requestOvertime, getMyOvertime, getAllOvertime, reviewOvertime,
} from '../controllers/overtimeController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';

const router = Router();

const requestSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hours: z.number().positive(),
  reason: z.string().min(5),
  attendance: z.string().optional(),
});

const reviewSchema = z.object({
  status: z.enum(['Approved', 'Rejected']),
  reviewRemarks: z.string().optional(),
});

router.use(protect);

router.post('/', validate(requestSchema), requestOvertime);
router.get('/my', getMyOvertime);
router.get('/all', authorize('Manager', 'Admin'), getAllOvertime);
router.patch('/:id/review', authorize('Manager', 'Admin'), validate(reviewSchema), reviewOvertime);

export default router;
