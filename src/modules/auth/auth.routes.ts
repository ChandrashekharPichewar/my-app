import { Router } from 'express';

import { authRateLimiter } from '../../middlewares/rate-limit.middleware';
import { validateBody } from '../../middlewares/validate.middleware';
import { asyncHandler } from '../../utils/async-handler';
import {
  loginController,
  refreshTokenController,
  signupController,
} from './auth.controller';
import { loginSchema, refreshTokenSchema, signupSchema } from './auth.schema';

const authRouter = Router();

authRouter.use(authRateLimiter);

authRouter.post('/signup', validateBody(signupSchema), asyncHandler(signupController));
authRouter.post('/login', validateBody(loginSchema), asyncHandler(loginController));
authRouter.post('/refresh', validateBody(refreshTokenSchema), asyncHandler(refreshTokenController));

export { authRouter };

