import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DocenteAula } from "../../docente-aula/entities/docente-aula.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Curso {
    @ApiProperty({
        example: "8c7fec6d-7d5a-4225-807a-8f0ccbd755a5",
        description: 'Curso ID',
        uniqueItems: true,
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: "7mo2da",
        description: "Curso Name",
        uniqueItems: true,
    })
    @Column('text', {
        unique: true,
    })
    name: string;

    @ApiProperty({
        example: "vespertino",
        description: "Curso Shift",
    })
    @Column('text')
    shift: string;

    @ApiProperty({
        example: 33,
        description: "Curso Number of students",
    })
    @Column('int')
    numberOfStudents: number;

    @OneToMany(
        () => DocenteAula,
        (docenteAula) => docenteAula.curso,
    )
    docenteAula: DocenteAula[];
}
