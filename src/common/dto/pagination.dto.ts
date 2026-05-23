import { Transform, Type } from "class-transformer"
import { IsArray, IsIn, IsOptional, IsPositive, IsString, Min } from "class-validator"
import { State } from "../../aula/interfaces/state-values"
import { ApiProperty } from "@nestjs/swagger";

export class PaginationDto {
    @ApiProperty({
        description: 'Pagination Limit',
        nullable: true,
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number

    @ApiProperty({
        description: 'Pagination Offset',
        nullable: true,
    })
    @IsOptional()
    @Type(() => Number)
    offset?: number

    @ApiProperty({
        description: 'Pagination Query',
        nullable: true,
    })
    @IsOptional()
    @IsString()
    query?: string;

    @ApiProperty({
        description: 'Pagination State',
        nullable: true,
    })
    @IsOptional()
    @IsIn(['available', 'maintenance', 'busy'])
    state?: State

    @ApiProperty({
        description: 'Pagination Roles',
        nullable: true,
    })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) => typeof value === 'string' ? value.split(',') : value)
    roles?: string[];
}