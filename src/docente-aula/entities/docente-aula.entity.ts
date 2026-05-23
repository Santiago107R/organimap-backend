import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Aula } from '../../aula/entities/aula.entity';
import { Curso } from '../../curso/entities/curso.entity';
import { Materia } from '../../materia/entities/materia.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class DocenteAula {
    @ApiProperty({
        example: 'e4809c2f-d26d-44ea-9f58-d15dba3cd3ac',
        description: 'DocenteAula ID',
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: '960c1cca-ecea-4737-a153-1cd83f88685b',
        description: 'User ID',
    })
    @ManyToOne(
        () => User,
        (user) => user.docenteAula,
        { eager: true, nullable: false },
    )
    @JoinColumn({ name: 'docenteId' })
    user: User;

    @ApiProperty({
        example: '691cc02d-bc74-46f5-8e81-2233102e7a1a',
        description: 'Aula ID',
    })
    @ManyToOne(
        () => Aula,
        (aula) => aula.docenteAula,
        { eager: true, nullable: false },
    )
    @JoinColumn({ name: 'aulaId' })
    aula: Aula;

    @ApiProperty({
        example: '8c7fec6d-7d5a-4225-807a-8f0ccbd755a5',
        description: 'Curso ID',
    })
    @ManyToOne(
        () => Curso,
        (curso) => curso.docenteAula,
        { eager: true, nullable: false },
    )
    @JoinColumn({ name: 'cursoId' })
    curso: Curso;

    @ApiProperty({
        example: '3704cbd5-b1d5-40e2-9e34-2549a8e83e12',
        description: 'Materia ID',
    })
    @ManyToOne(
        () => Materia,
        (materia) => materia.docenteAula,
        { eager: true, nullable: false },
    )
    @JoinColumn({ name: 'materiaId' })
    materia: Curso;

    @ApiProperty({
        example: 'Lunes',
        description: 'DocenteAula Day',
    })
    @Column('text')
    day: string;

    @ApiProperty({
        example: '17:45-19:45',
        description: 'DocenteAula Schedule',
    })
    @Column('text')
    schedule: string;
}
