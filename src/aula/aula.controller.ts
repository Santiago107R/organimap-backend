import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, Inject, forwardRef } from '@nestjs/common';
import { AulaService } from './aula.service';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { AulaSocketGateway } from '../aula-socket/aula-socket.gateway';

@Controller('aula')
export class AulaController {
  constructor(
    private readonly aulaService: AulaService,
    @Inject(forwardRef(() => AulaSocketGateway))
    private readonly aulaSocketGateway: AulaSocketGateway,
  ) {}

  @Post()
  async create(@Body() createAulaDto: CreateAulaDto) {
    const aula = await this.aulaService.create(createAulaDto);
    await this.aulaSocketGateway.broadcastAulas();
    return aula;
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.aulaService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.aulaService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateAulaDto: UpdateAulaDto) {
    const aula = await this.aulaService.update(id, updateAulaDto);
    await this.aulaSocketGateway.broadcastAulas();
    return aula;
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    const result = await this.aulaService.remove(id);
    await this.aulaSocketGateway.broadcastAulas();
    return result;
  }
}
