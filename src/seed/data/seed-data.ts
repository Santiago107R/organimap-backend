import * as bcrypt from 'bcrypt';
import { State } from '../../aula/interfaces/state-values';

export type EscolarRoles = 'admin' | 'docente' | 'secretario' | 'supervisor';
export type TurnoCurso = 'mañana' | 'tarde' | 'vespertino';
export type EstadoAula = State;

interface SeedUser {
    name: string;
    password: string;
    roles: EscolarRoles[];
    isActive: boolean;
}

interface SeedAula {
    name: string;
    description?: string;
    capacity: number;
    state: EstadoAula;
}

interface SeedCurso {
    name: string;
    shift: TurnoCurso;
    numberOfStudents: number;
}

interface SeedMateria {
    name: string;
}

interface SeedMapa {
    name: string;
    url: string;
}

interface SeedData {
    users: SeedUser[];
    aulas: SeedAula[];
    cursos: SeedCurso[];
    materias: SeedMateria[];
    mapas: SeedMapa[];
}

export const initialData: SeedData = {

    users: [
        {
            name: 'Santiago Robles',
            password: bcrypt.hashSync('SanUel82025', 10),
            roles: ['admin', 'secretario', 'docente'],
            isActive: true,
        },
        {
            name: 'Bianca Docente',
            password: bcrypt.hashSync('Docente123!', 10),
            roles: ['docente'],
            isActive: true,
        },
        {
            name: 'Secretaria General',
            password: bcrypt.hashSync('Secretaria123!', 10),
            roles: ['secretario'],
            isActive: true,
        }
    ],

    aulas: [
        {
            name: 'Laboratorio de Informática 1',
            description: 'Sala equipada con 30 computadoras y proyector',
            capacity: 30,
            state: State.AVAILABLE,
        },
        {
            name: 'Aula 102',
            description: 'Aula común con pizarrón tradicional',
            capacity: 35,
            state: State.AVAILABLE,
        },
        {
            name: 'Taller de Electrónica',
            description: 'Mesas de trabajo con osciloscopios y soldadores',
            capacity: 25,
            state: State.MAINTENANCE,
        },
        {
            name: 'Biblioteca',
            description: 'Espacio de lectura y estudio silencioso',
            capacity: 50,
            state: State.BUSY,
        }
    ],

    cursos: [
        {
            name: '7mo 2da',
            shift: 'vespertino',
            numberOfStudents: 33,
        },
        {
            name: '6to 1ra',
            shift: 'vespertino',
            numberOfStudents: 28,
        },
        {
            name: '5to 3ra',
            shift: 'vespertino',
            numberOfStudents: 30,
        }
    ],

    materias: [
        { name: 'Programación Full Stack' },
        { name: 'Base de Datos' },
        { name: 'Sistemas Operativos' },
        { name: 'Electrónica Digital' },
        { name: 'Matemática Técnica' }
    ],

    mapas: [
        {
            name: 'Planta Baja',
            url: 'https://tuservidor.com/mapas/planta-baja.png',
        },
        {
            name: 'Primer Piso',
            url: 'https://tuservidor.com/mapas/primer-piso.png',
        }
    ]
};