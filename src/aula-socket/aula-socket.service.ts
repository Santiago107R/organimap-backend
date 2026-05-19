import { Injectable } from '@nestjs/common';
import { AulaService } from '../aula/aula.service';
import { PaginationDto } from '../common/dto/pagination.dto';

@Injectable()
export class AulaSocketService {
  constructor(private readonly aulaService: AulaService) {}

  async findAll(paginationDto?: PaginationDto) {
    return this.aulaService.findAll(
      paginationDto ?? { limit: 10, offset: 0 },
    );
  }
}
