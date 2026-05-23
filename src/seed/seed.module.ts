import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CursoModule } from '../curso/curso.module';
import { MapaModule } from '../mapa/mapa.module';
import { AulaModule } from '../aula/aula.module';
import { MateriaModule } from '../materia/materia.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [
    AulaModule,
    CursoModule,
    MateriaModule,
    MapaModule,
    AuthModule,
    ConfigModule,
  ],
})
export class SeedModule {}
