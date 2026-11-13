import { Router } from 'express';

import { optionalAuth } from '../../middlewares/auth.middleware';
import { validateBody } from '../../middlewares/validate.middleware';
import { asyncHandler } from '../../utils/async-handler';
import { saveDeviceController } from './device.controller';
import { saveDeviceSchema } from './device.schema';

const deviceRouter = Router();

deviceRouter.post(
  '/',
  optionalAuth,
  validateBody(saveDeviceSchema),
  asyncHandler(saveDeviceController)
);

export { deviceRouter };

