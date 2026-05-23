import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CreateMapaDto {
    @ApiProperty({
        description: 'Mapa Name',
        nullable: false,
    })
    @IsString()
    name: string;
    
    @ApiProperty({
        description: 'Mapa Url',
        nullable: false,
    })
    @IsString()
    url: string;
}
