import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DocenteAula } from "../../docente-aula/entities/docente-aula.entity";

@Entity()
export class Curso {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
    })
    name: string;

    @Column('text')
    shift: string;

    @Column('int')
    numberOfStudents: number;

    @OneToMany(
        () => DocenteAula,
        (docenteAula) => docenteAula.curso,
    )
    docenteAula: DocenteAula;
}
