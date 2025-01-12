import { beforeEach, describe , expect, it, vi} from "vitest"
import { LitManagerImpl } from "../../../../modules/lit-manager/services/implementations/lit-manager-impl.js";
import { repository } from "../../../setup.js";
import prisma from '../../../../lib/__mocks__/prisma.js';
import { ZodError } from "zod";
import { LitManagerExceptions } from "../../../../modules/lit-manager/models/exceptions.js";
import type{ LitRepository } from "../../../../modules/lit-manager/repository/lit-repository.js";
describe('LitManagerImpl' ,() => {
  
  let repo: LitRepository;

  beforeEach(() => {
    repo = {
      create: vi.fn(),
      getAll: vi.fn(),
      getLitById: vi.fn(),
      getLitsByPhone: vi.fn(),
      getLitsByName: vi.fn(),
      getLitsByEstate: vi.fn(),
      deleteLit: vi.fn(),
    } as unknown as LitRepository;
  })

  const litManager = new LitManagerImpl(repository);
    


    describe('createLitt', () => {
        it('should create a Litt', async () => {
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

      const created = await litManager.createLit(litInput);
      // Assert
      expect(created).toMatchObject({
        id: '1',
        client: 'Test Client',
        company: 'Test Company',
          });
        })

        it('should throw Zod Error', async () => {
          const litInput = {
            client: 'Test Client',
            company: 'Test Company'
          };
          await expect(litManager.createLit(litInput)).rejects.toThrow(ZodError)
        })

        it('should throw Zod Error', async () => {
          await expect(litManager.createLit({})).rejects.toThrow(ZodError)
        })
    })
    describe('getLits', () => {
      it('should get all lits from repository', async () => {
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
        prisma.litt.count.mockResolvedValue(mockCount);
        prisma.litt.findMany.mockResolvedValue(mockLits);
        // Act
      const output = await litManager.getLits({ size: "2", page: "1"})
      // Assert
      expect(output.data).toMatchObject([{
        id: '1',
        client: 'Test Client'
      }])

      })

      it('should throw Zod Error to wrong parameters', async () => {
        // Assert fail
        await expect(litManager.getLits({ size: 0, page: 0 })).rejects.toThrow(ZodError);
      })

      it('should throw Zod error to null parameters', async () => {
        // Assert fail
        await expect(litManager.getLits({})).rejects.toThrow(ZodError);
      })
    })

    describe('deleteLit', () => {
        it('should delete Lit', async () => {
          // Arrange
      const litId = {id: '1'};
      prisma.litt.delete.mockResolvedValue({
        id: '1',
        client: 'client name',
        company: 'company name',
        estateName: 'estate Name 1',
        phone: '999-999-8888',
        email: 'email@test.com',
        estateId: 'estate Id xxxx-xxx-xxxx',
        createdAt: new Date(),
      });

      // Act & Assert
      litManager.deleteLit(litId)
      //await expect().resolves.not.toThrow();
      expect(prisma.litt.delete).toHaveBeenCalledWith({
        where: {
          id: '1',
          },
        });
      })

      it('Should throw Lit Manager Excepction', async () => {
        await expect(litManager.deleteLit('1')).rejects.toThrow(LitManagerExceptions);
      })
    })
    describe('getLitById', () => {
      it('Shuld get Lit by Id', async () => {
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
      const result = await litManager.getLitById({id: '1'});

      // Assert
      expect(result).toMatchObject({
        id: '1',
        client: 'Test Client',
      });
        })

      it('Should throw Lit Manager exception (bad params)', async () => {
        await expect(litManager.getLitById('')).rejects.toThrow(LitManagerExceptions)
      })
    })

    describe('getLitsByPhone', () =>{
      
      it('should return lits by phone number', async () => {
        // Arrange
        const lits = [
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
          {
            id: '2',
            client: 'Test Client 2',
            company: 'Test Company',
            estateName: 'Test Estate',
            phone: '1234567890',
            email: 'test2@test.com',
            estateId: '2',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];
  
        const { size, page, clienPhone } = { size: 10, page: 1, clienPhone: '123456' };
        prisma.litt.findMany.mockResolvedValue(lits);
        prisma.litt.count.mockResolvedValue(lits.length);
  
        // Act
        const result = await litManager.getLitsByPhone({size: "10", page: "1", criteria: clienPhone});
  
        // Assert
        expect(result.page).toBe(page);
        expect(result.data).toHaveLength(lits.length);
        expect(result.total).toBe(lits.length);
        expect(result.totalPages).toBe(1);
        expect(prisma.litt.findMany).toHaveBeenCalledWith({
          take: size,
          skip: page * (page - 1),
          where: {
            phone: {
              contains: clienPhone,
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
      });
  
      it('should return empty array when no lits match phone number', async () => {
        // Arrange
        const { size, page, clienPhone } = { size: "10", page: "1", clienPhone: '999999' };
        prisma.litt.findMany.mockResolvedValue([]);
        prisma.litt.count.mockResolvedValue(0);
  
        // Act
        const result = await litManager.getLitsByPhone({size, page, criteria: clienPhone});
  
        // Assert
        expect(result.page).toBe(1);
        expect(result.data).toHaveLength(0);
        expect(result.total).toBe(0);
        expect(result.totalPages).toBe(0);
      });


    })

    describe('getLitsByName', () =>{
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
        const { size, page, name } = { size: "1", page: "1", name: ' customer' };
        prisma.litt.findMany.mockResolvedValue(lits);
        prisma.litt.count.mockResolvedValue(lits.length);
        // Act
        const result = await litManager.getLitsByName({size, page, criteria: name});
        // Assert
        expect(result.page).toBe(1);
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
        const { size, page, name } = { size: "1", page: "1", name: ' customer' };
        prisma.litt.findMany.mockResolvedValue(lits);
        prisma.litt.count.mockResolvedValue(lits.length);
        // Act
        const result = await litManager.getLitsByName({size, page, criteria: name});
        // Assert
        expect(result.page).toBe(1);
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
        const { size, page, name } = { size: "1", page: "1", name: ' customer' };
        prisma.litt.findMany.mockResolvedValue([]);
        prisma.litt.count.mockResolvedValue(0);
        // Act
        const result = await litManager.getLitsByName({size, page, criteria: name});
        // Assert
        expect(result.page).toBe(1);
        expect(result.data).toHaveLength(0);
        expect(result.total).toBe(0);
        expect(result.totalPages).toBe(0);
        expect(result.data).toMatchObject([]);
      });
    })

    describe('getLitsByEstate', () => {
      it('should return lits by estate name', async () => {
        // Arrange
        const lits = [
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
          {
            id: '2',
            client: 'Test Client 2',
            company: 'Test Company',
            estateName: 'Test Estate',
            phone: '0987654321',
            email: 'test2@test.com',
            estateId: '2',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];
  
        const { size, page, estate } = { size: "10", page: "1", estate: 'Test Estate' };
        prisma.litt.findMany.mockResolvedValue(lits);
        prisma.litt.count.mockResolvedValue(lits.length);
  
        // Act
        const result = await litManager.getLitsByEstate({size, page, criteria: estate});
  
        // Assert
        expect(result.page).toBe(1);
        expect(result.data).toHaveLength(lits.length);
        expect(result.total).toBe(lits.length);
        expect(result.totalPages).toBe(1);
        
      });
  
      it('should return empty array when no lits match estate name', async () => {
        // Arrange
        const { size, page, estate } = { size: "10", page: "1", estate: 'Non Existent Estate' };
        prisma.litt.findMany.mockResolvedValue([]);
        prisma.litt.count.mockResolvedValue(0);
  
        // Act
        const result = await litManager.getLitsByEstate({size, page, criteria: estate});
  
        // Assert
        expect(result.page).toBe(1);
        expect(result.data).toHaveLength(0);
        expect(result.total).toBe(0);
        expect(result.totalPages).toBe(0);
      });
    })
})

