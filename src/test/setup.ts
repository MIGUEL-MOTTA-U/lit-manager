import 'reflect-metadata';
import { beforeAll, beforeEach, vi } from 'vitest';
import prisma from '../lib/__mocks__/prisma.js';
import { LitRepository } from '../modules/lit-manager/repository/lit-repository.js';

beforeEach(() => {
  vi.clearAllMocks();
});
beforeAll(() => {});
export const repository = new LitRepository(prisma);
export { prisma };
