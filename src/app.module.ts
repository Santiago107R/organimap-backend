import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AulaModule } from './aula/aula.module';
import { CommonModule } from './common/common.module';
import { CursoModule } from './curso/curso.module';
import { MateriaModule } from './materia/materia.module';
import { AuthModule } from './auth/auth.module';
import { AulaSocketModule } from './aula-socket/aula-socket.module';
import { SeedModule } from './seed/seed.module';
import { ClaseModule } from './clase/clase.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +(configService.get('DB_PORT') ?? 5432),
        database: configService.get('DB_DATABASE'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        autoLoadEntities: true,
        synchronize: true,
        ssl: true,
        extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }),
      inject: [ConfigService],
    }),

    AuthModule,

    CommonModule,
    
    AulaModule,

    CursoModule,

    MateriaModule,
    
    ClaseModule,
    
    AulaSocketModule,
    
    SeedModule,

  ],
  controllers: [],
})
export class AppModule { }
