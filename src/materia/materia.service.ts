import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { ILike, Repository } from 'typeorm';
import { Materia } from './entities/materia.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class MateriaService {

  private logger = new Logger
  constructor(
    @InjectRepository(Materia)
    private readonly materiaRepository: Repository<Materia>
  ) { }

  async create(createMateriaDto: CreateMateriaDto) {
    const materia = this.materiaRepository.create(createMateriaDto)

    try {
      await this.materiaRepository.save(materia);

      return materia
    } catch (error) {
      this.handleError(error);
    }

  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0, query = undefined } = paginationDto;

    const [materias, total] = await this.materiaRepository.findAndCount({
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
      materias,
    }
  }

  async findOne(id: string) {
    const materia = await this.materiaRepository.findOneBy({ id });

    if (!materia) throw new NotFoundException(`Materia with id ${id} not found`);

    return materia;
  }

  async update(id: string, updateMateriaDto: UpdateMateriaDto) {
    const materia = await this.materiaRepository.preload({
      id,
      ...updateMateriaDto,
    })

    if (!materia) throw new NotFoundException(`Materia with id ${id} not found`);

    try {
      await this.materiaRepository.save(materia);

      return materia;
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string) {
    const materia = await this.findOne(id);

    await this.materiaRepository.remove(materia);

    return `DELETE WAS EXECUTED SUCCESSFULLY`;
  }

  private handleError(error: any) {
    if (error.code === "23505")
      throw new BadRequestException(error.detail)

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
