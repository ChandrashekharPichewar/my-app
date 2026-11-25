import type { Request, Response } from 'express';

import { AppError } from '../../utils/app-error';
import type { ReportIssueInput } from './support.schema';
import { createIssueReport, getUserTickets } from './support.service';

export async function reportIssueController(req: Request, res: Response): Promise<void> {
  if (!req.userId) {
    throw new AppError('Unauthorized. Valid access token is required.', 401);
  }

  const result = await createIssueReport(req.body as ReportIssueInput, req.userId);
  res.status(201).json(result);
}

export async function getMyTicketsController(req: Request, res: Response): Promise<void> {
  if (!req.userId) {
    throw new AppError('Unauthorized. Valid access token is required.', 401);
  }

  const result = await getUserTickets(req.userId);
  res.status(200).json(result);
}
