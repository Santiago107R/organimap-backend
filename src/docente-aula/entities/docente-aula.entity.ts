import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Aula } from '../../aula/entities/aula.entity';
import { Curso } from '../../curso/entities/curso.entity';

@Entity()
export class DocenteAula {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(
        () => User,
        (user) => user.docenteAula,
        { eager: true, nullable: false },
    )
    @JoinColumn({ name: 'docenteId' })
    user: User;

    @ManyToOne(
        () => Aula,
        (aula) => aula.docenteAula,
        { eager: true, nullable: false },
    )
    @JoinColumn({ name: 'aulaId' })
    aula: Aula;

    @ManyToOne(
        () => Curso,
        (curso) => curso.docenteAula,
        { eager: true, nullable: false },
    )
    @JoinColumn({ name: 'cursoId' })
    curso: Curso;

    @Column('text')
    dia: string;

    @Column('text')
    horario: string;
}
