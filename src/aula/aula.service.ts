import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';
import { ILike, Repository } from 'typeorm';
import { Aula } from './entities/aula.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { State } from './interfaces/state-values';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class AulaService {

  private logger = new Logger

  constructor(
    @InjectRepository(Aula)
    private AulaRepository: Repository<Aula>
  ) { }

  async create(createAulaDto: CreateAulaDto) {
    const { state = State.AVAILABLE, ...rest } = createAulaDto

    const aula = this.AulaRepository.create({ ...rest, state: state })

    try {
      await this.AulaRepository.save(aula)

      return { ...aula }
    } catch (error) {
      this.handleError(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0, state = undefined, query = undefined } = paginationDto

    const where: any = {};

    if (state !== undefined) {
      where.state = state;
    }

    if (query !== undefined) {
      where.name = ILike(`%${query}%`);
    }

    try {
      const [aulas, total] = await this.AulaRepository.findAndCount({
        take: limit,
        skip: offset,
        where,
      })

      const pages = limit > 0 ? Math.ceil(total / limit) : 0;

      return {
        total,
        pages,
        aulas
      }
    } catch (error) {
      this.handleError(error)
    }
  }

  async findOne(id: string) {
    const aula = await this.AulaRepository.findOneBy({ id })

    if (!aula) throw new NotFoundException(`Aula with id or name ${id} not found`)

    return aula
  }

  async update(id: string, updateAulaDto: UpdateAulaDto) {
    const aula = await this.AulaRepository.preload({ id, ...updateAulaDto })

    if (!aula) throw new NotFoundException(`Aula with id or name ${id} not found`)

    try {
      await this.AulaRepository.save(aula)

      return aula
    } catch (error) {
      this.handleError(error)
    }

  }

  async remove(id: string) {
    const aula = await this.findOne(id)

    await this.AulaRepository.remove(aula)

    return `DELETE HAS BEEN SUCCESSFUL`;
  }

  private handleError(error: any) {
    if (error.code === "23505")
      throw new BadRequestException(error.detail)

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }
}
