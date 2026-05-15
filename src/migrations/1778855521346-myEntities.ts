import { MigrationInterface, QueryRunner } from "typeorm";

export class MyEntities1778855521346 implements MigrationInterface {
    name = 'MyEntities1778855521346'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "materia" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, CONSTRAINT "UQ_013341865da07023a15e6fb4214" UNIQUE ("name"), CONSTRAINT "PK_a8b21a045c6a7d9cfffc3a2ab26" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "mapa" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, CONSTRAINT "UQ_4cee76ff3a50379aa3883add5e5" UNIQUE ("name"), CONSTRAINT "PK_a29030f21ea92b0c652646f6ef4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "password" text NOT NULL, "DNI" integer, "roles" text array NOT NULL DEFAULT '{user}', "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_065d4d8f3b5adb4a08841eae3c8" UNIQUE ("name"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."aula_state_enum" AS ENUM('available', 'unavailable', 'busy')`);
        await queryRunner.query(`CREATE TABLE "aula" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "description" text, "capacity" integer NOT NULL, "state" "public"."aula_state_enum" NOT NULL DEFAULT 'available', CONSTRAINT "UQ_2fbc0b636dee157b820da8722c2" UNIQUE ("name"), CONSTRAINT "PK_f4b5d2e277c6146e2572c6ee76a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "docente_aula" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "dia" text NOT NULL, "horario" text NOT NULL, "docenteId" uuid NOT NULL, "aulaId" uuid NOT NULL, "cursoId" uuid NOT NULL, CONSTRAINT "PK_c09dea163a76045edcd6ae82cfc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "curso" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "shift" text NOT NULL, "numberOfStudents" integer NOT NULL, CONSTRAINT "UQ_40754598a8f2bc9faa48bc881ba" UNIQUE ("name"), CONSTRAINT "PK_76073a915621326fb85f28ecc5d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "docente_aula" ADD CONSTRAINT "FK_3cd410c77525938ef5eabaeaee8" FOREIGN KEY ("docenteId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "docente_aula" ADD CONSTRAINT "FK_d88408398e02deb108a9893f4a8" FOREIGN KEY ("aulaId") REFERENCES "aula"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "docente_aula" ADD CONSTRAINT "FK_54aa98a6aa01b2f452589ecebb8" FOREIGN KEY ("cursoId") REFERENCES "curso"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "docente_aula" DROP CONSTRAINT "FK_54aa98a6aa01b2f452589ecebb8"`);
        await queryRunner.query(`ALTER TABLE "docente_aula" DROP CONSTRAINT "FK_d88408398e02deb108a9893f4a8"`);
        await queryRunner.query(`ALTER TABLE "docente_aula" DROP CONSTRAINT "FK_3cd410c77525938ef5eabaeaee8"`);
        await queryRunner.query(`DROP TABLE "curso"`);
        await queryRunner.query(`DROP TABLE "docente_aula"`);
        await queryRunner.query(`DROP TABLE "aula"`);
        await queryRunner.query(`DROP TYPE "public"."aula_state_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "mapa"`);
        await queryRunner.query(`DROP TABLE "materia"`);
    }

}
