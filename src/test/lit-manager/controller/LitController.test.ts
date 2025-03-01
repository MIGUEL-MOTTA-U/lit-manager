import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { type Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { mockDeep, mockReset } from 'vitest-mock-extended';
import { LitManagerController } from '../../../modules/lit-manager/controller/lit-manager-controller.js';
import type LitManagerService from '../../../modules/lit-manager/services/interfaces/lit-manager-service.js';

describe('LitManagerController', () => {
  const mockLitManagerService = mockDeep<LitManagerService>();
  let controller: LitManagerController;
  let mockReq: FastifyRequest;
  let mockRes: FastifyReply;
  let mockServer: FastifyInstance;

  beforeEach(() => {
    mockReset(mockLitManagerService);

    mockRes = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    } as unknown as FastifyReply;

    mockReq = {
      query: {},
      body: {},
    } as FastifyRequest;

    mockServer = {
      get: vi.fn(),
      post: vi.fn(),
      delete: vi.fn(),
    } as unknown as FastifyInstance;

    controller = new LitManagerController(mockLitManagerService);
  });

  describe('index', () => {
    it('should return index message with 200 status', async () => {
      await controller.index(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith('Lit Managger Index');
    });
  });

  describe('auth', () => {
    it('should return auth message with 200 status', async () => {
      await controller.auth(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith('/auth');
    });
  });

  describe('getLits', () => {
    it('should return lits with 200 status', async () => {
      const mockLits = { data: [], total: 0, page: 1, totalPages: 0 };
      mockLitManagerService.getLits.mockResolvedValue(mockLits);

      await controller.getLits(mockReq, mockRes);

      expect(mockLitManagerService.getLits).toHaveBeenCalledWith(mockReq.query);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(mockLits);
    });
  });

  describe('litById', () => {
    it('should return lit with 200 status', async () => {
      const mockLit = { id: '1', client: 'Test Client' };
      (mockLitManagerService.getLitById as Mock).mockResolvedValue(mockLit);

      await controller.litById(mockReq, mockRes);

      expect(mockLitManagerService.getLitById).toHaveBeenCalledWith(mockReq.query);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(mockLit);
    });
  });

  describe('createLit', () => {
    it('should create lit and return 201 status', async () => {
      const mockCreatedLit = { id: '1', client: 'Test Client' };
      (mockLitManagerService.createLit as Mock).mockResolvedValue(mockCreatedLit);

      await controller.createLit(mockReq, mockRes);

      expect(mockLitManagerService.createLit).toHaveBeenCalledWith(mockReq.body);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.send).toHaveBeenCalledWith(mockCreatedLit);
    });
  });

  describe('deleteLit', () => {
    it('should delete lit and return 204 status', async () => {
      (mockLitManagerService.deleteLit as Mock).mockResolvedValue(undefined);

      await controller.deleteLit(mockReq, mockRes);

      expect(mockLitManagerService.deleteLit).toHaveBeenCalledWith(mockReq.query);
      expect(mockRes.send).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(204);
    });
  });

  describe('litsByName', () => {
    it('should return lits by name with 200 status', async () => {
      const mockLits = { data: [], total: 0, page: 1, totalPages: 0 };
      (mockLitManagerService.getLitsByName as Mock).mockResolvedValue(mockLits);

      await controller.litsByName(mockReq, mockRes);

      expect(mockLitManagerService.getLitsByName).toHaveBeenCalledWith(mockReq.query);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(mockLits);
    });
  });

  describe('litsByPhone', () => {
    it('should return lits by phone with 200 status', async () => {
      const mockLits = { data: [], total: 0, page: 1, totalPages: 0 };
      (mockLitManagerService.getLitsByPhone as Mock).mockResolvedValue(mockLits);

      await controller.litsByPhone(mockReq, mockRes);

      expect(mockLitManagerService.getLitsByPhone).toHaveBeenCalledWith(mockReq.query);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(mockLits);
    });
  });

  describe('litByEstate', () => {
    it('should return lits by estate with 200 status', async () => {
      const mockLits = { data: [], total: 0, page: 1, totalPages: 0 };
      (mockLitManagerService.getLitsByEstate as Mock).mockResolvedValue(mockLits);

      await controller.litByEstate(mockReq, mockRes);

      expect(mockLitManagerService.getLitsByEstate).toHaveBeenCalledWith(mockReq.query);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.send).toHaveBeenCalledWith(mockLits);
    });
  });

  describe('notImplemented endpoints', () => {
    it('should return message for notificationInfo', async () => {
      await controller.notificationInfo(mockReq, mockRes);
      expect(mockRes.send).toHaveBeenCalledWith('Notification information send to the clients');
    });

    it('should return message for updateNotification', async () => {
      await controller.updateNotification(mockReq, mockRes);
      expect(mockRes.send).toHaveBeenCalledWith('Update information send to the clients');
    });

    it('should return message for logIn', async () => {
      await controller.logIn(mockReq, mockRes);
      expect(mockRes.send).toHaveBeenCalledWith('log in the user {email and password}');
    });

    it('should return message for logOut', async () => {
      await controller.logOut(mockReq, mockRes);
      expect(mockRes.send).toHaveBeenCalledWith('log out the user');
    });

    it('should return message for createUser', async () => {
      await controller.createUser(mockReq, mockRes);
      expect(mockRes.send).toHaveBeenCalledWith('create the user {body DTO}');
    });

    it('should return message for getUser', async () => {
      await controller.getUser(mockReq, mockRes);
      expect(mockRes.send).toHaveBeenCalledWith('get the user by id');
    });

    it('should return message for updatePassword', async () => {
      await controller.updatePassword(mockReq, mockRes);
      expect(mockRes.send).toHaveBeenCalledWith('update the password by the provided');
    });
  });

  describe('registerRoutes', () => {
    it('should register all routes', () => {
      controller.registerRoutes(mockServer);

      expect(mockServer.get).toHaveBeenCalledTimes(10);
      expect(mockServer.post).toHaveBeenCalledTimes(5);
      expect(mockServer.delete).toHaveBeenCalledTimes(1);

      // Verify specific routes are registered
      expect(mockServer.get).toHaveBeenCalledWith('/', expect.any(Function));
      expect(mockServer.get).toHaveBeenCalledWith('/auth', expect.any(Function));
      expect(mockServer.get).toHaveBeenCalledWith('/lit', expect.any(Function));
      expect(mockServer.post).toHaveBeenCalledWith('/lit', expect.any(Function));
      expect(mockServer.delete).toHaveBeenCalledWith('/lit', expect.any(Function));
    });
  });
});
