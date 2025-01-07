import 'reflect-metadata';
import { container } from 'tsyringe';
import { LitManagerController } from '../modules/lit-manager/controller/lit-manager-controller.js';
import { LitManagerImpl } from '../modules/lit-manager/services/implementations/lit-manager-impl.js';
import type { LitManagerService } from '../modules/lit-manager/services/interfaces/lit-manager-service.js';

container.registerSingleton<LitManagerService>('LitManagerService', LitManagerImpl);
container.registerSingleton(LitManagerController);

export { container };
