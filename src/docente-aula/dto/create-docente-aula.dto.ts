import { IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator';

export class CreateDocenteAulaDto {
    @IsUUID()
    userId: string;

    @IsUUID()
    aulaId: string;

    @IsUUID()
    cursoId: string;

    @IsString()
    @IsNotEmpty()
    dia: string;

    @Matches(/^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/)
    horario: string;
}
