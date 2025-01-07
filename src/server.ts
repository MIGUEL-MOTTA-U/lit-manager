import 'reflect-metadata';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyRateLimit from '@fastify/rate-limit';
import { type FastifyInstance, fastify } from 'fastify';
import { container } from './config/container.js';
import { config } from './config/env.js';
import { validateEnv } from './config/env.js';
import { LitManagerController } from './modules/lit-manager/controller/lit-manager-controller.js';
import { errorHandler } from './plugins/errorHandler.js';

export async function buildServer(): Promise<FastifyInstance> {
  validateEnv();

  const server = fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
    ajv: {
      customOptions: {
        removeAdditional: 'all',
        coerceTypes: true,
        useDefaults: true,
      },
    },
  });

  await server.register(fastifyHelmet, {
    global: true,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
  });

  await server.register(fastifyCors, {
    origin: config.cors.origin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  await server.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  server.setErrorHandler(errorHandler);
  server.decorateRequest('user', null);

  server.addHook('onRequest', async (request) => {
    request.log.info({ url: request.url, method: request.method }, 'incoming request');
  });

  server.addHook('onError', async (request, _reply, error) => {
    request.log.error(error, 'Unhandled error');
  });

  return server;
}

export async function startServer() {
  const server = await buildServer();
  const litManagerController = container.resolve(LitManagerController);
  try {
    litManagerController.registerRoutes(server);
    const port = config.server.port;
    server.listen(
      {
        port,
        host: '0.0.0.0',
      },
      (err, address) => {
        if (err) {
          server.log.error(err);
          process.exit(1);
        }
        server.log.info(`The server is running on address: ${address}`);
      },
    );
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}
if (process.argv[1] === new URL(import.meta.url).pathname) {
  startServer();
}
