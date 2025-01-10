import { z } from 'zod';
const UserRoleEnum = z.enum(['USER', 'ADMIN']);
const phoneRegex = /^(\+?[1-9]{1,4}[ -]?)?(\(?\d{1,5}\)?[ -]?)?[\d -]{7,15}$/;
const emptyField = 'El campo no puede ser nulo';

function nonEmptyString() {
  return z
    .string()
    .refine((value) => value !== null && value !== undefined && value.trim() !== '', {
      message: emptyField,
    });
}

const UserDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: UserRoleEnum,
});

const paginationParamsSchema = z.object({
  size: z
    .string()
    .transform((val) => Number.parseInt(val, 10))
    .refine((val) => !Number.isNaN(val), {
      message: 'Size must be a number',
    })
    .refine((val) => val > 0 && val <= 100, {
      message: 'Size must be greater than 0 and less than or equal to 100',
    }),

  page: z
    .string()
    .transform((val) => Number.parseInt(val, 10))
    .refine((val) => !Number.isNaN(val), {
      message: 'Page must be a number',
    })
    .refine((val) => val > 0, {
      message: 'Page must be greater than 0',
    }),
  criteria: z.string().nullable().optional(),
});

const NotificationSchema = z.object({
  message: z.string().max(350),
});

const LitOutputSchema = z.object({
  id: nonEmptyString(),
  company: nonEmptyString(),
  estateName: nonEmptyString(),
  client: nonEmptyString(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  createdAt: z.date().refine((value) => value !== null && value !== undefined, {
    message: emptyField,
  }),
});

const LitInputSchema = z.object({
  client: nonEmptyString(),
  company: nonEmptyString(),
  estateName: nonEmptyString(),
  phone: z.string().regex(phoneRegex).nullable().optional(),
  email: z.string().email().nullable().optional(),
  estateId: z.string().nullable().optional(),
});

const litResponseSchema = z.object({
  data: z.array(LitOutputSchema),
  total: z.number(),
  page: z.number(),
  totalPages: z.number(),
});

export interface PaginationParams {
  size: number;
  page: number;
  criteria?: string | null;
}
export interface LitOutputDTO {
  id: string;
  company: string;
  estateName: string;
  client: string;
  phone?: string | null;
  email?: string | null;
  createdAt: Date;
}

export interface LitInputDTO {
  client: string;
  company: string;
  estateName: string;
  phone?: string | null;
  email?: string | null;
  estateId?: string | null;
}

export interface UserDTO {
  id: string;
  name: string;
  role: 'USER' | 'ADMIN';
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

export function validateNotificationDTO(data: unknown): NotificationDTO {
  return NotificationSchema.parse(data);
}

export function validateUserDTO(data: unknown): UserDTO {
  return UserDtoSchema.parse(data);
}

export function validateParams(data: unknown): PaginationParams {
  return paginationParamsSchema.parse(data);
}

export function validateLitOutput(data: unknown): LitOutputDTO {
  return LitOutputSchema.parse(data);
}

export function validateLitInput(data: unknown): LitInputDTO {
  return LitInputSchema.parse(data);
}

export function validateLitResponse(data: unknown): PaginatedResult<LitOutputDTO> {
  return litResponseSchema.parse(data);
}
