import crypto from 'crypto';
import { Prisma } from '@prisma/client';

import { prisma } from '../../config/prisma';
import type { ReportIssueInput } from './support.schema';

export interface IssueTicketResponse {
  id: string;
  ticketCode: string;
  userId: string;
  issueType: string;
  urgency: string;
  briefDescription: string;
  details: string;
  status: string;
  createdAt: Date;
}

export interface ReportIssueResponse {
  message: string;
  ticket: IssueTicketResponse;
}

export interface TicketSummary {
  id: string;
  ticketCode: string;
  issueType: string;
  urgency: string;
  briefDescription: string;
  status: string;
  createdAt: Date;
}

export interface MyTicketsResponse {
  tickets: TicketSummary[];
}

function generateTicketCode(): string {
  return `RACE-${crypto.randomInt(100000, 1000000)}`;
}

/**
 * Creates a support issue report for the authenticated user, retrying on rare ticketCode collisions.
 */
export async function createIssueReport(
  input: ReportIssueInput,
  userId: string
): Promise<ReportIssueResponse> {
  const maxAttempts = 5;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const ticket = await prisma.issueReport.create({
        data: {
          ticketCode: generateTicketCode(),
          userId,
          issueType: input.issueType,
          urgency: input.urgency,
          briefDescription: input.briefDescription,
          details: input.details,
          deviceId: input.deviceId ?? null,
        },
        select: {
          id: true,
          ticketCode: true,
          userId: true,
          issueType: true,
          urgency: true,
          briefDescription: true,
          details: true,
          status: true,
          createdAt: true,
        },
      });

      return {
        message: 'Issue report submitted successfully',
        ticket,
      };
    } catch (error) {
      const isTicketCodeCollision =
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002';

      if (!isTicketCodeCollision || attempt === maxAttempts) {
        throw error;
      }
    }
  }

  throw new Error('Failed to generate unique ticket code');
}

/**
 * Fetches all support issue tickets submitted by the authenticated user, newest first.
 */
export async function getUserTickets(userId: string): Promise<MyTicketsResponse> {
  const tickets = await prisma.issueReport.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      ticketCode: true,
      issueType: true,
      urgency: true,
      briefDescription: true,
      status: true,
      createdAt: true,
    },
  });

  return { tickets };
}
