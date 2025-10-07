import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';

// Cria uma instância global do Prisma
const prisma = new PrismaClient({
    log: ['error', 'warn'], // opcional: ['query', 'info', 'warn', 'error']
});

export const prismaPlugin = fp(async (app) => {
    // Adiciona prisma ao contexto do Fastify
    app.decorate('prisma', prisma);

    // Fecha a conexão quando o servidor parar
    app.addHook('onClose', async (app) => {
        await app.prisma.$disconnect();
    });
});

declare module 'fastify' {
    interface FastifyInstance {
        prisma: PrismaClient;
    }
}
