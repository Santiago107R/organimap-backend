import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Mapa {
    @ApiProperty({
        example: '3eae7d2f-a605-4779-ad82-f93675038abf',
        description: 'Mapa ID',
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'Aula Planta Baja',
        description: 'Mapa Name',
        uniqueItems: true,
    })
    @Column('text', {
        unique: true,
    })
    name: string;

    @ApiProperty({
        example: 'https://elordenmundial.com/wp-content/uploads/2021/03/mapa-politico-brasil.png',
        description: 'Mapa Url',
    })
    @Column('text')
    url: string;
}
