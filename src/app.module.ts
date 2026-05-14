import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AulaModule } from './aula/aula.module';
import { CommonModule } from './common/common.module';
import { CursoModule } from './curso/curso.module';
import { FilesModule } from './files/files.module';
import { MateriaModule } from './materia/materia.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ssl: false,
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +(configService.get('DB_PORT') ?? 5432),
        database: configService.get('DB_DATABASE'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        autoLoadEntities: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),

    AulaModule,

    CommonModule,

    CursoModule,

    FilesModule,

    MateriaModule,
  ],
  controllers: [],
})
export class AppModule { }
