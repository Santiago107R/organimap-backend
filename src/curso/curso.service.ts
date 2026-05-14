import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, Query } from '@nestjs/common';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { ILike, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Curso } from './entities/curso.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { error } from 'console';

@Injectable()
export class CursoService {

  private logger = new Logger
  constructor(
    @InjectRepository(Curso)
    private readonly cursoRepository: Repository<Curso>,
  ) { }

  async create(createCursoDto: CreateCursoDto) {
    const curso = this.cursoRepository.create(createCursoDto);

    try {
      await this.cursoRepository.save(curso);

      return curso;
    } catch (error) {
      this.handleError(error);
    }

  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0, query = undefined } = paginationDto;

    const [cursos, total] = await this.cursoRepository.findAndCount({
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
      cursos,
    }
  }

  async findOne(id: string) {
    const curso = await this.cursoRepository.findOneBy({ id });

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

      return curso;
    } catch (error) {
      this.handleError(error);
    }
  }

  async remove(id: string) {
    const curso = await this.findOne(id);
    
    await this.cursoRepository.remove(curso);

    return `DELETE WAS EXECUTED SUCCESSFULLY`;
  }

  private handleError(error: any) {
    if (error.code === "23505")
      throw new BadRequestException(error.detail)

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
