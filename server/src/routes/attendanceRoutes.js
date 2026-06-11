import { Router } from 'express';
import { z } from 'zod';
import {
  punchIn, punchOut, getMyAttendance, getTodayAttendance,
  getAllAttendance, getAttendanceById, validateAttendance,
} from '../controllers/attendanceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
import { validate } from '../middleware/validateMiddleware.js';

const router = Router();

const locationSchema = z
  .object({ latitude: z.number(), longitude: z.number() })
  .optional()
  .nullable();

const punchSchema = z.object({
  image: z.string().min(1, 'Selfie image is required'),
  location: locationSchema,
});

const validateSchema = z.object({
  validationStatus: z.enum(['Valid', 'Invalid']),
  remarks: z.string().optional(),
});

router.use(protect);

router.post('/punch-in', validate(punchSchema), punchIn);
router.post('/punch-out', validate(punchSchema), punchOut);
router.get('/my', getMyAttendance);
router.get('/today', getTodayAttendance);
router.get('/all', authorize('Manager', 'Admin'), getAllAttendance);
router.get('/:id', authorize('Manager', 'Admin'), getAttendanceById);
router.patch('/:id/validate', authorize('Manager', 'Admin'), validate(validateSchema), validateAttendance);

export default router;
