import type { Request, Response } from 'express';

import type { LoginInput, RefreshTokenInput, SignupInput } from './auth.schema';
import { loginUser, rotateRefreshToken, signupUser } from './auth.service';

export async function signupController(req: Request, res: Response): Promise<void> {
  const result = await signupUser(req.body as SignupInput);
  res.status(201).json(result);
}

export async function loginController(req: Request, res: Response): Promise<void> {
  const result = await loginUser(req.body as LoginInput);
  res.status(200).json(result);
}

export async function refreshTokenController(req: Request, res: Response): Promise<void> {
  const { refreshToken } = req.body as RefreshTokenInput;
  const result = await rotateRefreshToken(refreshToken);
  res.status(200).json(result);
}

