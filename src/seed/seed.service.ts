import { Injectable } from '@nestjs/common';
import { initialData } from './data/seed-data';
import { ConfigService } from '@nestjs/config';
import { AulaService } from '../aula/aula.service';
import { AuthService } from '../auth/auth.service';
import { MapaService } from '../mapa/mapa.service';
import { MateriaService } from '../materia/materia.service';
import { CursoService } from '../curso/curso.service';

@Injectable()
export class SeedService {
  constructor(
    private readonly aulaService: AulaService,
    private readonly cursoService: CursoService,
    private readonly authService: AuthService,
    private readonly mapaService: MapaService,
    private readonly materiaService: MateriaService,

    private readonly configService: ConfigService
  ) { }

  async runSeed() {
    await this.deleteTables();

    await this.insertUsers();
    await this.insertAulas();
    await this.insertCursos();
    await this.insertMaterias();
    await this.insertMapas();

    return 'SEED EXECUTED SUCCESSFULLY';
  }

  private async deleteTables() {
    await this.aulaService.deleteAllRegisters();
    await this.cursoService.deleteAllRegisters();
    await this.mapaService.deleteAllRegisters();
    await this.materiaService.deleteAllRegisters();
    await this.authService.deleteAllRegisters();
  }

  private async insertUsers() {
    const seedUsers = initialData.users;

    await Promise.all(
      seedUsers.map(user => this.authService.create(user))
    );

    return true;
  }

  private async insertAulas() {
    const seedAulas = initialData.aulas;

    await Promise.all(
      seedAulas.map(aula => this.aulaService.create(aula))
    );

    return true;
  }

  private async insertCursos() {
    const seedCursos = initialData.cursos;

    await Promise.all(
      seedCursos.map(curso => this.cursoService.create(curso))
    );

    return true;
  }

  private async insertMaterias() {
    const seedMaterias = initialData.materias;

    await Promise.all(
      seedMaterias.map(materia => this.materiaService.create(materia))
    );

    return true;
  }

  private async insertMapas() {
    const seedMapas = initialData.mapas;
    const hostApi = this.configService.get('HOST_API') || 'http://localhost:3000/api';

    await Promise.all(
      seedMapas.map(mapa => {
        return this.mapaService.create({
          ...mapa,
          url: `${hostApi}/files/mapas/${mapa.name.toLowerCase().replace(/ /g, '_')}.png`,
        });
      })
    );

    return true;
  }
}