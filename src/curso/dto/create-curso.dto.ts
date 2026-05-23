import { ApiProperty } from "@nestjs/swagger";
import { IsIn, IsNumber, IsPositive, IsString, MinLength } from "class-validator";

export class CreateCursoDto {
    @ApiProperty({
        description: 'Curso Name',
        minLength: 3,
    })
    @IsString()
    @MinLength(3)
    name: string;

    @ApiProperty({
        description: 'Curso Shift',
        enum: ["mañana", "tarde", "vespertino"],
    })
    @IsString()
    @IsIn(['mañana', 'tarde', 'vespertino'])
    shift: string;

    @ApiProperty({
        description: 'Curso Number of students',
    })
    @IsNumber()
    @IsPositive()
    numberOfStudents: number;
}
