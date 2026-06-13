import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Curso } from './entities/curso.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { handleDbError } from '../common/utils/handle-errors';

@Injectable()
export class CursoService {

  constructor(
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
  ) { }

  async create(createCursoDto: CreateCursoDto) {
    const curso = this.cursoRepository.create(createCursoDto);

    try {
      await this.cursoRepository.save(curso);

      return this.findOne(curso.id);
    } catch (error) {
      handleDbError(error);
    }

  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0, query = undefined } = paginationDto;

    const [cursos, total] = await this.cursoRepository.findAndCount({
      take: limit,
      skip: offset,
      relations: {
        clase: true,
      },
      where: {
        name: query ? ILike(`%${query}%`) : undefined
      }
    });

    const pages = limit > 0 ? Math.ceil(total / limit) : 1;

    return {
      total,
      pages,
      cursos,
    }
  }

  async findOne(id: string) {
    const curso = await this.cursoRepository.findOne({
      where: { id },
      relations: {
        clase: true,
      },
    });

    if (!curso) throw new NotFoundException(`Curso with id ${id} not found`);

    return curso;
  }

  async update(id: string, updateCursoDto: UpdateCursoDto) {
    const curso = await this.cursoRepository.preload({
      id,
      ...updateCursoDto,
    })

    if (!curso) throw new NotFoundException(`Curso with id ${id} not found`);

    try {
      await this.cursoRepository.save(curso);

      return this.findOne(id);
    } catch (error) {
      handleDbError(error);
    }
  }

  async remove(id: string) {
    const curso = await this.findOne(id);

    await this.cursoRepository.remove(curso);

    return `DELETE WAS EXECUTED SUCCESSFULLY`;
  }

  async deleteAllRegisters() {
    const query = this.cursoRepository.createQueryBuilder('curso');

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
