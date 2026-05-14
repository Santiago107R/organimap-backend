import { Type } from "class-transformer"
import { IsIn, IsOptional, IsPositive, IsString, Min } from "class-validator"
import { State } from "src/aula/interfaces/state-values"

export class PaginationDto {
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number

    @IsOptional()
    @Type(() => Number)
    offset?: number

    @IsOptional()
    @IsString()
    query: string;

    @IsOptional()
    @IsIn(['available', 'unavailable', 'busy'])
    state?: State
}