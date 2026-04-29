import { Type } from "class-transformer"
import { IsIn, IsOptional, IsPositive, Min } from "class-validator"
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
    @IsIn(['available', 'unavailable', 'busy'])
    state?: State
}