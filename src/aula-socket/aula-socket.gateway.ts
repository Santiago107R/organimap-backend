import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { AulaSocketService } from './aula-socket.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class AulaSocketGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly aulaSocketService: AulaSocketService) {}

  @SubscribeMessage('findAllAulaSocket')
  async findAll(@MessageBody() paginationDto?: any) {
    return this.aulaSocketService.findAll(paginationDto);
  }

  async broadcastAulas(paginationDto?: any) {
    const aulas = await this.aulaSocketService.findAll(paginationDto);
    this.server.emit('aulasUpdated', aulas);
  }
}
