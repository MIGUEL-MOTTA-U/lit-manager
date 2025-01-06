import { fastify, type FastifyInstance } from 'fastify';
import fastifyHelmet from '@fastify/helmet';
import fastifyCors from '@fastify/cors';
import fastifyRateLimit from '@fastify/rate-limit';
import { config } from './config/env.js';
import { errorHandler } from './plugins/errorHandler.js';
import { validateEnv } from './config/env.js';

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

  server.addHook('onError', async (request, reply, error) => {
    request.log.error(error, 'Unhandled error');
  });

  return server;
}

export async function startServer() {
  const server = await buildServer();
  server.get('/', async (req, res) =>{
    return {hello:'World!'}
  })
  try {
    const port = config.server.port;
    server.listen({
      port, 
      host: '0.0.0.0'
    }, (err, address) => {
      if(err) {
        server.log.error(err);
        process.exit(1);
      }
      server.log.info(`The server is running on address: ${address}`)
    })
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}
if (process.argv[1] === new URL(import.meta.url).pathname) {
  startServer();
}
