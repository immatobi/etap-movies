import { IsEmail, IsString, MinLength } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

export class CreateUserDto{

    @IsEmail()
    email: string

    @IsString()
    @MinLength(8)
    password: string

    @IsString()
    username: string

}

export class LoginUserDto{

    @IsEmail()
    email: string

    @IsString()
    password: string

}

export class UserDto{

    @Expose()
    id: string;

    @Expose()
    email: string;

    @Expose()
    userType: string;

    @Expose()
    isUser: string;

    @Expose()
    username: string;

    @Expose()
    roles: string;

}