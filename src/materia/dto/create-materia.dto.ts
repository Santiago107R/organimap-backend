import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class CreateMateriaDto {
    @ApiProperty({
        description: 'Materia Name',
        minLength: 4,
    })
    @IsString()
    @MinLength(4)
    name: string;
}
