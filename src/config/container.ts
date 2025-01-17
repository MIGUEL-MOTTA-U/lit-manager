import 'reflect-metadata';
import { container } from 'tsyringe';
import { prisma } from '../lib/prisma.js';
import { LitManagerController } from '../modules/lit-manager/controller/lit-manager-controller.js';
import { LitRepository } from '../modules/lit-manager/repository/lit-repository.js';
import { InboxServiceImpl } from '../modules/lit-manager/services/implementations/inbox-impl.js';
import { LitManagerImpl } from '../modules/lit-manager/services/implementations/lit-manager-impl.js';
import type InboxService from '../modules/lit-manager/services/interfaces/inbox-service.js';
import type { LitManagerService } from '../modules/lit-manager/services/interfaces/lit-manager-service.js';
import { config } from './env.js';

container.registerSingleton<InboxService>('InboxService', InboxServiceImpl);
container.registerSingleton<LitManagerService>('LitManagerService', LitManagerImpl);
container.registerSingleton<LitRepository>('LitRepository', LitRepository);
container.registerSingleton(LitManagerController);
container.register('PrismaClient', {
  useValue: prisma,
});
container.register('filtered-file-path', {
  useValue: config.inboxConfig.filtered,
});
export { container };
