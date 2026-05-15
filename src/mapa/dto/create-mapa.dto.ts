import { IsString } from "class-validator";

export class CreateMapaDto {
    @IsString()
    name: string;
}
