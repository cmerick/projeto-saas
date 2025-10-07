import Fastify from 'fastify';
import cors from '@fastify/cors';
import { prismaPlugin } from './plugins/prisma';
import healthRoutes from './modules/health/route';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';


export function buildApp() {
    const app = Fastify({ logger: true });

    app.register(cors, { origin: true });
    app.register(prismaPlugin)
    app.register(swagger, {
        openapi: {
            info: {
                title: 'Mini CRM API',
                description: 'API do Mini CRM (Leads, Properties, Deals...)',
                version: '1.0.0',
            },
            servers: [{ url: 'http://localhost:3000' }],
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                },
            },
            security: [{ bearerAuth: [] }], // aplica globalmente (opcional)
            tags: [
                { name: 'health', description: 'Healthcheck' },
                { name: 'leads', description: 'Leads' },
                { name: 'properties', description: 'Imóveis' },
            ],
        },
    })

    app.register(swaggerUI, {
        routePrefix: '/docs', // UI em /docs
        uiConfig: { docExpansion: 'list', deepLinking: true },
    });

    app.register(healthRoutes);

    return app;
}