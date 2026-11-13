import { prisma } from '../../config/prisma';
import type { SaveDeviceInput } from './device.schema';

export interface SaveDeviceResponse {
  message: string;
  deviceID: string;
  expoToken: string;
}

export async function saveDeviceToken(
  input: SaveDeviceInput,
  userId?: string
): Promise<SaveDeviceResponse> {
  const saved = await prisma.device.upsert({
    where: { deviceId: input.deviceID },
    update: {
      expoToken: input.expoToken,
      ...(userId ? { userId } : {}),
    },
    create: {
      deviceId: input.deviceID,
      expoToken: input.expoToken,
      userId: userId ?? null,
    },
    select: {
      deviceId: true,
      expoToken: true,
    },
  });

  return {
    message: 'Successfully saved',
    deviceID: saved.deviceId,
    expoToken: saved.expoToken ?? input.expoToken,
  };
}
