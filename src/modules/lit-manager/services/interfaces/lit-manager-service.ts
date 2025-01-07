import type { LitDTO, NotificationDTO, PaginatedResult } from '../../models/dtos.js';

export interface LitManagerService {
  getLits(): Promise<PaginatedResult<LitDTO>>;
  getLitsNotified(): Promise<PaginatedResult<LitDTO>>;
  getLitsReceived(): Promise<PaginatedResult<LitDTO>>;
  getLitsById(id: string): Promise<LitDTO>;
  getLitsByPhone(phone: string): Promise<PaginatedResult<LitDTO>>;
  getLitsByName(name: string): Promise<PaginatedResult<LitDTO>>;
  getLitsByEstate(estateName: string): Promise<PaginatedResult<LitDTO>>;
  getNotificationInfo(): Promise<NotificationDTO>;
  updateNotification(litDTO: LitDTO): Promise<void>;
}
export type { LitManagerService as default };
