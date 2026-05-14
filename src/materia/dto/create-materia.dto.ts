import { IsString, MinLength } from "class-validator";

export class CreateMateriaDto {
    @IsString()
    @MinLength(4)
    name: string;
}
