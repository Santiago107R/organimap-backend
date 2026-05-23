import { IsIn, IsNumber, IsOptional, IsPositive, IsString, Min, MinLength } from "class-validator";
import { State } from "../interfaces/state-values";
import { ApiProperty } from "@nestjs/swagger";

export class CreateAulaDto {
    @ApiProperty({
        description: 'Aula Name',
        nullable: false,
        minLength: 1,
    })
    @IsString()
    @MinLength(1)
    name: string;

    @ApiProperty({
        description: 'Aula Description',
        nullable: true,
        minLength: 1,
    })
    @IsOptional()
    @IsString()
    @MinLength(1)
    description?: string;

    @ApiProperty({
        description: 'Aula Capacity',
        minimum: 1,
    })
    @IsNumber()
    @IsPositive()
    @Min(1)
    capacity: number;

    @ApiProperty({
        description: 'Aula State',
        default: State.AVAILABLE,
    })
    @IsOptional()
    @IsIn(['available', 'unavailable', 'busy'])
    state: State;
}