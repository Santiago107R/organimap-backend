import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { State } from "../interfaces/state-values";

@Entity()
export class Aula {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text')
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
}
