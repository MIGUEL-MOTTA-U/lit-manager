import { injectable } from 'tsyringe';
import type { LitDTO, NotificationDTO, PaginatedResult } from '../../models/dtos.js';
import type { LitManagerService } from '../interfaces/lit-manager-service.js';

@injectable()
export class LitManagerImpl implements LitManagerService {
  async getLits(): Promise<PaginatedResult<LitDTO>> {
    // Solo es para probar
    console.log('This is real');
    throw new Error('Method not impelemented yet');
  }
  getLitsNotified(): Promise<PaginatedResult<LitDTO>> {
    throw new Error('Method not implemented.');
  }
  getLitsReceived(): Promise<PaginatedResult<LitDTO>> {
    throw new Error('Method not implemented.');
  }
  getLitsById(id: string): Promise<LitDTO> {
    throw new Error('Method not implemented.');
  }
  getLitsByPhone(phone: string): Promise<PaginatedResult<LitDTO>> {
    throw new Error('Method not implemented.');
  }
  getLitsByName(name: string): Promise<PaginatedResult<LitDTO>> {
    throw new Error('Method not implemented.');
  }
  getLitsByEstate(estateName: string): Promise<PaginatedResult<LitDTO>> {
    throw new Error('Method not implemented.');
  }
  getNotificationInfo(): Promise<NotificationDTO> {
    throw new Error('Method not implemented.');
  }
  updateNotification(litDTO: LitDTO): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
