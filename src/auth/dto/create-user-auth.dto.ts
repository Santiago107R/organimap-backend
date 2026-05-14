import { IsArray, IsNumber, IsOptional, IsPositive, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class CreateAuthDto {
    @IsString()
    name: string;

    @IsString()
    @MinLength(6)
    @MaxLength(50)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    password: string;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    DNI?: number;

    @IsString()
    @IsArray()
    roles: string[];
}
