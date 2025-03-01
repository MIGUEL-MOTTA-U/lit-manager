import type { LitInputDTO } from '../../models/dtos.js';

export interface InboxService {
  getFilteredEmails(): Promise<LitInputDTO[]>;
  clearFile(): Promise<void>;
}

export type { InboxService as default };
