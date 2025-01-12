import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';
import type { LitManagerService } from '../services/interfaces/lit-manager-service.js';

@injectable()
export class LitManagerController {
  constructor(@inject('LitManagerService') private litManagerService: LitManagerService) {}

  async index(_req: FastifyRequest, res: FastifyReply): Promise<void> {
    return res.status(200).send('Lit Managger Index');
  }

  async auth(_req: FastifyRequest, res: FastifyReply): Promise<void> {
    return res.status(200).send('/auth');
  }

  async getLits(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const lits = await this.litManagerService.getLits(req.query);
    return res.status(200).send(lits);
  }

  async litById(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const lit = await this.litManagerService.getLitById(req.query);
    return res.status(200).send(lit);
  }

  async createLit(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const created = await this.litManagerService.createLit(req.body);
    return res.status(201).send(created);
  }

  async deleteLit(req: FastifyRequest, res: FastifyReply): Promise<void> {
    await this.litManagerService.deleteLit(req.query);
    return res.status(204);
  }

  async litsByName(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const lits = await this.litManagerService.getLitsByName(req.query);
    return res.status(200).send(lits);
  }

  async litsByPhone(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const lits = await this.litManagerService.getLitsByPhone(req.query);
    return res.status(200).send(lits);
  }

  async litByEstate(req: FastifyRequest, res: FastifyReply): Promise<void> {
    const lits = await this.litManagerService.getLitsByEstate(req.query);
    return res.status(200).send(lits);
  }

  async notificationInfo(_req: FastifyRequest, res: FastifyReply): Promise<void> {
    return res.send('Notification information send to the clients');
  }

  async updateNotification(_req: FastifyRequest, res: FastifyReply): Promise<void> {
    return res.send('Update information send to the clients');
  }

  async logIn(_req: FastifyRequest, res: FastifyReply): Promise<void> {
    return res.send('log in the user {email and password}');
  }

  async logOut(_req: FastifyRequest, res: FastifyReply): Promise<void> {
    return res.send('log out the user');
  }

  async createUser(_req: FastifyRequest, res: FastifyReply): Promise<void> {
    return res.send('create the user {body DTO}');
  }

  async getUser(_req: FastifyRequest, res: FastifyReply): Promise<void> {
    return res.send('get the user by id');
  }

  async updatePassword(_req: FastifyRequest, res: FastifyReply): Promise<void> {
    return res.send('update the password by the provided');
  }

  // Register the fastify routes
  registerRoutes(server: FastifyInstance): void {
    server.get('/', (req, res) => this.index(req, res));
    server.get('/auth', (req, res) => this.auth(req, res));
    server.get('/lit', (req, res) => this.litById(req, res));
    server.post('/lit', (req, res) => this.createLit(req, res));
    server.delete('/lit', (req, res) => this.deleteLit(req, res));
    server.get('/lits', (req, res) => this.getLits(req, res));
    server.get('/lits-by-name', (req, res) => this.litsByName(req, res));
    server.get('/lits-by-phone', (req, res) => this.litsByPhone(req, res));
    server.get('/lits-by-estate', (req, res) => this.litByEstate(req, res));
    server.get('/notification-info', (req, res) => this.notificationInfo(req, res));
    server.get('/update-notification', (req, res) => this.updateNotification(req, res));
    server.post('/log-in', (req, res) => this.logIn(req, res));
    server.post('/log-out', (req, res) => this.logOut(req, res));
    server.post('/user', (req, res) => this.createUser(req, res));
    server.get('/user', (req, res) => this.getUser(req, res));
    server.post('/update-password', (req, res) => this.updatePassword(req, res));
  }
}
