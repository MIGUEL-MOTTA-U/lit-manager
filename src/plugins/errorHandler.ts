import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

export async function errorHandler(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.error(error);

  // Errores de Zod (validación)
  if (error instanceof ZodError) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Validation Error',
      message: error.issues,
    });
  }

  // Errores de Prisma
  if (error instanceof PrismaClientKnownRequestError) {
    // P2002: Unique constraint violation
    if (error.code === 'P2002') {
      return reply.status(409).send({
        statusCode: 409,
        error: 'Conflict',
        message: 'Resource already exists',
      });
    }

    // P2025: Record not found
    if (error.code === 'P2025') {
      return reply.status(404).send({
        statusCode: 404,
        error: 'Not Found',
        message: 'Resource not found',
      });
    }
  }

  // Errores de Fastify
  //   if (error instanceof FastifyError) {
  //     return reply.status(error.statusCode ?? 500).send({
  //       statusCode: error.statusCode ?? 500,
  //       error: error.name,
  //       message: error.message,
  //     });
  //   }

  // Errores no manejados
  return reply.status(500).send({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'An internal server error occurred',
  });
}
