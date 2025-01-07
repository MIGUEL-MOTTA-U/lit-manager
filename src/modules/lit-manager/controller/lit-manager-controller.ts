import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { inject, injectable } from 'tsyringe';
import type { LitManagerService } from '../services/interfaces/lit-manager-service.js';

@injectable()
export class LitManagerController {
  constructor(@inject('LitManagerService') private litManagerService: LitManagerService) {}

  async index(req: FastifyRequest, res: FastifyReply): Promise<void> {
    try {
      await this.litManagerService.getLits();
    } catch (err) {
      console.log(`There has been an error with the service ${err}`);
    }
    return res.send('Hola Sapa este es el index xD');
  }

  async auth(req: FastifyRequest, res: FastifyReply): Promise<void> {
    return res.send('Feature');
  }

  async litById(req: FastifyRequest, res: FastifyReply): Promise<void> {
    return res.send('Lit by id {lit id}');
  }

  async litsNotified(req: FastifyRequest, res: FastifyReply): Promise<void> {
    return res.send('Lits Notified with pagination {size, current page}');
  }

  async litsReceived(req: FastifyRequest, res: FastifyReply): Promise<void> {
    return res.send('Lits Received the date {date} with pagination');
  }

  async litsByName(req: FastifyRequest, res: FastifyReply): Promise<void> {
    return res.send('Lits client name {client name} with pagination');
  }

  async litsByPhone(req: FastifyRequest, res: FastifyReply): Promise<void> {
    return res.send('Lits by client phone {client phone number} with pagination');
  }

  async litByEstate(req: FastifyRequest, res: FastifyReply): Promise<void> {
    return res.send('Lits by estate Id {estate id} with pagination');
  }

  async notificationInfo(req: FastifyRequest, res: FastifyReply): Promise<void> {
    return res.send('Notification information send to the clients');
  }

  async updateNotification(req: FastifyRequest, res: FastifyReply): Promise<void> {
    return res.send('Update information send to the clients');
  }

  async logIn(req: FastifyRequest, res: FastifyReply): Promise<void> {
    return res.send('log in the user {email and password}');
  }

  async logOut(req: FastifyRequest, res: FastifyReply): Promise<void> {
    return res.send('log out the user');
  }

  async createUser(req: FastifyRequest, res: FastifyReply): Promise<void> {
    return res.send('create the user {body DTO}');
  }

  async getUser(req: FastifyRequest, res: FastifyReply): Promise<void> {
    return res.send('get the user by id');
  }

  async updatePassword(req: FastifyRequest, res: FastifyReply): Promise<void> {
    return res.send('update the password by the provided');
  }

  // Register the fastify routes
  registerRoutes(server: FastifyInstance): void {
    server.get('/', (req, res) => this.index(req, res));
    server.get('/auth', (req, res) => this.auth(req, res));
    server.get('/lit/:id', (req, res) => this.litById(req, res));
    server.get('/lits-notified', (req, res) => this.litsNotified(req, res));
    server.get('/lits-received', (req, res) => this.litsReceived(req, res));
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
