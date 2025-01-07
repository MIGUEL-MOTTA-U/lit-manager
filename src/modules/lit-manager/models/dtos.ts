export interface LitDTO {
  id: string;
  company: string;
  estateName: string;
  client: string;
  contact: string;
  create: Date;
}

export interface UserDTO {
  id: string;
  name: string;
  role: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface NotificationDTO {
  message: string;
}
