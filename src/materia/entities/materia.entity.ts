import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DocenteAula } from '../../docente-aula/entities/docente-aula.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Materia {
    @ApiProperty({
        example: '3704cbd5-b1d5-40e2-9e34-2549a8e83e12',
        description: 'Materia ID',
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'Programación',
        description: 'Materia Name',
        uniqueItems: true,
    })
    @Column('text', {
        unique: true,
    })
    name: string;

    @OneToMany(
        () => DocenteAula,
        (docenteAula) => docenteAula.materia,
    )
    docenteAula: DocenteAula[];
}
