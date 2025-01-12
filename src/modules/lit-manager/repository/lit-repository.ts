import type { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'tsyringe';
import {
  type LitInputDTO,
  type LitOutputDTO,
  type PaginatedResult,
  validateLitOutput,
  validateLitResponse,
} from '../models/dtos.js';
import { LitManagerExceptions } from '../models/exceptions.js';

@injectable()
export class LitRepository {
  private repository;
  constructor(@inject('PrismaClient') private prismaClient: PrismaClient) {
    this.repository = this.prismaClient.litt;
  }
  async getAll(size: number, page: number): Promise<PaginatedResult<LitOutputDTO>> {
    const queryParams = await this.calculateParams(size, page, {});
    const query = await this.repository.findMany({
      take: queryParams.pageSize,
      skip: queryParams.skip,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return validateLitResponse({
      data: query.map((lit) => validateLitOutput(lit)),
      total: queryParams.totalItems,
      page: queryParams.currentPage,
      totalPages: Math.ceil(queryParams.totalItems / queryParams.pageSize),
    });
  }

  async create(litDTO: LitInputDTO): Promise<LitOutputDTO> {
    const created = await this.repository.create({
      data: {
        client: litDTO.client,
        company: litDTO.company,
        estateName: litDTO.estateName,
        phone: litDTO.phone,
        email: litDTO.email,
        estateId: litDTO.estateId,
      },
    });
    return validateLitOutput(created);
  }

  async getLitsByName(
    size: number,
    page: number,
    name: string,
  ): Promise<PaginatedResult<LitOutputDTO>> {
    const queryParams = await this.calculateParams(size, page, { client: { contains: name } });
    const query = await this.repository.findMany({
      take: queryParams.pageSize,
      skip: queryParams.skip,
      where: {
        client: {
          contains: name,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return validateLitResponse({
      data: query.map((lit) => validateLitOutput(lit)),
      total: queryParams.totalItems,
      page: queryParams.currentPage,
      totalPages: Math.ceil(queryParams.totalItems / queryParams.pageSize),
    });
  }

  async getLitById(litId: string): Promise<LitOutputDTO> {
    const query = await this.repository.findUnique({
      where: {
        id: litId,
      },
    });
    if (!query) throw new LitManagerExceptions(LitManagerExceptions.NOT_FOUND, 404);
    return validateLitOutput(query);
  }

  async getLitsByPhone(
    size: number,
    page: number,
    clienPhone: string,
  ): Promise<PaginatedResult<LitOutputDTO>> {
    const queryParams = await this.calculateParams(size, page, { phone: { contains: clienPhone } });
    const query = await this.repository.findMany({
      take: queryParams.pageSize,
      skip: queryParams.skip,
      where: {
        phone: {
          contains: clienPhone,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return validateLitResponse({
      data: query.map((lit) => validateLitOutput(lit)),
      total: queryParams.totalItems,
      page: queryParams.currentPage,
      totalPages: Math.ceil(queryParams.totalItems / queryParams.pageSize),
    });
  }

  async getLitsByEstate(
    size: number,
    page: number,
    estate: string,
  ): Promise<PaginatedResult<LitOutputDTO>> {
    const queryParams = await this.calculateParams(size, page, {
      estateName: { contains: estate },
    });
    const query = await this.repository.findMany({
      take: queryParams.pageSize,
      skip: queryParams.skip,
      where: {
        estateName: {
          contains: estate,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return validateLitResponse({
      data: query.map((lit) => validateLitOutput(lit)),
      total: queryParams.totalItems,
      page: queryParams.currentPage,
      totalPages: Math.ceil(queryParams.totalItems / queryParams.pageSize),
    });
  }

  async deleteLit(litId: string): Promise<void> {
    await this.repository.delete({
      where: {
        id: litId,
      },
    });
    return;
  }

  private async calculateParams(
    size: number,
    page: number,
    filters: Filters,
  ): Promise<QueryParams> {
    const totalItems = await this.repository.count({
      where: filters,
    });
    return {
      pageSize: size,
      currentPage: page,
      skip: page * (page - 1),
      totalItems,
    };
  }
}

interface Filters {
  [key: string]: QueryFilter;
}

interface QueryParams {
  pageSize: number;
  currentPage: number;
  skip: number;
  totalItems: number;
}

interface QueryFilter {
  contains?: string;
  startsWith?: string;
  endsWith?: string;
}
