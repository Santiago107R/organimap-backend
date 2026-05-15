import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Mapa {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
    })
    name: string;
}
