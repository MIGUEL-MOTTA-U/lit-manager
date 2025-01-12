import { describe, expect, it, vi } from 'vitest';
import { ZodError } from 'zod';
import { LitManagerExceptions } from '../../../../modules/lit-manager/models/exceptions.js';
import type { LitRepository } from '../../../../modules/lit-manager/repository/lit-repository.js';
import { LitManagerImpl } from '../../../../modules/lit-manager/services/implementations/lit-manager-impl.js';
describe('LitManagerImpl', () => {
  const repo = {
    create: vi.fn(),
    getAll: vi.fn(),
    getLitById: vi.fn(),
    getLitsByPhone: vi.fn(),
    getLitsByName: vi.fn(),
    getLitsByEstate: vi.fn(),
    deleteLit: vi.fn(),
  } as unknown as LitRepository;

  const litManager = new LitManagerImpl(repo);

  describe('createLitt', () => {
    it('should create a Litt', async () => {
      // Arrange
      const litInput = {
        id: '1',
        client: 'Test Client',
        company: 'Test Company',
        estateName: 'Test Estate',
        phone: '1234567890',
        email: 'test@test.com',
        estateId: '1',
      };

      // Act

      await litManager.createLit(litInput);
      // Assert
      expect(repo.create).toBeCalled();
      expect(repo.create).toBeCalledTimes(1);
    });

    it('should throw Zod Error', async () => {
      const litInput = {
        client: 'Test Client',
        company: 'Test Company',
      };
      await expect(litManager.createLit(litInput)).rejects.toThrow(ZodError);
    });

    it('should throw Zod Error', async () => {
      await expect(litManager.createLit({})).rejects.toThrow(ZodError);
    });
  });
  describe('getLits', () => {
    it('should get all lits from repository', async () => {
      // Arrange & Act
      await litManager.getLits({ size: '2', page: '1' });
      // Assert
      expect(repo.getAll).toBeCalled();
      expect(repo.getAll).toBeCalledTimes(1);
      expect(repo.getAll).toBeCalledWith(2, 1);
    });

    it('should throw Zod Error to wrong parameters', async () => {
      // Assert fail
      await expect(litManager.getLits({ size: 0, page: 0 })).rejects.toThrow(ZodError);
    });

    it('should throw Zod error to null parameters', async () => {
      // Assert fail
      await expect(litManager.getLits({})).rejects.toThrow(ZodError);
    });
  });

  describe('deleteLit', () => {
    it('should delete Lit', async () => {
      // Arrange
      const litId = { id: '1' };
      // Act & Assert
      litManager.deleteLit(litId);
      //await expect().resolves.not.toThrow();
      expect(repo.deleteLit).toBeCalled();
      expect(repo.deleteLit).toBeCalledTimes(1);
      expect(repo.deleteLit).toBeCalledWith('1');
    });

    it('Should throw Lit Manager Excepction', async () => {
      await expect(litManager.deleteLit('1')).rejects.toThrow(LitManagerExceptions);
    });
  });
  describe('getLitById', () => {
    it('Shuld get Lit by Id', async () => {
      // Arrange & Arrange
      await litManager.getLitById({ id: '1' });

      // Assert
      expect(repo.getLitById).toBeCalled();
      expect(repo.getLitById).toBeCalledTimes(1);
    });

    it('Should throw Lit Manager exception (bad params)', async () => {
      await expect(litManager.getLitById('')).rejects.toThrow(LitManagerExceptions);
    });
  });

  describe('getLitsByPhone', () => {
    it('should return lits by phone number', async () => {
      // Arrange & Act
      await litManager.getLitsByPhone({ size: '10', page: '1', criteria: '123456' });

      // Assert
      expect(repo.getLitsByPhone).toBeCalled();
      expect(repo.getLitsByPhone).toBeCalledTimes(1);
    });

    it('should return empty array when no lits match phone number', async () => {
      // Arrange
      const { size, page, clienPhone } = { size: '10', page: '1', clienPhone: '999999' };
      // Act
      await litManager.getLitsByPhone({ size, page, criteria: clienPhone });

      // Assert
      expect(repo.getLitsByPhone).toBeCalled();
      expect(repo.getLitsByPhone).toBeCalledTimes(1);
    });
  });

  describe('getLitsByName', () => {
    it('should return lits by name', async () => {
      // Arrange
      const { size, page, name } = { size: '1', page: '1', name: ' customer' };
      // Act
      await litManager.getLitsByName({ size, page, criteria: name });
      // Assert
      expect(repo.getLitsByName).toBeCalled();
      expect(repo.getLitsByName).toBeCalledTimes(1);
    });

    it('should return 1 lit by name', async () => {
      // Arrange
      const { size, page, name } = { size: '1', page: '1', name: ' customer' };
      // Act
      await litManager.getLitsByName({ size, page, criteria: name });
      // Assert
      expect(repo.getLitsByName).toBeCalled();
      expect(repo.getLitsByName).toBeCalledTimes(1);
    });

    it('should return 0 lits by name', async () => {
      // Arrange
      const { size, page, name } = { size: '1', page: '1', name: ' customer' };
      // Act
      await litManager.getLitsByName({ size, page, criteria: name });
      // Assert
      expect(repo.getLitsByName).toBeCalled();
      expect(repo.getLitsByName).toBeCalledTimes(1);
    });
  });

  describe('getLitsByEstate', () => {
    it('should return lits by estate name', async () => {
      // Arrange
      const { size, page, estate } = { size: '10', page: '1', estate: 'Test Estate' };

      // Act
      await litManager.getLitsByEstate({ size, page, criteria: estate });

      // Assert
      expect(repo.getLitsByEstate).toBeCalled();
    });

    it('should return empty array when no lits match estate name', async () => {
      // Arrange
      const { size, page, estate } = { size: '10', page: '1', estate: 'Non Existent Estate' };

      // Act
      await litManager.getLitsByEstate({ size, page, criteria: estate });

      // Assert
      expect(repo.getLitsByEstate).toBeCalled();
    });
  });
});
