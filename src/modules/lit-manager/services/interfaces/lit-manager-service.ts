import type {
  LitInputDTO,
  LitOutputDTO,
  NotificationDTO,
  PaginatedResult,
} from '../../models/dtos.js';

export interface LitManagerService {
  getLits(data: unknown): Promise<PaginatedResult<LitOutputDTO>>;
  getLitById(data: unknown): Promise<LitOutputDTO>;
  getLitsByPhone(data: unknown): Promise<PaginatedResult<LitOutputDTO>>;
  getLitsByName(data: unknown): Promise<PaginatedResult<LitOutputDTO>>;
  getLitsByEstate(data: unknown): Promise<PaginatedResult<LitOutputDTO>>;
  createLit(data: unknown): Promise<LitOutputDTO>;
  deleteLit(data: unknown): Promise<void>;
  getNotificationInfo(): Promise<NotificationDTO>;
  updateNotification(notification: NotificationDTO): Promise<void>;
  getEmails(): Promise<LitInputDTO[]>;
}
export type { LitManagerService as default };
