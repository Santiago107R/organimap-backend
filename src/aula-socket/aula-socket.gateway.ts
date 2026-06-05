import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AulaSocketService } from './aula-socket.service';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ApiResponse } from '@nestjs/swagger';

@WebSocketGateway({ cors: { origin: '*' } })
export class AulaSocketGateway {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly aulaSocketService: AulaSocketService) { }


  /**
   * @payload paginationDto - Estructura de paginación
   */
  @SubscribeMessage('findAllAulaSocket')
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  
  async findAll(
    @MessageBody() paginationDto: PaginationDto,
    @ConnectedSocket() client: Socket
  ) {
    const aulas = await this.aulaSocketService.findAll(paginationDto);
    client.emit('aulasUpdated', aulas);
  }

  @SubscribeMessage('findOneAulaSocket')
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden. Token related' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  async findOne(
    @MessageBody() id: string,
    @ConnectedSocket() client: Socket,    
  ) {
    const aula = await this.aulaSocketService.findOne(id);
    client.emit('aulaUpdated', aula);

  }

  async broadcastAulas(paginationDto?: any) {
    const aulas = await this.aulaSocketService.findAll(paginationDto);
    this.server.emit('aulasUpdated', aulas);
  }

  async broadcastAula(id: string) {
    const aula = await this.aulaSocketService.findOne(id);
    this.server.emit('aulaUpdated', aula);
  }
}