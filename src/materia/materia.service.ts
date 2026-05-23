import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { ILike, Repository } from 'typeorm';
import { Materia } from './entities/materia.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { handleDbError } from '../common/utils/handle-errors';

@Injectable()
export class MateriaService {

  constructor(
    @InjectRepository(Materia)
    private readonly materiaRepository: Repository<Materia>
  ) { }

  async create(createMateriaDto: CreateMateriaDto) {
    const materia = this.materiaRepository.create(createMateriaDto)

    try {
      await this.materiaRepository.save(materia);

      return this.findOne(materia.id);
    } catch (error) {
      handleDbError(error);
    }

  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0, query = undefined } = paginationDto;

    const [materias, total] = await this.materiaRepository.findAndCount({
      take: limit,
      relations: {
        docenteAula: true,
      },
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
    const materia = await this.materiaRepository.findOne({
      where: { id },
      relations: {
        docenteAula: true,
      },
    });

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

      return this.findOne(id);
    } catch (error) {
      handleDbError(error);
    }
  }

  async remove(id: string) {
    const materia = await this.findOne(id);

    await this.materiaRepository.remove(materia);

    return `DELETE WAS EXECUTED SUCCESSFULLY`;
  }

  async deleteAllRegisters() {
    const query = this.materiaRepository.createQueryBuilder('materia');

    try {

      return await query
        .delete()
        .where({})
        .execute();
    } catch (error) {
      handleDbError(error)
    }
  }

}
