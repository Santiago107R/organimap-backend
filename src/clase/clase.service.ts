import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateClaseDto } from './dto/create-clase.dto';
import { UpdateClaseDto } from './dto/update-clase.dto';
import { Clase } from './entities/clase.entity';
import { User } from '../auth/entities/user.entity';
import { Aula } from '../aula/entities/aula.entity';
import { Curso } from '../curso/entities/curso.entity';
import { handleDbError } from '../common/utils/handle-errors';
import { Materia } from '../materia/entities/materia.entity';

@Injectable()
export class ClaseService {

    constructor(
        @InjectRepository(Clase)
        private readonly claseRepository: Repository<Clase>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Aula)
        private readonly aulaRepository: Repository<Aula>,

        @InjectRepository(Curso)
        private readonly cursoRepository: Repository<Curso>,

        @InjectRepository(Materia)
        private readonly materiaRepository: Repository<Materia>,
    ) { }

    async create(createClaseDto: CreateClaseDto) {
        const { userId, aulaId, cursoId, materiaId, ...rest } = createClaseDto;

        const [user, aula, curso, materia] = await Promise.all([
            this.userRepository.findOneBy({ id: userId }),
            this.aulaRepository.findOneBy({ id: aulaId }),
            this.cursoRepository.findOneBy({ id: cursoId }),
            this.materiaRepository.findOneBy({ id: materiaId })
        ]);

        if (!user) throw new BadRequestException(`User no encontrado con id ${userId}`);
        if (!user.roles?.includes('user')) {
            throw new BadRequestException('El usuario no tiene rol user');
        }
        if (!aula) throw new BadRequestException(`Aula no encontrada con id ${aulaId}`);
        if (!curso) throw new BadRequestException(`Curso no encontrado con id ${cursoId}`);
        if (!materia) throw new BadRequestException(`Materia no encontrado con id ${materiaId}`);

        const clase = this.claseRepository.create({
            user,
            aula,
            curso,
            materia,
            ...rest,
        });

        try {
            await this.claseRepository.save(clase);
            return clase;
        } catch (error) {
            handleDbError(error);
        }
    }

    async findAll() {
        return this.claseRepository.find();
    }

    async findOne(id: string) {
        const clase = await this.claseRepository.findOne({ where: { id } });

        if (!clase) throw new NotFoundException(`Registro clase con id ${id} no encontrado`);

        return clase;
    }

    async update(id: string, updateClaseDto: UpdateClaseDto) {
        const { userId, aulaId, cursoId, materiaId, ...rest } = updateClaseDto;

        let user: User | null = null;
        let aula: Aula | null = null;
        let curso: Curso | null = null;
        let materia: Materia | null = null;

        if (userId) {
            user = await this.userRepository.findOneBy({ id: userId });
            if (!user) throw new NotFoundException(`User no encontrado con id ${userId}`);
            if (!user.roles?.includes('user')) {
                throw new BadRequestException('El usuario no tiene rol user');
            }
        }

        if (aulaId) {
            aula = await this.aulaRepository.findOneBy({ id: aulaId });
            if (!aula) throw new BadRequestException(`Aula no encontrada con id ${aulaId}`);
        }

        if (cursoId) {
            curso = await this.cursoRepository.findOneBy({ id: cursoId });
            if (!curso) throw new BadRequestException(`Curso no encontrado con id ${cursoId}`);
        }

        if (materiaId) {
            materia = await this.materiaRepository.findOneBy({ id: materiaId });
            if (!materia) throw new BadRequestException(`Materia no encontrado con id ${materiaId}`);
        }

        const clase = await this.claseRepository.preload({
            id,
            ...rest,
            ...(user ? { user } : {}),
            ...(aula ? { aula } : {}),
            ...(curso ? { curso } : {}),
            ...(materia ? { materia } : {}),
        });

        if (!clase) throw new NotFoundException(`Registro clase con id ${id} no encontrado`);

        try {
            await this.claseRepository.save(clase);
            return clase;
        } catch (error) {
            handleDbError(error);
        }
    }

    async remove(id: string) {
        const clase = await this.findOne(id);
        await this.claseRepository.remove(clase);
        return { message: 'Registro eliminado correctamente' };
    }
}
