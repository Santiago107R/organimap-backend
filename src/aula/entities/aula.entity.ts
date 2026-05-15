import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { State } from "../interfaces/state-values";
import { DocenteAula } from "../../docente-aula/entities/docente-aula.entity";

@Entity()
export class Aula {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
    })
    name: string;

    @Column('text', {
        nullable: true
    })
    description?: string;

    @Column('int')
    capacity: number;

    @Column('enum', {
        enum: State,
        default: State.AVAILABLE
    })
    state: State;

    @OneToMany(
        () => DocenteAula,
        (docenteAula) => docenteAula.aula,
    )
    docenteAula: DocenteAula;
}
