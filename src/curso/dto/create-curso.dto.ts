import { IsIn, IsNumber, IsPositive, IsString, MinLength } from "class-validator";

export class CreateCursoDto {
    @IsString()
    @MinLength(3)
    name: string;

    @IsString()
    @IsIn(['mañana', 'tarde', 'verpertino'])
    shift: string;

    @IsNumber()
    @IsPositive()
    numberOfStudents: number;
}
