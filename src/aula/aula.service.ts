import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';
import type { Repository } from 'typeorm';
import { Aula } from './entities/aula.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { State } from './interfaces/state-values';
import { type PaginationDto } from 'src/common/dto/pagination.dto';
import { isUUID } from 'class-validator'

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
    const { limit = 10, offset = 0, state = undefined } = paginationDto

    const whereCondition: any = {}

    if (state !== undefined) {
      whereCondition.state = state
    }

    try {
      const [aulas, total] = await this.AulaRepository.findAndCount({
        take: limit,
        skip: offset,
        where: whereCondition,
      })

      const pages = Math.ceil(total / limit)

      return { total, pages, aulas }
    } catch (error) {
      this.handleError(error)
    }
  }

  async findOne(term: string) {
    let aula: Aula | null

    if (isUUID(term)) {
      aula = await this.AulaRepository.findOneBy({ id: term })
    } else {
      const queryBuilder = this.AulaRepository.createQueryBuilder('aula')
      aula = await queryBuilder.where('LOWER(name) =:name', {
        name: term.trim().toLowerCase()
      })
        .getOne()
    }

    if (!aula) throw new NotFoundException(`Aula with id or name ${term} not found`)

      return aula
  }

  async update(id: string, updateAulaDto: UpdateAulaDto) {
    const aula = await this.AulaRepository.preload({id, ...updateAulaDto})

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
