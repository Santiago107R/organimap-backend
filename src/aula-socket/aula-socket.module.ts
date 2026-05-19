import { Module, forwardRef } from '@nestjs/common';
import { AulaSocketService } from './aula-socket.service';
import { AulaSocketGateway } from './aula-socket.gateway';
import { AulaModule } from '../aula/aula.module';

@Module({
  imports: [forwardRef(() => AulaModule)],
  providers: [AulaSocketGateway, AulaSocketService],
  exports: [AulaSocketGateway],
})
export class AulaSocketModule {}
