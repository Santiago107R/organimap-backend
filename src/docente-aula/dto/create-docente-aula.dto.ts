import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator';

export class CreateDocenteAulaDto {
    @ApiProperty({
        description: 'User ID'
    })
    @IsUUID()
    userId: string;

    @ApiProperty({
        description: 'Aula ID'
    })
    @IsUUID()
    aulaId: string;

    @ApiProperty({
        description: 'Curso ID'
    })
    @IsUUID()
    cursoId: string;
    
    @ApiProperty({
        description: 'Materia ID'
    })
    @IsUUID()
    materiaId: string;

    @ApiProperty({
        description: 'DocenteAula Day',
        nullable: false,
    })
    @IsString()
    @IsNotEmpty()
    day: string;

    @ApiProperty({
        description: 'DocenteAula Schedule',
        nullable: false,
    })
    @Matches(/^([01]\d|2[0-3]):[0-5]\d-([01]\d|2[0-3]):[0-5]\d$/)
    schedule: string;
}
