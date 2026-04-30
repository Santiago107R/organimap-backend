import { MigrationInterface, QueryRunner } from "typeorm";

export class Aula1777558943431 implements MigrationInterface {
    name = 'Aula1777558943431'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "aula" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "description" text, "capacity" integer NOT NULL, "state" "public"."aula_state_enum" NOT NULL DEFAULT 'available', CONSTRAINT "PK_f4b5d2e277c6146e2572c6ee76a" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "aula"`);
    }

}
