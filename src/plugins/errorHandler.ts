import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { LitManagerExceptions } from '../modules/lit-manager/models/exceptions.js';

export async function errorHandler(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.error(error);

  // My own exceptions
  if (error instanceof LitManagerExceptions) {
    return reply.status(error.status).send({
      statusCode: error.status,
      error: 'Bad request',
      message: error.message,
    });
  }

  // Zod validation exceptions
  if (error instanceof ZodError) {
    return reply.status(400).send({
      statusCode: 400,
      error: 'Validation Error',
      message: 'Bad request',
    });
  }

  // Prisma exceptions
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

  // Fastify exceptions
  if ('statusCode' in error) {
    return reply.status(error.statusCode ?? 500).send({
      statusCode: error.statusCode ?? 500,
      error: 'Server Error',
      message: 'An internal server error occurred',
    });
  }

  // Errores no manejados
  return reply.status(500).send({
    statusCode: 500,
    error: 'Internal Server Error',
    message: 'An internal server error occurred',
  });
}
