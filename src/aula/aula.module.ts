import { Module, forwardRef } from '@nestjs/common';
import { AulaService } from './aula.service';
import { AulaController } from './aula.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aula } from './entities/aula.entity';
import { AulaSocketModule } from '../aula-socket/aula-socket.module';

@Module({
  imports: [TypeOrmModule.forFeature([Aula]), forwardRef(() => AulaSocketModule)],
  controllers: [AulaController],
  providers: [AulaService],
  exports: [AulaService],
})
export class AulaModule {}
