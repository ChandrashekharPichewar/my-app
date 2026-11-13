import { createApp } from './app';
import { env } from './config/env';
import { prisma } from './config/prisma';

async function bootstrap() {
  const app = createApp();

  await prisma.$connect();

  const server = app.listen(env.PORT, () => {
    console.log(`Server listening on http://localhost:${env.PORT}`);
    console.log(`Swagger docs available at http://localhost:${env.PORT}/api-docs`);
  });

  const shutdown = async (signal: string) => {
    console.log(`${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(0);
    });
  };

  process.on('SIGINT', () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

bootstrap().catch(async (error) => {
  console.error('Failed to start server:', error);
  await prisma.$disconnect();
  process.exit(1);
});

