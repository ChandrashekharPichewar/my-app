import { z } from 'zod';

export const reportIssueSchema = z.object({
  issueType: z
    .string({ required_error: 'issueType is required' })
    .trim()
    .min(1, 'issueType is required')
    .max(100, 'issueType is too long'),
  urgency: z
    .string({ required_error: 'urgency is required' })
    .trim()
    .min(1, 'urgency is required')
    .max(100, 'urgency is too long'),
  briefDescription: z
    .string({ required_error: 'briefDescription is required' })
    .trim()
    .min(1, 'briefDescription is required')
    .max(255, 'briefDescription is too long'),
  details: z
    .string({ required_error: 'details is required' })
    .trim()
    .min(1, 'details is required'),
  deviceId: z
    .string()
    .trim()
    .max(50, 'deviceId is too long')
    .optional()
    .transform((val) => (val ? val : undefined)),
});

export type ReportIssueInput = z.infer<typeof reportIssueSchema>;
