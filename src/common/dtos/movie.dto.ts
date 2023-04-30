import { IsEmail, IsString, MaxLength, MinLength, IsOptional } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class CreateMovieDto{

    @IsString()
    title: string

    @IsString()
    genre: string

    @IsString()
    brand: string

    @IsString()
    @MinLength(4)
    @MaxLength(4)
    year: string

    @IsString()
    @IsOptional()
    thumbnail: string

    @IsString()
    @IsOptional()
    description: string

}

export class UpdateMovieDto{

    @IsString()
    @IsOptional()
    title: string

    @IsString()
    @IsOptional()
    genre: string

    @IsString()
    @IsOptional()
    brand: string

    @IsString()
    @MinLength(4)
    @MaxLength(4)
    @IsOptional()
    year: string

    @IsString()
    @IsOptional()
    thumbnail: string

    @IsString()
    @IsOptional()
    description: string

}

export class SearchMovieDto{

    @IsString()
    type: string

    @IsString()
    @IsOptional()
    title: string

    @IsString()
    @IsOptional()
    genre: string

    @IsString()
    @IsOptional()
    brand: string

    @IsString()
    @MinLength(4)
    @MaxLength(4)
    @IsOptional()
    year: string

}

export class FilterMovieDto{

    @IsString()
    @IsOptional()
    title: string

    @IsString()
    @IsOptional()
    genre: string

    @IsString()
    @IsOptional()
    brand: string

    @IsString()
    @MinLength(4)
    @MaxLength(4)
    @IsOptional()
    year: string

}