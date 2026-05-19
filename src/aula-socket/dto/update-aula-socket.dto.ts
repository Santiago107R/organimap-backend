import { PartialType } from '@nestjs/mapped-types';
import { CreateAulaSocketDto } from './create-aula-socket.dto';

export class UpdateAulaSocketDto extends PartialType(CreateAulaSocketDto) {
  id: number;
}
