import { describe, expect, it } from 'vitest';
import { ZodError } from 'zod';
import prisma from '../../../lib/__mocks__/prisma.js';
import { LitManagerExceptions } from '../../../modules/lit-manager/models/exceptions.js';
import { repository } from '../../setup.js';

describe('LitRepository', () => {
  describe('getAll', () => {
    it('should return paginated results', async () => {
      // Arrange
      const mockLits = [
        {
          id: '1',
          client: 'Test Client',
          company: 'Test Company',
          estateName: 'Test Estate',
          phone: '1234567890',
          email: 'test@test.com',
          estateId: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      const mockCount = 1;

      // Mock del método count y findMany de Prisma

      prisma.litt.count.mockResolvedValue(mockCount);
      prisma.litt.findMany.mockResolvedValue(mockLits);

      // Act
      const result = await repository.getAll(10, 1);

      // Assert
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(mockCount);
      expect(result.page).toBe(1);
      expect(prisma.litt.findMany).toHaveBeenCalledWith({
        take: 10,
        skip: 0,
        orderBy: {
          createdAt: 'desc',
        },
      });
    });
  });

  describe('getLitById', () => {
    it('should throw exception when lit is not found', async () => {
      // Arrange
      prisma.litt.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(repository.getLitById('non-existent')).rejects.toThrow(LitManagerExceptions);
    });

    it('should return lit when found', async () => {
      // Arrange
      const mockLit = {
        id: '1',
        client: 'Test Client',
        company: 'Test Company',
        estateName: 'Test Estate',
        phone: '1234567890',
        email: 'test@test.com',
        estateId: '1',
        createdAt: new Date(),
      };
      // Mock the search

      prisma.litt.findUnique.mockResolvedValue(mockLit);

      // Act
      const result = await repository.getLitById('1');

      // Assert
      expect(result).toMatchObject({
        id: '1',
        client: 'Test Client',
      });
    });
  });

  describe('create', () => {
    it('should create a lit', async () => {
      // Arrange
      const litCreated = {
        id: '1',
        client: 'Test Client',
        company: 'Test Company',
        estateName: 'Test Estate',
        phone: '1234567890',
        email: 'test@test.com',
        estateId: '1',
        createdAt: new Date(),
      };

      const litInput = {
        id: '1',
        client: 'Test Client',
        company: 'Test Company',
        estateName: 'Test Estate',
        phone: '1234567890',
        email: 'test@test.com',
        estateId: '1',
      };

      prisma.litt.create.mockResolvedValue(litCreated);

      // Act

      const created = await repository.create(litInput);
      // Assert
      expect(created).toMatchObject({
        id: '1',
        client: 'Test Client',
        company: 'Test Company',
      });
    });

    it('Should throw ZodError if lit created is not possible to parse', async () => {
      // Arrange
      const lit = {
        client: '',
        id: '',
        email: null,
        createdAt: new Date(),
        company: '',
        estateName: '',
        phone: null,
        estateId: null,
      };

      prisma.litt.create.mockResolvedValue(lit);

      // Act & Assert
      await expect(
        repository.create({
          client: '',
          email: null,
          company: '',
          estateName: '',
          phone: null,
          estateId: null,
        }),
      ).rejects.toThrow(ZodError);
    });
  });

  describe('getLitsByName', () => {
    it('should return lits by name', async () => {
      // Arrange
      const lits = [
        {
          id: '1',
          client: 'Its customer name',
          company: 'Test Company',
          estateName: 'Test Estate',
          phone: '1234567890',
          email: 'test@test.com',
          estateId: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          client: 'Its customer name',
          company: 'Test Company',
          estateName: 'Test Estate',
          phone: '1234567890',
          email: 'test@test.com',
          estateId: '2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '3',
          client: 'Its customer name',
          company: 'Test Company',
          estateName: 'Test Estate',
          phone: '1234567890',
          email: 'test@test.com',
          estateId: '3',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const { size, page, name } = { size: 1, page: 1, name: ' customer' };
      prisma.litt.findMany.mockResolvedValue(lits);
      prisma.litt.count.mockResolvedValue(lits.length);
      // Act
      const result = await repository.getLitsByName(size, page, name);
      console.log(result);
      // Assert
      expect(result.page).toBe(page);
      expect(result.data).toHaveLength(lits.length);
      expect(result.total).toBe(lits.length);
      expect(result.totalPages).toBe(3);
      expect(result.data).toMatchObject([
        {
          id: '1',
          client: 'Its customer name',
        },
        {
          id: '2',
          client: 'Its customer name',
        },
        {
          id: '3',
          client: 'Its customer name',
        },
      ]);
    });

    it('should return 1 lit by name', async () => {
      // Arrange
      const lits = [
        {
          id: '1',
          client: 'Its customer name',
          company: 'Test Company',
          estateName: 'Test Estate',
          phone: '1234567890',
          email: 'test@test.com',
          estateId: '1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      const { size, page, name } = { size: 1, page: 1, name: ' customer' };
      prisma.litt.findMany.mockResolvedValue(lits);
      prisma.litt.count.mockResolvedValue(lits.length);
      // Act
      const result = await repository.getLitsByName(size, page, name);
      console.log(result);
      // Assert
      expect(result.page).toBe(page);
      expect(result.data).toHaveLength(lits.length);
      expect(result.total).toBe(lits.length);
      expect(result.totalPages).toBe(1);
      expect(result.data).toMatchObject([
        {
          id: '1',
          client: 'Its customer name',
        },
      ]);
    });

    it('should return 0 lits by name', async () => {
      // Arrange
      const { size, page, name } = { size: 1, page: 1, name: ' customer' };
      prisma.litt.findMany.mockResolvedValue([]);
      prisma.litt.count.mockResolvedValue(0);
      // Act
      const result = await repository.getLitsByName(size, page, name);
      console.log(result);
      // Assert
      expect(result.page).toBe(page);
      expect(result.data).toHaveLength(0);
      expect(result.total).toBe(0);
      expect(result.totalPages).toBe(0);
      expect(result.data).toMatchObject([]);
    });
  });
});
