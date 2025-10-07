import { FastifyPluginAsync } from 'fastify';

const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get('/health', async () => {
    try {
      const usersCount = await app.prisma.user.count();
      return {
        status: 'ok',
        database: 'connected',
        usersCount,
      };
    } catch (err) {
      return {
        status: 'error',
        database: 'disconnected',
        message: (err as Error).message,
      };
    }
  });
};

export default healthRoutes;
