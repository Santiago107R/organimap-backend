import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DocenteAula } from '../../docente-aula/entities/docente-aula.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true
    })
    name: string;

    @Column('text', {
        select: false,
    })
    password: string;

    @Column('int', {
        nullable: true,
    })
    DNI?: number;

    @Column('text', {
        array: true,
        default: ['user'],
    })
    roles: string[];

    @Column('bool', {
        default: true,
    })
    isActive: boolean;

    @OneToMany(
        () => DocenteAula,
        (docenteAula) => docenteAula.user
    )
    docenteAula: DocenteAula;

}