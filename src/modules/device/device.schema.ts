import { z } from 'zod';

export const saveDeviceSchema = z.object({
  deviceID: z
    .string({ required_error: 'deviceID is required' })
    .trim()
    .min(1, 'deviceID is required')
    .max(255, 'deviceID is too long'),
  expoToken: z
    .string({ required_error: 'expoToken is required' })
    .trim()
    .min(1, 'expoToken is required')
    .max(512, 'expoToken is too long'),
});

export type SaveDeviceInput = z.infer<typeof saveDeviceSchema>;

