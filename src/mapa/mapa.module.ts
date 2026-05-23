import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapaService } from './mapa.service';
import { MapaController } from './mapa.controller';
import { Mapa } from './entities/mapa.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mapa,])],
  controllers: [MapaController],
  providers: [MapaService],
  exports: [
    MapaService,
  ]
})
export class MapaModule {}
