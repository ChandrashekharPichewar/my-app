import { prisma } from '../../config/prisma';
import type { SaveDeviceInput } from './device.schema';

export interface SaveDeviceResponse {
  message: string;
  deviceID: string;
}

export async function saveDeviceToken(
  input: SaveDeviceInput,
  userId?: string
): Promise<SaveDeviceResponse> {
  const saved = await prisma.device.upsert({
    where: { deviceId: input.deviceID },
    update: {
      ...(userId ? { userId } : {}),
    },
    create: {
      deviceId: input.deviceID,
      userId: userId ?? null,
    },
    select: {
      deviceId: true,
    },
  });

  return {
    message: 'Successfully saved',
    deviceID: saved.deviceId,
  };
}
