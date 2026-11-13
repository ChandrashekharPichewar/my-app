import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../utils/app-error';
import { verifyAccessToken } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}

function extractBearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return null;
  }
  const token = header.slice(7).trim();
  return token || null;
}

export function requireAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = extractBearerToken(req);
  if (!token) {
    return next(new AppError('Authorization Bearer token is required.', 401));
  }

  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.sub;
    req.userEmail = payload.email;
    return next();
  } catch {
    return next(new AppError('Invalid or expired access token.', 401));
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  const token = extractBearerToken(req);
  if (!token) {
    return next();
  }

  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.sub;
    req.userEmail = payload.email;
  } catch {
    // Ignore invalid optional tokens so pre-auth device registration still succeeds.
  }

  return next();
}

