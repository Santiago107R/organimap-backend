import { IsIn, IsNumber, IsOptional, IsPositive, IsString, Min, MinLength } from "class-validator";
import { State } from "../interfaces/state-values";

export class CreateAulaDto {
    @IsString()
    @MinLength(1)
    name: string;

    @IsOptional()
    @IsString()
    @MinLength(1)
    description?: string;

    @IsNumber()
    @IsPositive()
    @Min(1)
    capacidad: number;

    @IsIn(['available', 'unavailable', 'busy'])
    state: State;
}
