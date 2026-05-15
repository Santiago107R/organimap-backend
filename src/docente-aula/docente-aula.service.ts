import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDocenteAulaDto } from './dto/create-docente-aula.dto';
import { UpdateDocenteAulaDto } from './dto/update-docente-aula.dto';
import { DocenteAula } from './entities/docente-aula.entity';
import { User } from '../auth/entities/user.entity';
import { Aula } from '../aula/entities/aula.entity';
import { Curso } from '../curso/entities/curso.entity';

@Injectable()
export class DocenteAulaService {
    private readonly logger = new Logger(DocenteAulaService.name);

    constructor(
        @InjectRepository(DocenteAula)
        private readonly docenteAulaRepository: Repository<DocenteAula>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(Aula)
        private readonly aulaRepository: Repository<Aula>,

        @InjectRepository(Curso)
        private readonly cursoRepository: Repository<Curso>,
    ) { }

    async create(createDocenteAulaDto: CreateDocenteAulaDto) {
        const { userId, aulaId, cursoId, ...rest } = createDocenteAulaDto;

        const [user, aula, curso] = await Promise.all([
            this.userRepository.findOneBy({ id: userId }),
            this.aulaRepository.findOneBy({ id: aulaId }),
            this.cursoRepository.findOneBy({ id: cursoId }),
        ]);

        if (!user) throw new BadRequestException(`User no encontrado con id ${userId}`);
        if (!user.roles?.includes('docente')) {
            throw new BadRequestException('El usuario no tiene rol docente');
        }
        if (!aula) throw new BadRequestException(`Aula no encontrada con id ${aulaId}`);
        if (!curso) throw new BadRequestException(`Curso no encontrado con id ${cursoId}`);

        const docenteAula = this.docenteAulaRepository.create({
            user,
            aula,
            curso,
            ...rest,
        });

        try {
            await this.docenteAulaRepository.save(docenteAula);
            return docenteAula;
        } catch (error) {
            this.handleError(error);
        }
    }

    async findAll() {
        return this.docenteAulaRepository.find();
    }

    async findOne(id: string) {
        const docenteAula = await this.docenteAulaRepository.findOne({ where: { id } });

        if (!docenteAula) throw new NotFoundException(`Registro docente_aula con id ${id} no encontrado`);

        return docenteAula;
    }

    async update(id: string, updateDocenteAulaDto: UpdateDocenteAulaDto) {
        const { userId, aulaId, cursoId, ...rest } = updateDocenteAulaDto;

        let user: User | null = null;
        let aula: Aula | null = null;
        let curso: Curso | null = null;

        if (userId) {
            user = await this.userRepository.findOneBy({ id: userId });
            if (!user) throw new NotFoundException(`User no encontrado con id ${userId}`);
            if (!user.roles?.includes('docente')) {
                throw new BadRequestException('El usuario no tiene rol docente');
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

        const docenteAula = await this.docenteAulaRepository.preload({
            id,
            ...rest,
            ...(user ? { user } : {}),
            ...(aula ? { aula } : {}),
            ...(curso ? { curso } : {}),
        });

        if (!docenteAula) throw new NotFoundException(`Registro docente_aula con id ${id} no encontrado`);

        try {
            await this.docenteAulaRepository.save(docenteAula);
            return docenteAula;
        } catch (error) {
            this.handleError(error);
        }
    }

    async remove(id: string) {
        const docenteAula = await this.findOne(id);
        await this.docenteAulaRepository.remove(docenteAula);
        return { message: 'Registro eliminado correctamente' };
    }

    private handleError(error: any) {
        if (error.code === '23505') throw new BadRequestException(error.detail);
        this.logger.error(error);
        throw new InternalServerErrorException('Error inesperado, revisa los logs del servidor');
    }
}
