import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateMapaDto } from './dto/create-mapa.dto';
import { UpdateMapaDto } from './dto/update-mapa.dto';
import { ILike, Repository } from 'typeorm';
import { Mapa } from './entities/mapa.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class MapaService {

  private logger = new Logger
  constructor(
    @InjectRepository(Mapa)
    private readonly mapaRepository: Repository<Mapa>
  ) { }

  async create(createMapaDto: CreateMapaDto) {
    const mapa = this.mapaRepository.create(createMapaDto);

    try {
      await this.mapaRepository.save(mapa);

      return mapa;
    } catch (error) {
      this.handleError(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0, query = undefined } = paginationDto;

    const [mapas, total] = await this.mapaRepository.findAndCount({
      take: limit,
      skip: offset,
      where: {
        name: query ? ILike(`%${query}%`) : undefined
      }
    });

    const pages = limit > 0 ? Math.ceil(total / limit) : 1;

    return {
      total,
      pages,
      mapas,
    }
  }

  async findOne(id: string) {
    const mapa = await this.mapaRepository.findOneBy({ id });

    if (!mapa) throw new NotFoundException(`Mapa with id ${id} not found`);

    return mapa;
  }

  async update(id: string, updateMapaDto: UpdateMapaDto) {
    const mapa = await this.mapaRepository.preload({
      id,
      ...updateMapaDto,
    })

    if (!mapa) throw new NotFoundException(`Mapa with id ${id} not found`);

    try {
      await this.mapaRepository.save(mapa);

      return mapa;
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string) {
    const mapa = await this.findOne(id);

    await this.mapaRepository.remove(mapa);

    return `DELETE WAS EXECUTED SUCCESSFULLY`;
  }

  private handleError(error: any) {
    if (error.code === "23505")
      throw new BadRequestException(error.detail)

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
