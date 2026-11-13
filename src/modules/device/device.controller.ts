import type { Request, Response } from 'express';

import type { SaveDeviceInput } from './device.schema';
import { saveDeviceToken } from './device.service';

export async function saveDeviceController(req: Request, res: Response): Promise<void> {
  const result = await saveDeviceToken(req.body as SaveDeviceInput, req.userId);
  res.status(200).json(result);
}

