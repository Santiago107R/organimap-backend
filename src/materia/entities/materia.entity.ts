import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Materia {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', {
        unique: true,
    })
    name: string;
}
