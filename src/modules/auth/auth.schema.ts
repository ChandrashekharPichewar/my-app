import { z } from 'zod';

function normalizeDeviceIdPayload(data: unknown): unknown {
  if (typeof data === 'object' && data !== null) {
    const record = data as Record<string, unknown>;
    const resolvedDeviceId = record.deviceId ?? record.deviceID ?? record.deviceid;
    if (resolvedDeviceId !== undefined) {
      return {
        ...record,
        deviceId: resolvedDeviceId,
      };
    }
  }
  return data;
}

export const signupSchema = z.preprocess(
  normalizeDeviceIdPayload,
  z.object({
    firstname: z
      .string({ required_error: 'firstname is required' })
      .trim()
      .min(1, 'firstname is required')
      .max(60, 'firstname must be at most 60 characters'),
    lastname: z
      .string({ required_error: 'lastname is required' })
      .trim()
      .min(1, 'lastname is required')
      .max(60, 'lastname must be at most 60 characters'),
    email: z
      .string({ required_error: 'email is required' })
      .trim()
      .toLowerCase()
      .email('Invalid email format'),
    password: z
      .string({ required_error: 'password is required' })
      .min(6, 'password must be at least 6 characters')
      .max(128, 'password must be at most 128 characters'),
    deviceId: z
      .string({ required_error: 'deviceId is required' })
      .trim()
      .min(1, 'deviceId is required')
      .max(255, 'deviceId is too long'),
  })
);

export const loginSchema = z.preprocess(
  normalizeDeviceIdPayload,
  z.object({
    username: z
      .string({ required_error: 'username is required' })
      .trim()
      .min(1, 'username is required'),
    password: z
      .string({ required_error: 'password is required' })
      .min(1, 'password is required'),
    deviceId: z
      .string({ required_error: 'deviceId is required' })
      .trim()
      .min(1, 'deviceId is required')
      .max(255, 'deviceId is too long'),
  })
);

export const refreshTokenSchema = z.object({
  refreshToken: z
    .string({ required_error: 'refreshToken is required' })
    .trim()
    .min(1, 'refreshToken is required'),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
