import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AulaSocketService } from './aula-socket.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class AulaSocketGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly aulaSocketService: AulaSocketService) { }

  @SubscribeMessage('findAllAulaSocket')
  async findAll(
    @MessageBody() paginationDto: any,
    @ConnectedSocket() client: Socket
  ) {
    const aulas = await this.aulaSocketService.findAll(paginationDto);
    client.emit('aulasUpdated', aulas);
  }

  @SubscribeMessage('findOneAulaSocket')
  async findOne(@MessageBody() id: string) {
    return this.aulaSocketService.findOne(id);
  }

  async broadcastAulas(paginationDto?: any) {
    const aulas = await this.aulaSocketService.findAll(paginationDto);
    this.server.emit('aulasUpdated', aulas);
  }
}