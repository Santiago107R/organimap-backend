import { PartialType } from '@nestjs/swagger';
import { CreateAuthDto } from './create-user-auth.dto';

export class UpdateAuthDto extends PartialType(CreateAuthDto) { }
