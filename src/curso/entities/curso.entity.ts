import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Curso {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
    name: string;

    @Column('text')
    shift: string;

    @Column('int')
    numberOfStudents: number;
}
