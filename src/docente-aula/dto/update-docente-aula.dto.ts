import { PartialType } from '@nestjs/swagger';
import { CreateDocenteAulaDto } from './create-docente-aula.dto';

export class UpdateDocenteAulaDto extends PartialType(CreateDocenteAulaDto) { }
