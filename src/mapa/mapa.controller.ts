import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { MapaService } from './mapa.service';
import { CreateMapaDto } from './dto/create-mapa.dto';
import { UpdateMapaDto } from './dto/update-mapa.dto';
import type { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('mapa')
export class MapaController {
  constructor(private readonly mapaService: MapaService) {}

  @Post()
  create(@Body() createMapaDto: CreateMapaDto) {
    return this.mapaService.create(createMapaDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.mapaService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.mapaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateMapaDto: UpdateMapaDto) {
    return this.mapaService.update(id, updateMapaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.mapaService.remove(id);
  }
}
