import { injectable } from 'tsyringe';
import { container } from '../../../../config/container.js';
import {
  type LitOutputDTO,
  type NotificationDTO,
  type PaginatedResult,
  validateLitInput,
  validateParams,
} from '../../models/dtos.js';
import { LitManagerExceptions } from '../../models/exceptions.js';
import { LitRepository } from '../../repository/lit-repository.js';
import type { LitManagerService } from '../interfaces/lit-manager-service.js';
@injectable()
export class LitManagerImpl implements LitManagerService {
  private litRepository = container.resolve(LitRepository);

  async createLit(litInput: unknown): Promise<LitOutputDTO> {
    const validatedLit = validateLitInput(litInput);
    return this.litRepository.create(validatedLit);
  }

  async getLits(data: unknown): Promise<PaginatedResult<LitOutputDTO>> {
    const { size, page } = validateParams(data);
    return this.litRepository.getAll(size, page);
  }

  async deleteLit(data: unknown): Promise<void> {
    const { id } = data as { id: string | null | undefined };
    return this.litRepository.deleteLit(this.validateValue(id));
  }

  async getLitById(data: unknown): Promise<LitOutputDTO> {
    const { id } = data as { id: string | null | undefined };
    return this.litRepository.getLitById(this.validateValue(id));
  }
  async getLitsByPhone(data: unknown): Promise<PaginatedResult<LitOutputDTO>> {
    const { size, page, criteria } = validateParams(data);
    return this.litRepository.getLitsByPhone(size, page, this.validateValue(criteria));
  }
  async getLitsByName(data: unknown): Promise<PaginatedResult<LitOutputDTO>> {
    const { size, page, criteria } = validateParams(data);
    return this.litRepository.getLitsByName(size, page, this.validateValue(criteria));
  }
  async getLitsByEstate(data: unknown): Promise<PaginatedResult<LitOutputDTO>> {
    const { size, page, criteria } = validateParams(data);
    console.info(`[-------------] ${size}`);
    console.info(`[-------------] ${page}`);
    console.info(`[-------------] ${criteria}`);
    return this.litRepository.getLitsByEstate(size, page, this.validateValue(criteria));
  }

  async getLitsById(data: unknown): Promise<LitOutputDTO> {
    const { id } = data as { id: string | null | undefined };
    return this.litRepository.getLitById(this.validateValue(id));
  }

  async getNotificationInfo(): Promise<NotificationDTO> {
    throw new Error('Method not implemented.');
  }
  async updateNotification(_notification: NotificationDTO): Promise<void> {
    throw new Error('Method not implemented.');
  }

  private validateValue(data: string | null | undefined): string {
    if (data === null || data === undefined || data.trim() === '')
      throw new LitManagerExceptions(LitManagerExceptions.WRONG_PARAMS, 400);
    return data;
  }
}
