import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsOptional, IsPositive, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateAuthDto {
    @ApiProperty({
        description: 'User Name',
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'User Password',
        minLength: 6,
        maxLength: 50,
    })
    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @ApiProperty({
        description: 'User DNI',
        nullable: true,
    })
    @IsOptional()
    @IsNumber()
    @IsPositive()
    DNI?: number;

    @ApiProperty({
        description: 'User Roles',
    })
    @IsArray()
    roles: string[];
}
