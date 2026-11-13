import type { Prisma, PrismaClient, User } from '@prisma/client';

import { prisma } from '../../config/prisma';
import { AppError } from '../../utils/app-error';
import {
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../utils/jwt';
import { comparePassword, hashPassword } from '../../utils/password';
import type { LoginInput, SignupInput } from './auth.schema';

export interface AuthResponse {
  userId: string;
  accessToken: string;
  refreshToken: string;
  firstname: string;
  lastname: string;
}

type DbClient = PrismaClient | Prisma.TransactionClient;

async function issueSessionTokens(
  db: DbClient,
  user: Pick<User, 'id' | 'email' | 'firstname' | 'lastname'>
): Promise<AuthResponse> {
  const accessToken = signAccessToken({ userId: user.id, email: user.email });
  const { token: refreshToken, expiresAt } = signRefreshToken(user.id);

  await db.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId: user.id,
      expiresAt,
    },
  });

  return {
    userId: user.id,
    accessToken,
    refreshToken,
    firstname: user.firstname,
    lastname: user.lastname,
  };
}

export async function signupUser(input: SignupInput): Promise<AuthResponse> {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
    select: { id: true },
  });

  if (existingUser) {
    throw new AppError('Email already exists. Please use a different email or log in.', 409);
  }

  const passwordHash = await hashPassword(input.password);

  return prisma.$transaction(async (tx) => {
    const createdUser = await tx.user.create({
      data: {
        firstname: input.firstname,
        lastname: input.lastname,
        email: input.email,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
      },
    });

    if (input.deviceId) {
      await tx.device.upsert({
        where: { deviceId: input.deviceId },
        update: { userId: createdUser.id },
        create: {
          deviceId: input.deviceId,
          userId: createdUser.id,
        },
      });
    }

    return issueSessionTokens(tx, createdUser);
  });
}

export async function loginUser(input: LoginInput): Promise<AuthResponse> {
  const normalizedUsername = input.username.trim();

  const candidates = await prisma.user.findMany({
    where: {
      OR: [
        { email: { equals: normalizedUsername, mode: 'insensitive' } },
        { firstname: { equals: normalizedUsername, mode: 'insensitive' } },
      ],
    },
  });

  if (candidates.length === 0) {
    throw new AppError('Invalid username or password.', 401);
  }

  const sortedCandidates = [...candidates].sort((a, b) => {
    const aExact = a.email.toLowerCase() === normalizedUsername.toLowerCase() ? 0 : 1;
    const bExact = b.email.toLowerCase() === normalizedUsername.toLowerCase() ? 0 : 1;
    return aExact - bExact;
  });

  let matchedUser: User | null = null;
  for (const candidate of sortedCandidates) {
    const isPasswordValid = await comparePassword(input.password, candidate.passwordHash);
    if (isPasswordValid) {
      matchedUser = candidate;
      break;
    }
  }

  if (!matchedUser) {
    throw new AppError('Invalid username or password.', 401);
  }

  if (input.deviceId) {
    await prisma.device.upsert({
      where: { deviceId: input.deviceId },
      update: { userId: matchedUser.id },
      create: {
        deviceId: input.deviceId,
        userId: matchedUser.id,
      },
    });
  }

  return issueSessionTokens(prisma, matchedUser);
}

export async function rotateRefreshToken(rawRefreshToken: string): Promise<AuthResponse> {
  let payload;
  try {
    payload = verifyRefreshToken(rawRefreshToken);
  } catch {
    throw new AppError('Invalid or expired refresh token.', 401);
  }

  const tokenHash = hashToken(rawRefreshToken);

  const stored = await prisma.refreshToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!stored || stored.userId !== payload.sub || stored.expiresAt < new Date()) {
    if (stored) {
      await prisma.refreshToken.delete({ where: { id: stored.id } }).catch(() => {});
    }
    throw new AppError('Invalid or expired refresh token.', 401);
  }

  return prisma.$transaction(async (tx) => {
    await tx.refreshToken.delete({ where: { id: stored.id } });
    return issueSessionTokens(tx, stored.user);
  });
}
