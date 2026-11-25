import { Router } from 'express';

import { requireAuth } from '../../middlewares/auth.middleware';
import { validateBody } from '../../middlewares/validate.middleware';
import { asyncHandler } from '../../utils/async-handler';
import { getMyTicketsController, reportIssueController } from './support.controller';
import { reportIssueSchema } from './support.schema';

const supportRouter = Router();

supportRouter.post(
  '/report-issue',
  requireAuth,
  validateBody(reportIssueSchema),
  asyncHandler(reportIssueController)
);

supportRouter.get('/my-tickets', requireAuth, asyncHandler(getMyTicketsController));

export { supportRouter };
